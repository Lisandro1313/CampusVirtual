import { supabase, Course, Lesson, Enrollment, LessonProgress } from '../lib/supabase';

class CourseService {
  async getCourses(): Promise<Course[]> {
    if (!supabase) {
      throw new Error('Supabase no está configurado');
    }

    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructor:profiles(name, avatar_url, bio),
        enrollments_count:enrollments(count)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getCourse(id: string): Promise<Course | null> {
    if (!supabase) {
      throw new Error('Supabase no está configurado');
    }

    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructor:profiles(name, avatar_url, bio),
        lessons(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createCourse(courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> {
    if (!supabase) {
      throw new Error('Supabase no está configurado');
    }

    const { data, error } = await supabase
      .from('courses')
      .insert(courseData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getLessons(courseId: string): Promise<Lesson[]> {
    if (!supabase) {
      throw new Error('Supabase no está configurado');
    }

    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index');

    if (error) throw error;
    return data || [];
  }

  async createLesson(lessonData: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>): Promise<Lesson> {
    if (!supabase) {
      throw new Error('Supabase no está configurado');
    }

    const { data, error } = await supabase
      .from('lessons')
      .insert(lessonData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async enrollInCourse(courseId: string, userId: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase no está configurado');
    }

    const { error } = await supabase
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        payment_status: 'pending'
      });

    if (error) throw error;
  }

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    if (!supabase) {
      throw new Error('Supabase no está configurado');
    }

    // Only proceed with Supabase if we have a valid UUID
    if (!userId || userId.length !== 36 || !userId.includes('-')) {
      console.warn('Invalid UUID format for userId:', userId);
      return [];
    }

    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        course:courses(*)
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }

  async updateLessonProgress(userId: string, lessonId: string, completed: boolean, watchTime: number): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase no está configurado');
    }

    const { error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        completed,
        watch_time_seconds: watchTime,
        completed_at: completed ? new Date().toISOString() : null,
      });

    if (error) throw error;
  }
}

export const courseService = new CourseService();