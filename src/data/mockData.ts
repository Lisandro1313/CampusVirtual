import type { Course } from '../lib/supabase';

// Mock data for demo mode
export const allCourses: Course[] = [
  {
    id: '1',
    title: 'Metodologías de Enseñanza Innovadoras',
    description: 'Descubre las últimas metodologías pedagógicas para transformar tu práctica docente y mejorar el aprendizaje de tus estudiantes.',
    short_description: 'Metodologías pedagógicas modernas para docentes',
    instructor_id: 'teacher-1',
    category: 'Pedagogía',
    level: 'intermediate' as const,
    price: 15000,
    image_url: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg',
    featured: true,
    tags: ['metodología', 'innovación', 'pedagogía'],
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    title: 'Evaluación Formativa y Sumativa',
    description: 'Aprende a diseñar e implementar sistemas de evaluación efectivos que promuevan el aprendizaje continuo.',
    short_description: 'Técnicas de evaluación educativa efectiva',
    instructor_id: 'teacher-1',
    category: 'Evaluación',
    level: 'beginner' as const,
    price: 12000,
    image_url: 'https://images.pexels.com/photos/5427674/pexels-photo-5427674.jpeg',
    featured: false,
    tags: ['evaluación', 'formativa', 'sumativa'],
    created_at: '2024-01-02T00:00:00.000Z',
    updated_at: '2024-01-02T00:00:00.000Z'
  },
  {
    id: '3',
    title: 'Tecnología Educativa',
    description: 'Integra herramientas digitales en tu práctica docente para crear experiencias de aprendizaje más dinámicas.',
    short_description: 'Herramientas digitales para la educación',
    instructor_id: 'teacher-1',
    category: 'Tecnología',
    level: 'intermediate' as const,
    price: 18000,
    image_url: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg',
    featured: true,
    tags: ['tecnología', 'digital', 'herramientas'],
    created_at: '2024-01-03T00:00:00.000Z',
    updated_at: '2024-01-03T00:00:00.000Z'
  },
  {
    id: '4',
    title: 'Gestión del Aula',
    description: 'Desarrolla habilidades para crear un ambiente de aprendizaje positivo y manejar la disciplina de manera efectiva.',
    short_description: 'Técnicas de manejo y organización del aula',
    instructor_id: 'teacher-1',
    category: 'Gestión',
    level: 'beginner' as const,
    price: 10000,
    image_url: 'https://images.pexels.com/photos/5212703/pexels-photo-5212703.jpeg',
    featured: false,
    tags: ['gestión', 'disciplina', 'ambiente'],
    created_at: '2024-01-04T00:00:00.000Z',
    updated_at: '2024-01-04T00:00:00.000Z'
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