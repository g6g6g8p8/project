export interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  tags: string[];
  link: string;
  created_at: string;
  slug: string;
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
  position: string;
  period: string;
  description: string;
  technologies: string[];
}