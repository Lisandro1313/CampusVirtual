import { supabase, Course, Lesson, Enrollment, LessonProgress } from '../lib/supabase';

class CourseService {
  // Demo data for when Supabase is not configured
  private demoCourses: Course[] = [
    {
      id: '1',
      title: 'Metodologías de Enseñanza Innovadoras',
      description: 'Descubre las metodologías pedagógicas más efectivas para el aula moderna. Aprende técnicas innovadoras que transformarán tu práctica docente y mejorarán el aprendizaje de tus estudiantes.',
      short_description: 'Técnicas pedagógicas innovadoras para el aula del siglo XXI.',
      instructor_id: 'teacher-1',
      category: 'Pedagogía',
      level: 'intermediate',
      price: 15000,
      image_url: 'https://images.pexels.com/photos/8197530/pexels-photo-8197530.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      featured: true,
      tags: ['Pedagogía', 'Metodología', 'Innovación', 'Didáctica'],
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-15T00:00:00.000Z',
      enrollments_count: 125
    },
    {
      id: '2',
      title: 'Tecnología Educativa y Herramientas Digitales',
      description: 'Integra la tecnología en el aula de manera efectiva. Aprende a utilizar herramientas digitales que potencien el aprendizaje y la participación de tus estudiantes.',
      short_description: 'Integración efectiva de tecnología en el proceso educativo.',
      instructor_id: 'teacher-1',
      category: 'Tecnología Educativa',
      level: 'beginner',
      price: 12000,
      image_url: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      featured: true,
      tags: ['Tecnología', 'Herramientas Digitales', 'Innovación', 'TIC'],
      created_at: '2024-01-05T00:00:00.000Z',
      updated_at: '2024-01-20T00:00:00.000Z',
      enrollments_count: 89
    },
    {
      id: '3',
      title: 'Gestión del Aula y Disciplina Positiva',
      description: 'Desarrolla habilidades para crear un ambiente de aprendizaje positivo y productivo. Aprende técnicas de gestión del aula basadas en el respeto mutuo y la disciplina positiva.',
      short_description: 'Técnicas efectivas para la gestión del aula y disciplina positiva.',
      instructor_id: 'teacher-1',
      category: 'Gestión Educativa',
      level: 'intermediate',
      price: 10000,
      image_url: 'https://images.pexels.com/photos/8197528/pexels-photo-8197528.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      featured: true,
      tags: ['Gestión', 'Disciplina', 'Convivencia', 'Aula'],
      created_at: '2024-01-10T00:00:00.000Z',
      updated_at: '2024-01-25T00:00:00.000Z',
      enrollments_count: 145
    }
  ];

  private demoLessons: Lesson[] = [
    {
      id: '1',
      course_id: '1',
      title: 'Fundamentos de la Pedagogía Moderna',
      description: 'Conceptos fundamentales de las nuevas metodologías pedagógicas.',
      video_url: 'https://www.youtube.com/embed/dGcsHMXbSOA',
      content_type: 'video',
      duration_minutes: 45,
      order_index: 1,
      is_free: true,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z'
    },
    {
      id: '2',
      course_id: '1',
      title: 'Técnicas de Enseñanza Activa',
      description: 'Estrategias para involucrar activamente a los estudiantes.',
      video_url: 'https://www.youtube.com/embed/dGcsHMXbSOA',
      content_type: 'video',
      duration_minutes: 60,
      order_index: 2,
      is_free: false,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z'
    }
  ];

  async getCourses(): Promise<Course[]> {
    if (!supabase) {
      return this.demoCourses;
    }

    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:profiles(name, avatar_url),
          enrollments_count:enrollments(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      return this.demoCourses;
    }
  }

  async getCourse(id: string): Promise<Course | null> {
    if (!supabase) {
      return this.demoCourses.find(c => c.id === id) || null;
    }

    try {
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
    } catch (error) {
      console.error('Error fetching course:', error);
      return null;
    }
  }

  async createCourse(courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> {
    if (!supabase) {
      const newCourse = {
        ...courseData,
        id: `course-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.demoCourses.unshift(newCourse);
      return newCourse;
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
      return this.demoLessons.filter(l => l.course_id === courseId);
    }

    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching lessons:', error);
      return [];
    }
  }

  async createLesson(lessonData: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>): Promise<Lesson> {
    if (!supabase) {
      const newLesson = {
        ...lessonData,
        id: `lesson-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.demoLessons.push(newLesson);
      return newLesson;
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
      // Demo mode - just store in localStorage
      const enrollments = JSON.parse(localStorage.getItem('demo-enrollments') || '[]');
      enrollments.push({
        id: `enrollment-${Date.now()}`,
        user_id: userId,
        course_id: courseId,
        enrolled_at: new Date().toISOString(),
        progress: 0,
        completed: false,
        payment_status: 'pending'
      });
      localStorage.setItem('demo-enrollments', JSON.stringify(enrollments));
      return;
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
      // Demo mode - return mock enrollments with proper course data
      const enrollments = JSON.parse(localStorage.getItem('demo-enrollments') || '[]');
      const userEnrollments = enrollments.filter((e: any) => e.user_id === userId);
      
      // Map enrollments to include course data
      return userEnrollments.map((enrollment: any) => ({
        ...enrollment,
        course: this.demoCourses.find(course => course.id === enrollment.course_id) || {
          id: enrollment.course_id,
          title: 'Curso Demo',
          image_url: 'https://images.pexels.com/photos/8197530/pexels-photo-8197530.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
          lessons: this.demoLessons.filter(l => l.course_id === enrollment.course_id)
        }
      }));
    }

    // Only proceed with Supabase if we have a valid UUID
    if (!userId || userId.length !== 36 || !userId.includes('-')) {
      console.warn('Invalid UUID format for userId:', userId);
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      return [];
    }
  }

  async updateLessonProgress(userId: string, lessonId: string, completed: boolean, watchTime: number): Promise<void> {
    if (!supabase) {
      // Demo mode
      const progress = JSON.parse(localStorage.getItem('demo-progress') || '[]');
      const existingIndex = progress.findIndex((p: any) => p.user_id === userId && p.lesson_id === lessonId);
      
      if (existingIndex >= 0) {
        progress[existingIndex] = {
          ...progress[existingIndex],
          completed,
          watch_time_seconds: watchTime,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        };
      } else {
        progress.push({
          id: `progress-${Date.now()}`,
          user_id: userId,
          lesson_id: lessonId,
          completed,
          watch_time_seconds: watchTime,
          completed_at: completed ? new Date().toISOString() : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      
      localStorage.setItem('demo-progress', JSON.stringify(progress));
      return;
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