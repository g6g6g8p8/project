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
  aspect_ratio?: '4:3' | '3:4' | '9:2';  // default will be '4:3'
  order: number;
}

export interface ProjectContent {
  id: string;
  project_id: number;
  type: 'text' | 'gallery' | 'video' | 'image';
  content: {
    text?: string;
    gallery?: string[];
    video?: {
      url: string;
      thumbnail?: string;
    };
    image?: {
      url: string;
      caption?: string;
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

export interface About {
  id: number;
  name: string;
  email: string;
  title: string;
  avatar_url: string;
  short_bio: string;
  what_i_do: string;
  brands: string[];
  awards: string[];
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