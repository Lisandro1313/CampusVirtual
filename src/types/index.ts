export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  joinedAt: string;
  bio?: string;
  location?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  instructor: string;
  instructorId: string;
  instructorAvatar: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  featured: boolean;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  curriculum: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'text' | 'quiz';
  completed?: boolean;
  videoUrl?: string;
  content?: string;
  description?: string;
}

export interface CartItem {
  courseId: string;
  course: Course;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  course: string;
  rating: number;
  comment: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  progress: number;
  completed: boolean;
  certificateIssued: boolean;
}

export interface CourseProgress {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: string;
}

export interface CourseStats {
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  completionRate: number;
}