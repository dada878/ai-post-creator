import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface TopicInputProps {
  onGenerate: (topic: string, direction: string) => void;
  isLoading: boolean;
  initialTopic?: string;
}

export const TopicInput = ({ onGenerate, isLoading, initialTopic = "" }: TopicInputProps) => {
  const [topic, setTopic] = useState(initialTopic);
  const [direction, setDirection] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic, direction);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80">
            貼文主題
          </label>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：咖啡廳經營秘訣、健身初學者指南..."
            className="bg-secondary/50 border-border/50 focus:border-primary h-12 text-base"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80">
            內容方向 <span className="text-muted-foreground">(選填)</span>
          </label>
          <Textarea
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            placeholder="描述你想要的風格、目標受眾、特別強調的重點..."
            className="bg-secondary/50 border-border/50 focus:border-primary min-h-[100px] resize-none"
            disabled={isLoading}
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="gradient"
        size="xl"
        className="w-full"
        disabled={!topic.trim() || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            生成中...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            開始生成貼文
          </>
        )}
      </Button>
    </form>
  );
};
