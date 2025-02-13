/*
  # Restructure projects database

  1. Changes to Existing Tables
    - Simplify `projects` table to keep only essential fields
    - Remove content-related columns from `projects`

  2. New Tables
    - `projects_content`
      - `id` (uuid, primary key)
      - `project_id` (references projects.id)
      - `type` (text, content type: 'text', 'gallery', 'video', etc.)
      - `content` (jsonb, flexible content storage)
      - `order` (integer, for content ordering)
      - `created_at` (timestamp)

  3. Security
    - Enable RLS on new table
    - Add policies for public read access
*/

-- Create enum for content types
CREATE TYPE content_type AS ENUM ('text', 'gallery', 'video', 'image');

-- Create projects_content table
CREATE TABLE IF NOT EXISTS projects_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  type content_type NOT NULL,
  content JSONB NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (project_id, "order")
);

-- Enable RLS
ALTER TABLE projects_content ENABLE ROW LEVEL SECURITY;

-- Add policy for public read access
CREATE POLICY "Allow public read access for projects_content"
  ON projects_content
  FOR SELECT
  TO public
  USING (true);

-- Remove content columns from projects table
DO $$ 
BEGIN
  ALTER TABLE projects 
    DROP COLUMN IF EXISTS content,
    DROP COLUMN IF EXISTS gallery,
    DROP COLUMN IF EXISTS role,
    DROP COLUMN IF EXISTS year,
    DROP COLUMN IF EXISTS client;
EXCEPTION
  WHEN undefined_column THEN
    NULL;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_content_project_id ON projects_content(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_content_order ON projects_content("order");