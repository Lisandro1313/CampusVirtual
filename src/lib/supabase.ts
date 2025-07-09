import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para la base de datos
export interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar_url?: string;
  bio?: string;
  location?: string;
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
  image_url?: string;
  featured: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  instructor?: Profile;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  video_url?: string;
  duration_minutes: number;
  price: number;
  order_index: number;
  content_type: 'video' | 'text' | 'quiz';
  materials?: any[];
  is_free: boolean;
  created_at: string;
  updated_at: string;
  course?: Course;
  is_purchased?: boolean;
  progress?: LessonProgress;
}

export interface LessonPurchase {
  id: string;
  user_id: string;
  lesson_id: string;
  amount_paid: number;
  payment_method: string;
  stripe_payment_id?: string;
  purchased_at: string;
  lesson?: Lesson;
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

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author_id: string;
  published: boolean;
  published_at?: string;
  email_sent: boolean;
  created_at: string;
  updated_at: string;
  author?: Profile;
}

export interface NotificationSubscription {
  id: string;
  user_id: string;
  email_announcements: boolean;
  email_new_lessons: boolean;
  created_at: string;
}