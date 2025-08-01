import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using demo mode.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database Types
export interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar_url?: string;
  bio?: string;
  location?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  short_description?: string;
  instructor_id: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  image_url?: string;
  featured: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  instructor?: Profile;
  lessons?: Lesson[];
  enrollments_count?: number;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  video_url?: string;
  file_url?: string;
  content_type: 'video' | 'pdf' | 'link' | 'text';
  duration_minutes: number;
  order_index: number;
  is_free: boolean;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  progress: number;
  completed: boolean;
  payment_status: 'pending' | 'completed' | 'failed';
  mercadopago_payment_id?: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at?: string;
  watch_time_seconds: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  course_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  mercadopago_payment_id?: string;
  mercadopago_preference_id?: string;
  created_at: string;
  updated_at: string;
}