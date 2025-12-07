import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopicInput } from "@/components/TopicInput";
import { PostPreview } from "@/components/PostPreview";
import { usePostGeneration } from "@/hooks/usePostGeneration";

const Index = () => {
  const { state, generateContent, reset } = usePostGeneration();

  const isLoading = state.status === "generating-content" || state.status === "generating-images";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI 社群內容生成器
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold font-display mb-4">
            <span className="gradient-text">一鍵生成爆款</span>
            <br />
            <span className="text-foreground">Instagram 圖文</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            輸入主題，AI 自動生成吸睛文案與系列圖片，
            <br className="hidden md:block" />
            風格統一、一鍵下載，讓你的社群經營更輕鬆！
          </p>
        </header>

        {/* Main Content */}
        <main className="space-y-12">
          {state.status === "idle" && (
            <TopicInput onGenerate={generateContent} isLoading={isLoading} />
          )}

          {state.status !== "idle" && state.post && (
            <div className="space-y-8">
              {/* Status Bar */}
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-sm">
                  {state.status === "generating-content" && (
                    <>
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span>正在生成內容...</span>
                    </>
                  )}
                  {state.status === "generating-images" && (
                    <>
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                      <span>
                        正在生成圖片 ({state.currentImageIndex + 1}/{1 + state.post.content.length})
                      </span>
                    </>
                  )}
                  {state.status === "complete" && (
                    <>
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span>生成完成！</span>
                    </>
                  )}
                </div>

                <Button
                  variant="glass"
                  size="sm"
                  onClick={reset}
                  disabled={isLoading}
                >
                  <RefreshCw className="w-4 h-4" />
                  重新開始
                </Button>
              </div>

              {/* Preview */}
              <PostPreview
                post={state.post}
                images={state.images}
                currentImageIndex={state.currentImageIndex}
                isGeneratingImages={state.status === "generating-images"}
              />
            </div>
          )}

          {state.status === "error" && (
            <div className="text-center space-y-4 animate-slide-up">
              <p className="text-destructive">{state.error}</p>
              <Button variant="outline" onClick={reset}>
                <RefreshCw className="w-4 h-4 mr-2" />
                重試
              </Button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-20 text-center text-sm text-muted-foreground">
          <p>由 Lovable AI 驅動 ✨</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
