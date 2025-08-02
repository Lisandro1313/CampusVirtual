/*
  # Create courses table

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `short_description` (text, optional)
      - `instructor_id` (uuid, references profiles)
      - `category` (text)
      - `level` (enum: beginner, intermediate, advanced)
      - `price` (numeric)
      - `image_url` (text, optional)
      - `featured` (boolean, default false)
      - `tags` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `courses` table
    - Add policies for public read access
    - Add policies for instructors to manage their courses
    - Add policies for admins to manage all courses
*/

-- Create enum for course levels
CREATE TYPE course_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  short_description text,
  instructor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  category text NOT NULL,
  level course_level NOT NULL DEFAULT 'beginner',
  price numeric(10,2) NOT NULL DEFAULT 0,
  image_url text,
  featured boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read published courses"
  ON courses
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Instructors can create courses"
  ON courses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Instructors can update own courses"
  ON courses
  FOR UPDATE
  TO authenticated
  USING (
    instructor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Instructors can delete own courses"
  ON courses
  FOR DELETE
  TO authenticated
  USING (
    instructor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();