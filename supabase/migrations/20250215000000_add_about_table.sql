CREATE TABLE IF NOT EXISTS about (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE about ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for about"
  ON about
  FOR SELECT
  TO public
  USING (true);

INSERT INTO about (title, content) VALUES (
  'About Me',
  'Creative Director, Art & Design with 15+ years in advertising, blending strategy, design, and storytelling to inspire and engage. Specialized in creating immersive digital experiences and leading cross-functional teams to deliver innovative solutions.'
); 