// Mock data for demo mode
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