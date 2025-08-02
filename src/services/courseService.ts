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
  instructor_name: string;
  lessons: Lesson[];
  created_at: string;
  updated_at: string;
  enrollments_count: number;
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
  private getCoursesFromStorage(): Course[] {
    const saved = localStorage.getItem('campus-courses');
    return saved ? JSON.parse(saved) : [];
  }

  private saveCoursesToStorage(courses: Course[]): void {
    localStorage.setItem('campus-courses', JSON.stringify(courses));
  }

  private getEnrollmentsFromStorage(): Enrollment[] {
    const saved = localStorage.getItem('campus-enrollments');
    return saved ? JSON.parse(saved) : [];
  }

  private saveEnrollmentsToStorage(enrollments: Enrollment[]): void {
    localStorage.setItem('campus-enrollments', JSON.stringify(enrollments));
  }

  async getCourses(): Promise<Course[]> {
    return this.getCoursesFromStorage();
  }

  async getCourse(id: string): Promise<Course | null> {
    const courses = this.getCoursesFromStorage();
    return courses.find(course => course.id === id) || null;
  }

  async createCourse(courseData: any): Promise<Course> {
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
      instructor_name: courseData.instructor_name,
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

  async enrollInCourse(courseId: string, userId: string): Promise<void> {
    const enrollments = this.getEnrollmentsFromStorage();
    
    const newEnrollment: Enrollment = {
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

  async getUserEnrollments(userId: string): Promise<any[]> {
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

  async updateLessonProgress(userId: string, lessonId: string, completed: boolean): Promise<void> {
    console.log('Lesson progress updated:', lessonId, completed);
  }
}

export const courseService = new CourseService();