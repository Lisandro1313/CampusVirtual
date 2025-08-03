import { supabase } from '../lib/supabase';

interface Course {
  id: string;
  title: string;
  short_description: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  tags: string[];
  image_url: string;
  featured: boolean;
  instructor_id: string;
  instructor?: any;
  lessons?: Lesson[];
  created_at: string;
  updated_at: string;
  enrollments_count?: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  content_type: 'video' | 'pdf' | 'link' | 'text';
  video_url: string;
  file_url: string;
  order_index: number;
  is_free: boolean;
  price: number;
}

interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  progress: number;
  completed: boolean;
  payment_status: 'pending' | 'completed' | 'failed';
}

class CourseService {
  async getCourses(): Promise<Course[]> {
    if (supabase) {
      try {
        const { data: courses, error } = await supabase
          .from('courses')
          .select(`
            *,
            instructor:profiles(name, avatar_url),
            lessons(*)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return courses || [];
      } catch (error) {
        console.error('Error loading courses from Supabase:', error);
        return this.getCoursesFromStorage();
      }
    } else {
      return this.getCoursesFromStorage();
    }
  }

  async getCourse(id: string): Promise<Course | null> {
    if (supabase) {
      try {
        const { data: course, error } = await supabase
          .from('courses')
          .select(`
            *,
            instructor:profiles(name, avatar_url, bio),
            lessons(*)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        return course;
      } catch (error) {
        console.error('Error loading course from Supabase:', error);
        return this.getCourseFromStorage(id);
      }
    } else {
      return this.getCourseFromStorage(id);
    }
  }

  async createCourse(courseData: any): Promise<Course> {
    if (supabase) {
      try {
        // Create course
        const { data: course, error: courseError } = await supabase
          .from('courses')
          .insert({
            title: courseData.title,
            short_description: courseData.short_description,
            description: courseData.description,
            category: courseData.category,
            level: courseData.level,
            price: courseData.price,
            tags: courseData.tags,
            image_url: courseData.image_url,
            featured: courseData.featured,
            instructor_id: courseData.instructor_id
          })
          .select()
          .single();

        if (courseError) throw courseError;

        // Create lessons
        if (courseData.lessons && courseData.lessons.length > 0) {
          const lessonsToInsert = courseData.lessons.map((lesson: any) => ({
            course_id: course.id,
            title: lesson.title,
            description: lesson.description,
            duration_minutes: lesson.duration_minutes,
            content_type: lesson.content_type,
            video_url: lesson.video_url,
            file_url: lesson.file_url,
            order_index: lesson.order_index,
            is_free: lesson.is_free,
            price: lesson.price || 0
          }));

          const { error: lessonsError } = await supabase
            .from('lessons')
            .insert(lessonsToInsert);

          if (lessonsError) {
            console.error('Error creating lessons:', lessonsError);
          }
        }

        return course;
      } catch (error) {
        console.error('Error creating course in Supabase:', error);
        return this.createCourseInStorage(courseData);
      }
    } else {
      return this.createCourseInStorage(courseData);
    }
  }

  async enrollInCourse(courseId: string, userId: string): Promise<void> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('enrollments')
          .insert({
            user_id: userId,
            course_id: courseId,
            progress: 0,
            completed: false,
            payment_status: 'completed'
          });

        if (error) throw error;
      } catch (error) {
        console.error('Error enrolling in Supabase:', error);
        this.enrollInCourseStorage(courseId, userId);
      }
    } else {
      this.enrollInCourseStorage(courseId, userId);
    }
  }

  async getUserEnrollments(userId: string): Promise<any[]> {
    if (supabase) {
      try {
        const { data: enrollments, error } = await supabase
          .from('enrollments')
          .select(`
            *,
            course:courses(
              *,
              instructor:profiles(name, avatar_url),
              lessons(*)
            )
          `)
          .eq('user_id', userId)
          .order('enrolled_at', { ascending: false });

        if (error) throw error;
        return enrollments || [];
      } catch (error) {
        console.error('Error loading enrollments from Supabase:', error);
        return this.getUserEnrollmentsFromStorage(userId);
      }
    } else {
      return this.getUserEnrollmentsFromStorage(userId);
    }
  }

  async purchaseLesson(userId: string, lessonId: string, amount: number): Promise<void> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('lesson_purchases')
          .insert({
            user_id: userId,
            lesson_id: lessonId,
            amount_paid: amount,
            payment_method: 'mercadopago'
          });

        if (error) throw error;
      } catch (error) {
        console.error('Error purchasing lesson:', error);
        // Fallback to local storage
        this.purchaseLessonStorage(userId, lessonId, amount);
      }
    } else {
      this.purchaseLessonStorage(userId, lessonId, amount);
    }
  }

  // Local storage methods
  private getCoursesFromStorage(): Course[] {
    const saved = localStorage.getItem('campus-courses');
    return saved ? JSON.parse(saved) : [];
  }

  private getCourseFromStorage(id: string): Course | null {
    const courses = this.getCoursesFromStorage();
    return courses.find(course => course.id === id) || null;
  }

  private saveCoursesToStorage(courses: Course[]): void {
    localStorage.setItem('campus-courses', JSON.stringify(courses));
  }

  private createCourseInStorage(courseData: any): Course {
    const courses = this.getCoursesFromStorage();
    
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: courseData.title,
      short_description: courseData.short_description,
      description: courseData.description,
      category: courseData.category,
      level: courseData.level,
      price: courseData.price,
      tags: courseData.tags,
      image_url: courseData.image_url,
      featured: courseData.featured,
      instructor_id: courseData.instructor_id,
      lessons: courseData.lessons.map((lesson: any, index: number) => ({
        id: `lesson-${Date.now()}-${index}`,
        ...lesson
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      enrollments_count: 0
    };
    
    courses.unshift(newCourse);
    this.saveCoursesToStorage(courses);
    
    return newCourse;
  }

  private enrollInCourseStorage(courseId: string, userId: string): void {
    const enrollments = this.getEnrollmentsFromStorage();
    
    const newEnrollment = {
      id: `enrollment-${Date.now()}`,
      user_id: userId,
      course_id: courseId,
      enrolled_at: new Date().toISOString(),
      progress: 0,
      completed: false,
      payment_status: 'completed'
    };
    
    enrollments.push(newEnrollment);
    this.saveEnrollmentsToStorage(enrollments);
  }

  private getUserEnrollmentsFromStorage(userId: string): any[] {
    const enrollments = this.getEnrollmentsFromStorage();
    const courses = this.getCoursesFromStorage();
    
    return enrollments
      .filter(enrollment => enrollment.user_id === userId)
      .map(enrollment => {
        const course = courses.find(c => c.id === enrollment.course_id);
        return {
          ...enrollment,
          course
        };
      });
  }

  private purchaseLessonStorage(userId: string, lessonId: string, amount: number): void {
    const purchases = JSON.parse(localStorage.getItem('lesson-purchases') || '[]');
    purchases.push({
      id: `purchase-${Date.now()}`,
      user_id: userId,
      lesson_id: lessonId,
      amount_paid: amount,
      purchased_at: new Date().toISOString()
    });
    localStorage.setItem('lesson-purchases', JSON.stringify(purchases));
  }

  private getEnrollmentsFromStorage(): any[] {
    const saved = localStorage.getItem('campus-enrollments');
    return saved ? JSON.parse(saved) : [];
  }

  private saveEnrollmentsToStorage(enrollments: any[]): void {
    localStorage.setItem('campus-enrollments', JSON.stringify(enrollments));
  }
}

export const courseService = new CourseService();