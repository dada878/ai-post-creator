import { Loader2, FileText, Image, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenerationProgressProps {
  status: "generating-content" | "generating-images" | "complete" | "error";
  currentImageIndex: number;
  totalImages: number;
}

const steps = [
  { id: "content", label: "生成文案", icon: FileText },
  { id: "images", label: "生成圖片", icon: Image },
  { id: "complete", label: "完成", icon: CheckCircle2 },
];

export const GenerationProgress = ({
  status,
  currentImageIndex,
  totalImages,
}: GenerationProgressProps) => {
  const getStepStatus = (stepId: string) => {
    if (status === "generating-content") {
      if (stepId === "content") return "active";
      return "pending";
    }
    if (status === "generating-images") {
      if (stepId === "content") return "completed";
      if (stepId === "images") return "active";
      return "pending";
    }
    if (status === "complete") {
      return "completed";
    }
    return "pending";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card rounded-2xl p-6 space-y-6">
        {/* Header with animated sparkles */}
        <div className="flex items-center justify-center gap-3">
          <div className="relative">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <div className="absolute inset-0 w-6 h-6 bg-primary/30 rounded-full blur-md animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold gradient-text">AI 正在創作中...</h3>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepStatus = getStepStatus(step.id);
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
                      stepStatus === "active" &&
                        "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110",
                      stepStatus === "completed" &&
                        "bg-green-500 text-white",
                      stepStatus === "pending" &&
                        "bg-secondary text-muted-foreground"
                    )}
                  >
                    {stepStatus === "active" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : stepStatus === "completed" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm mt-2 transition-colors",
                      stepStatus === "active" && "text-primary font-medium",
                      stepStatus === "completed" && "text-green-500 font-medium",
                      stepStatus === "pending" && "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-secondary" />
                    <div
                      className={cn(
                        "absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent transition-all duration-700",
                        stepStatus === "completed" && "w-full",
                        stepStatus === "active" && "w-1/2 animate-pulse",
                        stepStatus === "pending" && "w-0"
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Detailed Status */}
        <div className="text-center space-y-2">
          {status === "generating-content" && (
            <div className="animate-fade-in">
              <p className="text-muted-foreground">
                正在分析主題並生成吸睛文案...
              </p>
              <div className="flex justify-center gap-1 mt-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {status === "generating-images" && (
            <div className="animate-fade-in space-y-3">
              <p className="text-muted-foreground">
                正在生成第 <span className="text-primary font-semibold">{currentImageIndex + 1}</span> 張圖片，共 {totalImages} 張
              </p>
              
              {/* Image Progress Bar */}
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite] transition-all duration-500"
                  style={{ width: `${((currentImageIndex + 1) / totalImages) * 100}%` }}
                />
              </div>
              
              <p className="text-xs text-muted-foreground">
                💡 AI 正在確保每張圖片風格一致...
              </p>
            </div>
          )}

          {status === "complete" && (
            <div className="animate-fade-in">
              <p className="text-green-500 font-medium">
                🎉 所有內容生成完成！
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
