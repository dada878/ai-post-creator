import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GenerationState, GeneratedPost, GeneratedImage } from "@/types/post";

export const usePostGeneration = () => {
  const [state, setState] = useState<GenerationState>({
    status: "idle",
    post: null,
    images: [],
    currentImageIndex: 0,
    error: null,
  });

  const generateContent = async (topic: string, direction: string) => {
    setState((prev) => ({
      ...prev,
      status: "generating-content",
      error: null,
      post: null,
      images: [],
    }));

    try {
      const { data, error } = await supabase.functions.invoke("generate-post-content", {
        body: { topic, direction },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      const post = data.post as GeneratedPost;
      setState((prev) => ({
        ...prev,
        post,
        status: "generating-images",
      }));

      toast.success("貼文內容生成完成！開始生成圖片...");

      // Generate images sequentially to maintain style consistency
      await generateImages(post);
    } catch (error) {
      console.error("Content generation error:", error);
      const errorMessage = error instanceof Error ? error.message : "生成失敗";
      setState((prev) => ({
        ...prev,
        status: "error",
        error: errorMessage,
      }));
      toast.error(errorMessage);
    }
  };

  const generateImages = async (post: GeneratedPost) => {
    const images: GeneratedImage[] = [];
    const totalImages = 1 + post.content.length;
    
    try {
      // Generate main/cover image first
      setState((prev) => ({ ...prev, currentImageIndex: 0 }));
      
      const mainImageResult = await generateSingleImage({
        text: post.main.text,
        layout: post.main.layout,
        isMain: true,
        overallTheme: post.main.layout,
      });

      if (mainImageResult) {
        const mainImage: GeneratedImage = {
          slideIndex: 0,
          imageUrl: mainImageResult,
          text: post.main.text,
          layout: post.main.layout,
          isMain: true,
        };
        images.push(mainImage);
        setState((prev) => ({ ...prev, images: [...images] }));
      }

      // Generate content images with style reference
      let previousImageUrl = mainImageResult;
      
      for (let i = 0; i < post.content.length; i++) {
        setState((prev) => ({ ...prev, currentImageIndex: i + 1 }));
        
        const contentSlide = post.content[i];
        const imageResult = await generateSingleImage({
          text: contentSlide.text,
          layout: contentSlide.layout,
          previousImageUrl,
          isMain: false,
          overallTheme: post.main.layout,
        });

        if (imageResult) {
          const contentImage: GeneratedImage = {
            slideIndex: i,
            imageUrl: imageResult,
            text: contentSlide.text,
            layout: contentSlide.layout,
            isMain: false,
          };
          images.push(contentImage);
          previousImageUrl = imageResult; // Use as reference for next image
          setState((prev) => ({ ...prev, images: [...images] }));
        }
      }

      setState((prev) => ({ ...prev, status: "complete" }));
      toast.success(`成功生成 ${images.length} 張圖片！`);
    } catch (error) {
      console.error("Image generation error:", error);
      // Continue with what we have
      if (images.length > 0) {
        setState((prev) => ({ ...prev, status: "complete" }));
        toast.warning(`部分圖片生成失敗，已生成 ${images.length} 張`);
      } else {
        setState((prev) => ({
          ...prev,
          status: "error",
          error: "圖片生成失敗",
        }));
        toast.error("圖片生成失敗");
      }
    }
  };

  const generateSingleImage = async (params: {
    text: string;
    layout: string;
    previousImageUrl?: string;
    isMain: boolean;
    overallTheme: string;
  }): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("generate-post-image", {
        body: params,
      });

      if (error) {
        console.error("Image generation error:", error);
        return null;
      }
      if (data.error) {
        console.error("Image generation error:", data.error);
        return null;
      }

      return data.imageUrl;
    } catch (error) {
      console.error("Image generation error:", error);
      return null;
    }
  };

  const reset = () => {
    setState({
      status: "idle",
      post: null,
      images: [],
      currentImageIndex: 0,
      error: null,
    });
  };

  return {
    state,
    generateContent,
    reset,
  };
};
