import { Course, Lesson, Enrollment } from '../lib/supabase';

class CourseService {
  private getCoursesFromStorage(): Course[] {
    const saved = localStorage.getItem('campus-courses');
    return saved ? JSON.parse(saved) : [];
  }

  private saveCoursesToStorage(courses: Course[]): void {
    localStorage.setItem('campus-courses', JSON.stringify(courses));
  }

  async getCourses(): Promise<Course[]> {
    return this.getCoursesFromStorage();
  }

  async getCourse(id: string): Promise<Course | null> {
    const courses = this.getCoursesFromStorage();
    return courses.find(course => course.id === id) || null;
  }

  async createCourse(courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> {
    const courses = this.getCoursesFromStorage();
    
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      enrollments_count: 0
    };
    
    courses.unshift(newCourse);
    this.saveCoursesToStorage(courses);
    
    return newCourse;
  }

  async getLessons(courseId: string): Promise<Lesson[]> {
    const saved = localStorage.getItem(`lessons-${courseId}`);
    return saved ? JSON.parse(saved) : [];
  }

  async createLesson(lessonData: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>): Promise<Lesson> {
    const lessons = await this.getLessons(lessonData.course_id);
    
    const newLesson: Lesson = {
      ...lessonData,
      id: `lesson-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    lessons.push(newLesson);
    localStorage.setItem(`lessons-${lessonData.course_id}`, JSON.stringify(lessons));
    
    return newLesson;
  }

  async enrollInCourse(courseId: string, userId: string): Promise<void> {
    // Mock enrollment
    console.log('Enrolled user', userId, 'in course', courseId);
  }

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    const saved = localStorage.getItem(`enrollments-${userId}`);
    return saved ? JSON.parse(saved) : [];
  }

  async updateLessonProgress(userId: string, lessonId: string, completed: boolean, watchTime: number): Promise<void> {
    console.log('Updated lesson progress:', lessonId, completed);
  }
}

export const courseService = new CourseService();