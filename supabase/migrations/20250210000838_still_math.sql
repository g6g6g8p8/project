/*
  # Add sample content for projects

  1. Content Types Added:
    - Text sections
    - Image galleries (4:5 aspect ratio)
    - Vimeo video embeds

  2. Content Structure:
    - Each project gets multiple content pieces
    - Content is ordered for proper display
    - Rich media content includes metadata
*/

-- Insert content for Bolt project
INSERT INTO projects_content (project_id, type, content, "order") VALUES
(1, 'text', '{
  "text": "Bolt represents a breakthrough in AI-assisted development. By combining advanced language models with deep learning techniques, we''ve created an assistant that truly understands developer intent and context.\n\nOur approach focuses on three key areas:\n- Intelligent code suggestions\n- Context-aware completions\n- Natural language understanding"
}'::jsonb, 1),

(1, 'gallery', '{
  "gallery": [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=1000&fit=crop"
  ]
}'::jsonb, 2),

(1, 'video', '{
  "video": {
    "url": "https://player.vimeo.com/video/824804225",
    "thumbnail": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=450&fit=crop"
  }
}'::jsonb, 3);

-- Insert content for StackBlitz project
INSERT INTO projects_content (project_id, type, content, "order") VALUES
(2, 'text', '{
  "text": "WebContainer™ technology represents a paradigm shift in web development. By bringing Node.js directly to the browser, we''ve eliminated the need for complex local development setups.\n\nKey innovations include:\n- Native Node.js in browser\n- Instant environment setup\n- Seamless collaboration features"
}'::jsonb, 1),

(2, 'gallery', '{
  "gallery": [
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1542903660-eedba2cda473?w=800&h=1000&fit=crop"
  ]
}'::jsonb, 2),

(2, 'video', '{
  "video": {
    "url": "https://player.vimeo.com/video/824804225",
    "thumbnail": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=450&fit=crop"
  }
}'::jsonb, 3);

-- Insert content for Enterprise Cloud IDE project
INSERT INTO projects_content (project_id, type, content, "order") VALUES
(3, 'text', '{
  "text": "Our Enterprise Cloud IDE redefines collaborative development for large teams. With advanced security features and seamless integration capabilities, it provides a complete solution for modern development workflows.\n\nEnterprise features include:\n- Role-based access control\n- Audit logging\n- Custom deployment pipelines"
}'::jsonb, 1),

(3, 'gallery', '{
  "gallery": [
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=1000&fit=crop"
  ]
}'::jsonb, 2),

(3, 'video', '{
  "video": {
    "url": "https://player.vimeo.com/video/824804225",
    "thumbnail": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=450&fit=crop"
  }
}'::jsonb, 3);