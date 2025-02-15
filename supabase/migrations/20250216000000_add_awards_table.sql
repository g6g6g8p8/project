CREATE TABLE IF NOT EXISTS awards (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  year TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE awards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for awards"
  ON awards
  FOR SELECT
  TO public
  USING (true);

INSERT INTO awards (title, organization, year) VALUES 
  ('Best Digital Experience', 'Awwwards', '2023'),
  ('Site of the Day', 'FWA', '2022'),
  ('Innovation in Design', 'D&AD', '2021'); 