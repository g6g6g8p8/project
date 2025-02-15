export interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  tags: string[];
  link: string;
  client: string;
  role: string;
  category: string;
  created_at: string;
  slug: string;
  aspect_ratio?: '4:3' | '3:4' | '9:4';  // updated from '9:2' to '9:4'
  order: number;
}

type GalleryItem = {
  type: 'image' | 'video';
  url: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export interface ProjectContent {
  id: string;
  project_id: number;
  type: 'text' | 'gallery' | 'video';
  content: {
    text?: string;
    gallery?: GalleryItem[];
    video?: {
      title?: string;
      url: string;
    };
  };
  order: number;
  created_at: string;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  period: string;
  logo_url: string;
}

export interface Award {
  id: number;
  title: string;
  organization: string;
  year: string;
}

export interface About {
  id: number;
  name: string;
  email: string;
  title: string;
  avatar_url: string;
  short_bio: string;
  what_i_do: string;
  brands: string[];
  awards: Award[];
  career_highlights: CareerHighlight[];
}

export interface CareerHighlight {
  id: number;
  company: string;
  role: string;
  period: string;
  logo_url: string;
  created_at: string;
}