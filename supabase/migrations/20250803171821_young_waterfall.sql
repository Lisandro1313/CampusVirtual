/*
  # Add lesson purchases system

  1. New Tables
    - `lesson_purchases`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `lesson_id` (uuid, foreign key to lessons)
      - `amount_paid` (numeric)
      - `payment_method` (text)
      - `stripe_payment_id` (text)
      - `purchased_at` (timestamp)

  2. Security
    - Enable RLS on `lesson_purchases` table
    - Add policies for users to manage their own purchases
    - Add policies for instructors to view purchases of their lessons

  3. Changes
    - Remove course-level payments, focus on individual lesson purchases
    - Update existing tables to support lesson-based payments
*/

-- Create lesson purchases table
CREATE TABLE IF NOT EXISTS lesson_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  amount_paid numeric(10,2) NOT NULL,
  payment_method text DEFAULT 'stripe',
  stripe_payment_id text,
  mercadopago_payment_id text,
  purchased_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE lesson_purchases ENABLE ROW LEVEL SECURITY;

-- Policies for lesson purchases
CREATE POLICY "Users can view own lesson purchases"
  ON lesson_purchases
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own lesson purchases"
  ON lesson_purchases
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Instructors can view purchases for their lessons"
  ON lesson_purchases
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lessons l
      JOIN courses c ON l.course_id = c.id
      WHERE l.id = lesson_purchases.lesson_id
      AND c.instructor_id = auth.uid()
    )
  );

-- Add indexes
CREATE INDEX IF NOT EXISTS lesson_purchases_user_id_idx ON lesson_purchases(user_id);
CREATE INDEX IF NOT EXISTS lesson_purchases_lesson_id_idx ON lesson_purchases(lesson_id);
CREATE INDEX IF NOT EXISTS lesson_purchases_purchased_at_idx ON lesson_purchases(purchased_at DESC);

-- Add trigger for updated_at
CREATE TRIGGER update_lesson_purchases_updated_at
  BEFORE UPDATE ON lesson_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add price column to lessons table if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lessons' AND column_name = 'price'
  ) THEN
    ALTER TABLE lessons ADD COLUMN price numeric(10,2) DEFAULT 0;
  END IF;
END $$;

-- Update lessons policies to check for purchases
DROP POLICY IF EXISTS "Enrolled students can read paid lessons" ON lessons;

CREATE POLICY "Students can read purchased lessons"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (
    is_free = true OR
    EXISTS (
      SELECT 1 FROM lesson_purchases lp
      WHERE lp.lesson_id = lessons.id
      AND lp.user_id = auth.uid()
    )
  );