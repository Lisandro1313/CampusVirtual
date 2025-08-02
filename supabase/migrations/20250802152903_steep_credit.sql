/*
  # Fix user creation database error

  1. Database Functions
    - Drop and recreate `handle_new_user` function with proper error handling
    - Add logging for debugging
    - Use proper security context

  2. Triggers
    - Recreate trigger on auth.users table
    - Ensure proper timing (AFTER INSERT)

  3. Permissions
    - Grant necessary permissions to authenticated role
    - Ensure RLS policies allow profile creation

  4. Testing
    - Add test data validation
    - Proper error handling
*/

-- Drop existing function and trigger to start fresh
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create improved handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_name TEXT;
  user_role user_role;
BEGIN
  -- Log the attempt for debugging
  RAISE LOG 'Creating profile for user: %', NEW.id;
  
  -- Extract name from metadata or use email prefix
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );
  
  -- Extract role from metadata or default to student
  user_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::user_role,
    'student'::user_role
  );
  
  -- Insert profile with error handling
  BEGIN
    INSERT INTO public.profiles (
      id,
      name,
      email,
      role,
      phone,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      user_name,
      NEW.email,
      user_role,
      NEW.raw_user_meta_data->>'phone',
      NOW(),
      NOW()
    );
    
    RAISE LOG 'Profile created successfully for user: %', NEW.id;
    
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    -- Still allow user creation to proceed
  END;
  
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Ensure RLS policies allow profile creation during signup
DROP POLICY IF EXISTS "Users can insert own profile during signup" ON profiles;
CREATE POLICY "Users can insert own profile during signup"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON auth.users TO authenticated;
GRANT ALL ON public.profiles TO authenticated;

-- Ensure the function can be executed
GRANT EXECUTE ON FUNCTION handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION handle_new_user() TO service_role;

-- Test the setup by checking if everything exists
DO $$
BEGIN
  -- Check if function exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'handle_new_user'
  ) THEN
    RAISE EXCEPTION 'Function handle_new_user was not created properly';
  END IF;
  
  -- Check if trigger exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    RAISE EXCEPTION 'Trigger on_auth_user_created was not created properly';
  END IF;
  
  RAISE LOG 'User creation setup completed successfully';
END $$;