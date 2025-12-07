import { GeneratedPost, GeneratedImage } from "@/types/post";
import { ChevronLeft, ChevronRight, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PostPreviewProps {
  post: GeneratedPost;
  images: GeneratedImage[];
  currentImageIndex: number;
  isGeneratingImages: boolean;
}

export const PostPreview = ({
  post,
  images,
  currentImageIndex,
  isGeneratingImages,
}: PostPreviewProps) => {
  const [viewIndex, setViewIndex] = useState(0);
  const totalSlides = 1 + post.content.length; // main + content slides

  const currentSlide = viewIndex === 0 
    ? { text: post.main.text, layout: post.main.layout, isMain: true }
    : { text: post.content[viewIndex - 1].text, layout: post.content[viewIndex - 1].layout, isMain: false };

  const currentImage = images.find(img => 
    img.isMain ? viewIndex === 0 : img.slideIndex === viewIndex - 1
  );

  const handlePrev = () => {
    setViewIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  const handleNext = () => {
    setViewIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `slide-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-slide-up">
      {/* Main Preview */}
      <div className="relative glass-card rounded-2xl overflow-hidden">
        <div className="aspect-square relative bg-secondary/30">
          {currentImage ? (
            <img
              src={currentImage.imageUrl}
              alt={currentSlide.text}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              {isGeneratingImages ? (
                <>
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">
                    正在生成第 {currentImageIndex + 1} 張圖片...
                  </p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold mb-4 gradient-text">
                    {currentSlide.text}
                  </div>
                  <p className="text-sm text-muted-foreground max-w-md">
                    {currentSlide.layout}
                  </p>
                </>
              )}
            </div>
          )}

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slide Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => setViewIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === viewIndex
                    ? "bg-primary w-6"
                    : "bg-foreground/30 hover:bg-foreground/50"
                }`}
              />
            ))}
          </div>

          {/* Download Button */}
          {currentImage && (
            <Button
              variant="glass"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => handleDownload(currentImage.imageUrl, viewIndex)}
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Slide Info */}
        <div className="p-6 border-t border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
              viewIndex === 0 
                ? "bg-primary/20 text-primary" 
                : "bg-accent/20 text-accent"
            }`}>
              {viewIndex === 0 ? "封面" : `第 ${viewIndex} 頁`}
            </span>
          </div>
          <p className="text-foreground font-medium mb-2">{currentSlide.text}</p>
          <p className="text-sm text-muted-foreground">{currentSlide.layout}</p>
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {/* Main thumbnail */}
        <ThumbnailCard
          index={0}
          text={post.main.text}
          image={images.find(img => img.isMain)}
          isActive={viewIndex === 0}
          isMain={true}
          onClick={() => setViewIndex(0)}
          isGenerating={isGeneratingImages && currentImageIndex === 0}
        />
        
        {/* Content thumbnails */}
        {post.content.map((content, i) => (
          <ThumbnailCard
            key={i}
            index={i + 1}
            text={content.text}
            image={images.find(img => !img.isMain && img.slideIndex === i)}
            isActive={viewIndex === i + 1}
            isMain={false}
            onClick={() => setViewIndex(i + 1)}
            isGenerating={isGeneratingImages && currentImageIndex === i + 1}
          />
        ))}
      </div>
    </div>
  );
};

interface ThumbnailCardProps {
  index: number;
  text: string;
  image?: GeneratedImage;
  isActive: boolean;
  isMain: boolean;
  onClick: () => void;
  isGenerating: boolean;
}

const ThumbnailCard = ({
  index,
  text,
  image,
  isActive,
  isMain,
  onClick,
  isGenerating,
}: ThumbnailCardProps) => (
  <button
    onClick={onClick}
    className={`flex-shrink-0 w-24 rounded-xl overflow-hidden transition-all ${
      isActive
        ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
        : "opacity-70 hover:opacity-100"
    }`}
  >
    <div className="aspect-square relative bg-secondary/50">
      {image ? (
        <img
          src={image.imageUrl}
          alt={text}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-2">
          {isGenerating ? (
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          ) : (
            <span className="text-xs text-muted-foreground text-center line-clamp-3">
              {text.slice(0, 20)}...
            </span>
          )}
        </div>
      )}
    </div>
    <div className={`py-1.5 text-xs font-medium text-center ${
      isMain ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
    }`}>
      {isMain ? "封面" : `P${index}`}
    </div>
  </button>
);
