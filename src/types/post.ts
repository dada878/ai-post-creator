export interface PostContent {
  text: string;
  layout: string;
}

export interface GeneratedPost {
  main: PostContent;
  content: PostContent[];
}

export interface GeneratedImage {
  slideIndex: number;
  imageUrl: string;
  text: string;
  layout: string;
  isMain: boolean;
}

export interface GenerationState {
  status: 'idle' | 'generating-content' | 'generating-images' | 'complete' | 'error';
  post: GeneratedPost | null;
  images: GeneratedImage[];
  currentImageIndex: number;
  error: string | null;
}
