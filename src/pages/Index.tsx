import { Sparkles, Palette, FileText, Target, ArrowRight, Zap, Image, CheckCircle2, ChevronDown, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const features = [
  {
    icon: Palette,
    title: "風格統一",
    description: "AI 自動維持整組圖文一致的視覺風格，色調、排版、元素協調統一，不再東拼西湊。",
    highlight: "鏈式風格傳遞技術",
  },
  {
    icon: FileText,
    title: "智慧文案",
    description: "專業內容策略師等級的文案生成，封面吸睛標題、內頁精煉重點，每一頁都為社群互動而生。",
    highlight: "社群爆款公式",
  },
  {
    icon: Target,
    title: "精準內容",
    description: "AI 深入理解你的主題脈絡，產出結構清晰、邏輯連貫的多頁內容，而非隨機拼湊。",
    highlight: "結構化思維鏈",
  },
];

const steps = [
  {
    number: "01",
    title: "輸入主題",
    description: "告訴 AI 你想分享的主題和方向",
    icon: Zap,
  },
  {
    number: "02",
    title: "AI 策劃內容",
    description: "智能規劃文案結構與視覺風格",
    icon: FileText,
  },
  {
    number: "03",
    title: "生成圖片",
    description: "逐張生成風格統一的精美圖片",
    icon: Image,
  },
  {
    number: "04",
    title: "下載發佈",
    description: "一鍵下載，直接發佈到 Instagram",
    icon: CheckCircle2,
  },
];

const faqs = [
  {
    question: "生成一組貼文需要多長時間？",
    answer: "通常 1-3 分鐘即可完成一組 3-6 張的圖文貼文，取決於內容頁數。生成過程中你可以即時預覽已完成的圖片。",
  },
  {
    question: "可以自訂風格方向嗎？",
    answer: "可以！在生成時你可以描述想要的風格、色調、目標受眾等方向，AI 會依照你的需求調整整組貼文的視覺與文案風格。",
  },
  {
    question: "圖片解析度如何？",
    answer: "生成的圖片為 1:1 正方形比例，適合 Instagram 發佈，畫質清晰且適合行動裝置瀏覽。",
  },
  {
    question: "支援哪些語言？",
    answer: "目前主要支援繁體中文內容生成，AI 會根據你輸入的語言自動產出對應的文案與圖片文字。",
  },
];

const Index = () => {
  const [heroTopic, setHeroTopic] = useState("");
  const navigate = useNavigate();

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroTopic.trim()) {
      navigate(`/generate?topic=${encodeURIComponent(heroTopic.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[100px]" />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-16 pb-24 text-center">
          <div className="animate-fade-in space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI 驅動的社群內容工具
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="gradient-text">一鍵生成爆款</span>
              <br />
              <span className="text-foreground">Instagram 圖文</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              輸入主題，AI 自動規劃文案策略、生成風格統一的系列圖片。
              <br className="hidden md:block" />
              從構思到發佈，只需要一個步驟。
            </p>

            {/* Hero Input Bar */}
            <form onSubmit={handleHeroSubmit} className="max-w-2xl mx-auto pt-4">
              <div className="glass-card rounded-2xl p-2 flex items-center gap-2">
                <input
                  type="text"
                  value={heroTopic}
                  onChange={(e) => setHeroTopic(e.target.value)}
                  placeholder="輸入你想生成的主題，例如：咖啡廳經營秘訣..."
                  className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-foreground placeholder:text-muted-foreground text-base"
                />
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  disabled={!heroTopic.trim()}
                  className="shrink-0"
                >
                  <Send className="w-4 h-4" />
                  開始生成
                </Button>
              </div>
              <div className="flex items-center justify-center gap-3 mt-4 text-sm text-muted-foreground">
                <span>熱門：</span>
                {["咖啡廳經營", "健身指南", "極簡生活"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setHeroTopic(tag)}
                    className="px-3 py-1 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </section>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-24">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              為什麼選擇 <span className="gradient-text">GramGenius</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              不只是圖片生成器，是你的 AI 社群內容策略師
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-8 space-y-4 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
                <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {feature.highlight}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              如何使用
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              四個步驟，從靈感到發佈
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="relative group">
                <div className="glass-card rounded-2xl p-6 space-y-3 h-full">
                  <span className="text-4xl font-bold text-primary/20 font-display">{step.number}</span>
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Example Showcase */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              生成範例
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              看看 AI 能為你創造什麼
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { topic: "咖啡廳經營秘訣", tag: "餐飲" },
              { topic: "健身初學者指南", tag: "健康" },
              { topic: "極簡生活哲學", tag: "生活風格" },
            ].map((example, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-300">
                <div className="aspect-square bg-gradient-to-br from-primary/20 via-accent/10 to-secondary flex items-center justify-center">
                  <div className="text-center p-6">
                    <p className="text-2xl font-bold gradient-text mb-2">{example.topic}</p>
                    <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                      {example.tag}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <Link to={`/generate?topic=${encodeURIComponent(example.topic)}`}>
                    <Button variant="ghost" size="sm" className="w-full group-hover:text-primary transition-colors">
                      試試這個主題
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              常見問題
            </h2>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 py-24">
          <div className="glass-card rounded-3xl p-12 md:p-16 text-center max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                準備好讓你的 IG 起飛了嗎？
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                不需要設計技能、不需要絞盡腦汁想文案，AI 幫你一次搞定。
              </p>
              <Link to="/generate">
                <Button variant="gradient" size="xl" className="min-w-[200px]">
                  <Sparkles className="w-5 h-5" />
                  立即開始
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground border-t border-border/30">
          <p>由 Lovable AI 驅動 ✨</p>
        </footer>
      </div>
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="w-full text-left glass-card rounded-xl p-5 transition-all hover:border-primary/20"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-foreground">{question}</h3>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>
      {isOpen && (
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{answer}</p>
      )}
    </button>
  );
};

export default Index;
