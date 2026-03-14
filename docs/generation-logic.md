# IG 圖文生成器 — 完整思維鏈與生成邏輯

## 目錄

1. [設計思維](#設計思維)
2. [完整生成流程](#完整生成流程)
3. [Prompt 結構設計](#prompt-結構設計)
4. [前端展示邏輯](#前端展示邏輯)
5. [目前的限制與取捨](#目前的限制與取捨)

---

## 設計思維

核心理念是**「兩階段生成」**——先用文字 AI 規劃內容策略，再用圖像 AI 逐張生成視覺。

模擬的是一個「內容策略師 + 平面設計師」的雙人協作流程：

| 角色 | 對應階段 | 使用模型 |
|------|---------|---------|
| 內容策略師 | 第一階段：內容規劃 | Gemini 2.5 Flash（文字） |
| 平面設計師 | 第二階段：圖片生成 | Gemini 3 Pro Image（圖像） |

---

## 完整生成流程

### 第一階段：內容規劃（Edge Function: `generate-post-content`）

```
用戶輸入主題 + 方向
       ↓
  Gemini 2.5 Flash（文字模型）
       ↓
  輸出結構化 JSON
```

**輸出格式：**

```json
{
  "main": {
    "text": "封面標題文案",
    "layout": "封面的視覺設計描述（背景、元素、色調等）"
  },
  "content": [
    {
      "text": "第 1 頁文案內容",
      "layout": "第 1 頁的視覺設計描述"
    },
    {
      "text": "第 2 頁文案內容",
      "layout": "第 2 頁的視覺設計描述"
    }
  ]
}
```

AI 在此階段決定：
- 封面要用什麼吸睛標題
- 整組貼文要分幾頁（3～6 頁）、每頁講什麼
- 每頁的視覺風格建議（顏色、排版、元素）

### 第二階段：圖片生成（Edge Function: `generate-post-image`）

關鍵設計：**鏈式風格傳遞（Chained Style Transfer）**

```
封面圖生成
  輸入：text + layout + isMain=true
  輸出：封面圖片（base64 URL）
       ↓ 封面圖作為參考
第 1 頁生成
  輸入：text + layout + previousImageUrl=封面圖 + overallTheme
  輸出：第 1 頁圖片
       ↓ 第 1 頁作為參考
第 2 頁生成
  輸入：text + layout + previousImageUrl=第1頁 + overallTheme
  輸出：第 2 頁圖片
       ↓
  ...依此類推，每張都參考前一張
```

**風格一致性做法：**
- 每張圖生成時，將前一張圖以 `image_url` 形式傳入
- Prompt 中加入 `"Based on the style of this reference image, create a new slide"`
- 同時傳入 `overallTheme`（封面的 layout 描述）作為整體風格錨點

---

## Prompt 結構設計

### 第一階段：內容規劃 Prompt

#### System Prompt（4 層結構）

```
第 1 層：角色設定
  → "你是專業的社群媒體內容策略師，專門為 Instagram 創建高互動的圖文貼文"

第 2 層：任務定義
  → "根據用戶提供的主題，生成一系列吸睛的 IG 圖文貼文（3-6 張圖）"

第 3 層：輸出格式
  → 嚴格定義 JSON schema，包含 main（封面）和 content（內容陣列）

第 4 層：設計原則（4 條品質約束）
  → 1. 封面要有強烈的視覺衝擊力，標題要吸睛
  → 2. 每頁的視覺風格要統一協調
  → 3. 文案要簡潔有力，適合社群閱讀
  → 4. 設計描述要詳細具體，方便後續圖片生成
```

#### User Prompt（3 層結構）

```
第 1 層：輸入參數
  → 主題：${topic}
  → 方向：${direction} 或 "請自由發揮"

第 2 層：任務指令
  → "請幫我生成會爆的 IG 圖文貼文"

第 3 層：格式要求
  → "每一頁分別列出文案跟想呈現的樣子，用 JSON 輸出"
```

### 第二階段：圖片生成 Prompt

#### 封面 Prompt（5 層結構）

```
第 1 層：任務
  → "Create an Instagram carousel cover image"

第 2 層：設計需求
  → ${layout}（第一階段 AI 產出的視覺設計描述）

第 3 層：文字內容
  → "Text to display prominently: ${text}"

第 4 層：風格約束
  → Modern, bold typography, vibrant colors, square 1:1, compelling

第 5 層：禁止規則
  → "Do NOT include any emoji. Use clean vector-style icons or geometric shapes instead."
```

#### 內頁 Prompt（6 層結構）

```
第 1 層：任務
  → "Create content slide maintaining visual consistency"

第 2 層：設計需求
  → ${layout}

第 3 層：文字內容
  → "Content text: ${text}"

第 4 層：整體主題
  → ${overallTheme}（封面的 layout 描述，作為風格錨點）

第 5 層：風格約束
  → 同封面

第 6 層：禁止規則
  → 同封面
```

#### 參考圖機制

當有 `previousImageUrl` 時，訊息格式會從純文字變為多模態：

```json
{
  "role": "user",
  "content": [
    { "type": "text", "text": "Based on the style of this reference image, create a new slide: ${prompt}" },
    { "type": "image_url", "image_url": { "url": "${previousImageUrl}" } }
  ]
}
```

---

## 前端展示邏輯

### 狀態機

```
idle → generating-content → generating-images → complete
                ↓                    ↓
              error               error（部分成功則仍為 complete）
```

### UI 元件結構

```
PostPreview
  ├── 主預覽區
  │     ├── 大圖展示（已生成 → 顯示圖片 / 未生成 → 顯示文案 or loading）
  │     ├── 左右箭頭（切換頁面）
  │     ├── 圓點指示器（目前頁碼）
  │     └── 下載按鈕（單張下載為 PNG）
  ├── 資訊區
  │     ├── 頁碼標籤（封面 / 第 N 頁）
  │     ├── 文案內容
  │     └── 設計描述
  └── 縮圖列
        └── 橫向捲動的縮圖卡片（點擊跳轉）
```

### 漸進式更新

圖片採**逐張串行生成**，每完成一張立即更新 UI：
- `currentImageIndex` 追蹤目前正在生成第幾張
- 已完成的縮圖顯示圖片，生成中的顯示 loading spinner
- 使用者可在生成過程中自由瀏覽已完成的圖片

---

## 目前的限制與取捨

| 項目 | 目前做法 | 潛在問題 | 可能的改進方向 |
|------|---------|---------|--------------|
| 風格傳遞 | 只傳前一張圖作參考 | 中間某張偏了，後面跟著偏 | 改為每張都參考封面圖 |
| 生成速度 | 逐張串行生成 | 3~6 張需要較長等待 | 並行生成（犧牲風格一致性） |
| 圖片儲存 | 僅 base64 URL 在記憶體 | 頁面刷新後消失 | 存入 Storage bucket |
| 文字排版 | 交給圖像模型自行排版 | 中文字體品質不完全可控 | 前端 Canvas 疊字 + AI 生成背景 |
| JSON 解析 | 正則提取 + JSON.parse | 模型輸出格式偶爾不穩定 | 改用 tool calling 強制結構化輸出 |
| 錯誤處理 | 單張失敗跳過繼續 | 可能出現中間缺圖 | 加入重試機制 |
