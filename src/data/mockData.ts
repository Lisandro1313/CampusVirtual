import type { Course } from '../lib/supabase';
import type { LessonProgress } from '../lib/supabase';

// Mock data for demo mode
export let allCourses: Course[] = [];

// Function to get courses by instructor
export const getCoursesByInstructor = (instructorId: string): Course[] => {
  return allCourses.filter(course => course.instructor_id === instructorId);
};

export const testimonials = [
  {
    id: '1',
    name: 'María González',
    role: 'Profesora de Primaria',
    content: 'Los cursos de formación docente han transformado mi práctica en el aula. Las metodologías innovadoras que aprendí me ayudaron a conectar mejor con mis estudiantes.',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    rating: 5
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    role: 'Director de Escuela',
    content: 'Excelente plataforma para la capacitación continua. Los contenidos son actualizados y muy relevantes para los desafíos educativos actuales.',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    rating: 5
  },
  {
    id: '3',
    name: 'Ana Martínez',
    role: 'Profesora de Secundaria',
    content: 'La integración de tecnología educativa que aprendí aquí ha revolucionado mis clases. Mis estudiantes están más motivados y participativos.',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    rating: 5
  }
];

export const mockEnrollments = [
  {
    id: 'enrollment-1',
    user_id: 'teacher-1',
    course_id: '1',
    enrolled_at: '2024-01-15T00:00:00.000Z',
    progress: 75,
    completed: false,
    payment_status: 'completed'
  },
  {
    id: 'enrollment-2', 
    user_id: 'teacher-1',
    course_id: '2',
    enrolled_at: '2024-01-20T00:00:00.000Z',
    progress: 100,
    completed: true,
    payment_status: 'completed'
  }
];

export const mockAnnouncements = [
  {
    id: '1',
    title: 'Bienvenidos al nuevo período académico',
    content: 'Estimados estudiantes, les damos la bienvenida al nuevo período académico. Esperamos que este sea un año de mucho aprendizaje y crecimiento profesional.',
    author_id: 'admin-1',
    category: 'general',
    priority: 'high',
    published: true,
    published_at: '2024-01-01T00:00:00.000Z',
    created_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    title: 'Nuevos cursos disponibles',
    content: 'Hemos agregado nuevos cursos de formación docente. Revisen el catálogo y no duden en inscribirse.',
    author_id: 'teacher-1',
    category: 'academic',
    priority: 'medium',
    published: true,
    published_at: '2024-01-10T00:00:00.000Z',
    created_at: '2024-01-10T00:00:00.000Z'
  }
];

export const mockProgress: LessonProgress[] = [];