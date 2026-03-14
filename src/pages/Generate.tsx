import { Sparkles, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopicInput } from "@/components/TopicInput";
import { PostPreview } from "@/components/PostPreview";
import { GenerationProgress } from "@/components/GenerationProgress";
import { usePostGeneration } from "@/hooks/usePostGeneration";
import { Link, useSearchParams } from "react-router-dom";

const Generate = () => {
  const [searchParams] = useSearchParams();
  const initialTopic = searchParams.get("topic") || "";
  const { state, generateContent, reset } = usePostGeneration();

  const isLoading = state.status === "generating-content" || state.status === "generating-images";
  const totalImages = state.post ? 1 + state.post.content.length : 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Nav */}
        <nav className="mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              返回首頁
            </Button>
          </Link>
        </nav>

        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI 社群內容生成器
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">開始生成你的貼文</span>
          </h1>
          
          <p className="text-muted-foreground max-w-xl mx-auto">
            輸入主題，AI 幫你搞定文案與圖片
          </p>
        </header>

        {/* Main Content */}
        <main className="space-y-12">
          {state.status === "idle" && (
            <TopicInput onGenerate={generateContent} isLoading={isLoading} />
          )}

          {state.status === "generating-content" && !state.post && (
            <GenerationProgress
              status={state.status}
              currentImageIndex={0}
              totalImages={0}
            />
          )}

          {state.status !== "idle" && state.post && (
            <div className="space-y-8">
              {isLoading && (
                <GenerationProgress
                  status={state.status}
                  currentImageIndex={state.currentImageIndex}
                  totalImages={totalImages}
                />
              )}

              <div className="flex items-center justify-center gap-4">
                {state.status === "complete" && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>🎉 生成完成！</span>
                  </div>
                )}

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
      </div>
    </div>
  );
};

export default Generate;
