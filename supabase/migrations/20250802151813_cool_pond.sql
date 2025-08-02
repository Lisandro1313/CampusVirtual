/*
  # Fix user creation issues

  1. Database Setup
    - Ensure proper triggers and functions exist
    - Fix any missing constraints or policies
    - Add proper user creation handling

  2. Security
    - Ensure RLS is properly configured
    - Add missing policies for user creation
*/

-- Ensure the handle_new_user function exists and works correctly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'student')::user_role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Ensure profiles table has proper policies for user creation
DROP POLICY IF EXISTS "Users can insert own profile during signup" ON profiles;
CREATE POLICY "Users can insert own profile during signup"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure the update_updated_at_column function exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure all tables have proper updated_at triggers
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('profiles', 'courses', 'enrollments', 'announcements', 'payments')
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS update_%I_updated_at ON %I', t, t);
    EXECUTE format('CREATE TRIGGER update_%I_updated_at 
                    BEFORE UPDATE ON %I 
                    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
  END LOOP;
END $$;

-- Ensure proper permissions for auth schema access
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA auth TO postgres, service_role;

-- Ensure the profiles table allows inserts from the trigger
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Update policies to be more permissive for user creation
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
CREATE POLICY "Enable insert for authenticated users only"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Ensure proper grants for the public schema
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, authenticated, service_role;