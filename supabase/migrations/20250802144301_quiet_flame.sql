/*
  # Create lesson progress table

  1. New Tables
    - `lesson_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `lesson_id` (uuid, references lessons)
      - `completed` (boolean, default false)
      - `completed_at` (timestamp, optional)
      - `watch_time_seconds` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `lesson_progress` table
    - Add policies for users to manage their own progress
    - Add policies for instructors to read progress in their courses
*/

-- Create lesson progress table
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  watch_time_seconds integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage own lesson progress"
  ON lesson_progress
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Instructors can read lesson progress for their courses"
  ON lesson_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lessons l
      JOIN courses c ON l.course_id = c.id
      WHERE l.id = lesson_progress.lesson_id 
      AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all lesson progress"
  ON lesson_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_lesson_progress_updated_at
  BEFORE UPDATE ON lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update enrollment progress when lesson is completed
CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_lessons integer;
  completed_lessons integer;
  new_progress numeric;
  enrollment_course_id uuid;
BEGIN
  -- Get course_id from lesson
  SELECT course_id INTO enrollment_course_id
  FROM lessons
  WHERE id = NEW.lesson_id;

  -- Count total lessons in course
  SELECT COUNT(*) INTO total_lessons
  FROM lessons
  WHERE course_id = enrollment_course_id;

  -- Count completed lessons by user in this course
  SELECT COUNT(*) INTO completed_lessons
  FROM lesson_progress lp
  JOIN lessons l ON lp.lesson_id = l.id
  WHERE lp.user_id = NEW.user_id 
  AND l.course_id = enrollment_course_id
  AND lp.completed = true;

  -- Calculate progress percentage
  IF total_lessons > 0 THEN
    new_progress := (completed_lessons::numeric / total_lessons::numeric) * 100;
  ELSE
    new_progress := 0;
  END IF;

  -- Update enrollment progress
  UPDATE enrollments
  SET 
    progress = new_progress,
    completed = (new_progress >= 100),
    updated_at = now()
  WHERE user_id = NEW.user_id AND course_id = enrollment_course_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update enrollment progress
CREATE TRIGGER update_enrollment_progress_trigger
  AFTER INSERT OR UPDATE ON lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_enrollment_progress();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS lesson_progress_user_id_idx ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS lesson_progress_lesson_id_idx ON lesson_progress(lesson_id);