import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, direction } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating post content for topic:", topic);

    const systemPrompt = `你是一個專業的社群媒體內容策略師，專門為 Instagram 創建高互動的圖文貼文。
你的任務是根據用戶提供的主題，生成一系列吸睛的 IG 圖文貼文（3-6張圖），包括封面和內容頁。

請嚴格按照以下 JSON 格式輸出：
{
  "main": {
    "text": "封面的文案標題",
    "layout": "封面圖的視覺設計描述，包括背景、元素、色調等"
  },
  "content": [
    {
      "text": "第一頁的文案內容",
      "layout": "第一頁的視覺設計描述"
    },
    {
      "text": "第二頁的文案內容",
      "layout": "第二頁的視覺設計描述"
    }
  ]
}

設計原則：
1. 封面要有強烈的視覺衝擊力，標題要吸睛
2. 每頁的視覺風格要統一協調
3. 文案要簡潔有力，適合社群閱讀
4. 設計描述要詳細具體，方便後續圖片生成`;

    const userPrompt = `主題：${topic}
方向：${direction || '請自由發揮'}

請幫我生成會爆的 IG 圖文貼文，一系列大約 3~6 張圖，包括封面和後面許多內容。每一頁分別幫我列出裡面的文案跟想呈現的樣子，用 JSON 輸出。`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "請求過於頻繁，請稍後再試" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "額度不足，請添加額度" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("Raw AI response:", content);

    // Extract JSON from the response
    let jsonContent = content;
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1];
    } else {
      // Try to find JSON object directly
      const jsonStartIndex = content.indexOf('{');
      const jsonEndIndex = content.lastIndexOf('}');
      if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
        jsonContent = content.slice(jsonStartIndex, jsonEndIndex + 1);
      }
    }

    const parsedPost = JSON.parse(jsonContent);
    console.log("Parsed post:", JSON.stringify(parsedPost, null, 2));

    return new Response(JSON.stringify({ post: parsedPost }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-post-content:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "生成失敗" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
