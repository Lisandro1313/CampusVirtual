/*
  # Create announcements table

  1. New Tables
    - `announcements`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `author_id` (uuid, references profiles)
      - `category` (enum: general, academic, events, technical)
      - `priority` (enum: low, medium, high)
      - `published` (boolean, default false)
      - `published_at` (timestamp, optional)
      - `image_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `announcements` table
    - Add policies for public read access to published announcements
    - Add policies for teachers/admins to manage announcements
*/

-- Create enums for announcements
CREATE TYPE announcement_category AS ENUM ('general', 'academic', 'events', 'technical');
CREATE TYPE announcement_priority AS ENUM ('low', 'medium', 'high');

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  category announcement_category DEFAULT 'general',
  priority announcement_priority DEFAULT 'medium',
  published boolean DEFAULT false,
  published_at timestamptz,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read published announcements"
  ON announcements
  FOR SELECT
  TO authenticated, anon
  USING (published = true);

CREATE POLICY "Teachers and admins can manage announcements"
  ON announcements
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('teacher', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('teacher', 'admin')
    )
  );

-- Function to set published_at when published
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.published = true AND OLD.published = false THEN
    NEW.published_at = now();
  ELSIF NEW.published = false THEN
    NEW.published_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for published_at
CREATE TRIGGER set_published_at_trigger
  BEFORE UPDATE ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION set_published_at();

-- Trigger for updated_at
CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS announcements_published_idx ON announcements(published, published_at DESC);
CREATE INDEX IF NOT EXISTS announcements_category_idx ON announcements(category);
CREATE INDEX IF NOT EXISTS announcements_author_id_idx ON announcements(author_id);