/*
  # Create lessons table

  1. New Tables
    - `lessons`
      - `id` (uuid, primary key)
      - `course_id` (uuid, references courses)
      - `title` (text)
      - `description` (text, optional)
      - `video_url` (text, optional)
      - `file_url` (text, optional)
      - `content_type` (enum: video, pdf, link, text)
      - `duration_minutes` (integer)
      - `order_index` (integer)
      - `is_free` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `lessons` table
    - Add policies for public read access to free lessons
    - Add policies for enrolled students to access paid lessons
    - Add policies for instructors to manage their lessons
*/

-- Create enum for content types
CREATE TYPE content_type AS ENUM ('video', 'pdf', 'link', 'text');

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  video_url text,
  file_url text,
  content_type content_type NOT NULL DEFAULT 'video',
  duration_minutes integer NOT NULL DEFAULT 0,
  order_index integer NOT NULL DEFAULT 0,
  is_free boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read free lessons"
  ON lessons
  FOR SELECT
  TO authenticated, anon
  USING (is_free = true);

CREATE POLICY "Enrolled students can read paid lessons"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (
    is_free = true OR
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE user_id = auth.uid() 
      AND course_id = lessons.course_id 
      AND payment_status = 'completed'
    )
  );

CREATE POLICY "Instructors can manage own course lessons"
  ON lessons
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = lessons.course_id 
      AND (instructor_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
      ))
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index for better performance
CREATE INDEX IF NOT EXISTS lessons_course_id_order_idx ON lessons(course_id, order_index);