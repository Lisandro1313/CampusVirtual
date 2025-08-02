/*
  # Create payments table

  1. New Tables
    - `payments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `course_id` (uuid, references courses)
      - `amount` (numeric)
      - `currency` (text, default 'ARS')
      - `status` (enum: pending, approved, rejected, cancelled)
      - `mercadopago_payment_id` (text, optional)
      - `mercadopago_preference_id` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `payments` table
    - Add policies for users to read their own payments
    - Add policies for instructors to read payments for their courses
    - Add policies for admins to read all payments
*/

-- Create enum for payment status
CREATE TYPE mp_payment_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'ARS',
  status mp_payment_status DEFAULT 'pending',
  mercadopago_payment_id text,
  mercadopago_preference_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Instructors can read payments for their courses"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = payments.course_id 
      AND instructor_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to handle successful payment
CREATE OR REPLACE FUNCTION handle_successful_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- If payment is approved, update enrollment status
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    UPDATE enrollments
    SET 
      payment_status = 'completed',
      amount_paid = NEW.amount,
      mercadopago_payment_id = NEW.mercadopago_payment_id,
      updated_at = now()
    WHERE user_id = NEW.user_id AND course_id = NEW.course_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for successful payments
CREATE TRIGGER handle_successful_payment_trigger
  AFTER UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION handle_successful_payment();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS payments_user_id_idx ON payments(user_id);
CREATE INDEX IF NOT EXISTS payments_course_id_idx ON payments(course_id);
CREATE INDEX IF NOT EXISTS payments_status_idx ON payments(status);
CREATE INDEX IF NOT EXISTS payments_mercadopago_payment_id_idx ON payments(mercadopago_payment_id);