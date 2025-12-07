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
    const { text, layout, previousImageUrl, isMain, overallTheme } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating image for:", { text, isMain, hasPreviousImage: !!previousImageUrl });

    let prompt: string;
    
    if (isMain) {
      // Main/cover image generation
      prompt = `Create an Instagram carousel cover image for a social media post.

Design requirements:
${layout}

Text to display prominently: "${text}"

Style: Modern, eye-catching Instagram carousel cover. Use bold typography, vibrant colors, and professional design. The image should be square format (1:1 ratio) suitable for Instagram. Make the text highly readable and the design compelling enough to make users want to swipe.

Important: Include the main headline text "${text}" as part of the image design. Use Chinese characters if the text is in Chinese.`;
    } else {
      // Content slide generation - maintain style consistency
      prompt = `Create an Instagram carousel content slide that maintains visual consistency with the series.

Design requirements:
${layout}

Content text: "${text}"

Overall theme: ${overallTheme || 'Professional social media content'}

Style: This is part of an Instagram carousel series. Maintain consistent visual style with warm, professional tones. The image should be square format (1:1 ratio). Include the content text as part of the design. Use modern, clean layouts with good typography.

Important: Make the text "${text}" readable and well-integrated into the design. Use Chinese characters if the text is in Chinese.`;
    }

    const requestBody: any = {
      model: "google/gemini-3-pro-image-preview",
      messages: [
        {
          role: "user",
          content: previousImageUrl 
            ? [
                { type: "text", text: `Based on the style of this reference image, create a new slide: ${prompt}` },
                { type: "image_url", image_url: { url: previousImageUrl } }
              ]
            : prompt
        }
      ],
      modalities: ["image", "text"]
    };

    console.log("Sending image generation request...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
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
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Image generation response received");

    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error("No image URL in response:", JSON.stringify(data, null, 2));
      throw new Error("No image generated");
    }

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-post-image:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "圖片生成失敗" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
