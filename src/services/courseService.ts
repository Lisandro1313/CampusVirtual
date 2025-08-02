import { supabase, Course, Lesson, Enrollment, LessonProgress } from '../lib/supabase';

import { allCourses } from '../data/mockData';

class CourseService {
  async getCourses(): Promise<Course[]> {
    // Use mock data instead of Supabase to avoid policy errors
    console.log('📚 Loading courses from mock data');
    return allCourses;
  }

  async getCourse(id: string): Promise<Course | null> {
    console.log('📖 Loading course from mock data:', id);
    return allCourses.find(course => course.id === id) || null;
  }

  async createCourse(courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> {
    console.log('✨ Creating new course (mock):', courseData.title);
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      enrollments_count: 0
    };
    allCourses.unshift(newCourse);
    return newCourse;
  }

  async getLessons(courseId: string): Promise<Lesson[]> {
    console.log('📝 Loading lessons from mock data for course:', courseId);
    return [];
  }

  async createLesson(lessonData: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>): Promise<Lesson> {
    console.log('📝 Creating new lesson (mock):', lessonData.title);
    const newLesson: Lesson = {
      ...lessonData,
      id: `lesson-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return newLesson;
  }

  async enrollInCourse(courseId: string, userId: string): Promise<void> {
    console.log('🎓 Enrolling user (mock):', userId, 'in course:', courseId);
  }

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    console.log('📊 Loading enrollments from mock data for user:', userId);
    // Return empty array for now - you can add mock enrollments later
    return [];
  }

  async updateLessonProgress(userId: string, lessonId: string, completed: boolean, watchTime: number): Promise<void> {
    console.log('📈 Updating lesson progress (mock):', lessonId, completed);
  }
}

export const courseService = new CourseService();