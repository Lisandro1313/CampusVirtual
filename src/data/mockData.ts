import { Course, Testimonial, User, Enrollment, CourseProgress } from '../types';

// Usuarios predeterminados para testing
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'estudiante@campus.com',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    joinedAt: '2024-01-15T00:00:00.000Z',
    bio: 'Estudiante de formación docente, apasionado por la educación.',
    location: 'Punta Lara, Argentina'
  },
  {
    id: '2',
    name: 'Norma Skuletich',
    email: 'docente@campus.com',
    role: 'teacher',
    avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    joinedAt: '2023-08-10T00:00:00.000Z',
    bio: 'Magister en Educación. Directora de E.S.FD con más de 15 años de experiencia en formación docente.',
    location: 'Calle 102 n 735, Punta Lara'
  },
  {
    id: '3',
    name: 'Admin E.S.FD',
    email: 'admin@campus.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    joinedAt: '2023-01-01T00:00:00.000Z',
    bio: 'Administrador del sistema E.S.FD.',
    location: 'Punta Lara, Argentina'
  }
];

export const featuredCourses: Course[] = [
  {
    id: '1',
    title: 'Metodologías de Enseñanza Innovadoras',
    description: 'Descubre las metodologías pedagógicas más efectivas para el aula moderna. Aprende técnicas innovadoras que transformarán tu práctica docente y mejorarán el aprendizaje de tus estudiantes.',
    shortDescription: 'Técnicas pedagógicas innovadoras para el aula del siglo XXI.',
    instructor: 'Norma Skuletich',
    instructorId: '2',
    instructorAvatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    price: 15000,
    originalPrice: 20000,
    image: 'https://images.pexels.com/photos/8197530/pexels-photo-8197530.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    category: 'Pedagogía',
    duration: '8 semanas',
    lessons: 24,
    students: 125,
    rating: 4.8,
    featured: true,
    level: 'intermediate',
    tags: ['Pedagogía', 'Metodología', 'Innovación', 'Didáctica'],
    curriculum: [
      { 
        id: '1', 
        title: 'Fundamentos de la Pedagogía Moderna', 
        duration: '45 min', 
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dGcsHMXbSOA',
        description: 'Conceptos fundamentales de las nuevas metodologías pedagógicas.'
      },
      { 
        id: '2', 
        title: 'Técnicas de Enseñanza Activa', 
        duration: '60 min', 
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dGcsHMXbSOA',
        description: 'Estrategias para involucrar activamente a los estudiantes en el proceso de aprendizaje.'
      },
      { 
        id: '3', 
        title: 'Evaluación Formativa', 
        duration: '75 min', 
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dGcsHMXbSOA',
        description: 'Métodos de evaluación continua para mejorar el aprendizaje.'
      },
      { 
        id: '4', 
        title: 'Ejercicio Práctico: Planificación de Clase', 
        duration: '30 min', 
        type: 'quiz',
        description: 'Aplica las metodologías aprendidas en una planificación real.'
      },
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: '2',
    title: 'Tecnología Educativa y Herramientas Digitales',
    description: 'Integra la tecnología en el aula de manera efectiva. Aprende a utilizar herramientas digitales que potencien el aprendizaje y la participación de tus estudiantes.',
    shortDescription: 'Integración efectiva de tecnología en el proceso educativo.',
    instructor: 'Norma Skuletich',
    instructorId: '2',
    instructorAvatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    price: 12000,
    originalPrice: 16000,
    image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    category: 'Tecnología Educativa',
    duration: '6 semanas',
    lessons: 18,
    students: 89,
    rating: 4.9,
    featured: true,
    level: 'beginner',
    tags: ['Tecnología', 'Herramientas Digitales', 'Innovación', 'TIC'],
    curriculum: [
      { 
        id: '1', 
        title: 'Introducción a la Tecnología Educativa', 
        duration: '50 min', 
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dGcsHMXbSOA',
        description: 'Conceptos básicos de la integración tecnológica en educación.'
      },
      { 
        id: '2', 
        title: 'Herramientas Digitales para el Aula', 
        duration: '65 min', 
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dGcsHMXbSOA',
        description: 'Plataformas y aplicaciones útiles para la enseñanza.'
      },
    ],
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z'
  },
  {
    id: '3',
    title: 'Gestión del Aula y Disciplina Positiva',
    description: 'Desarrolla habilidades para crear un ambiente de aprendizaje positivo y productivo. Aprende técnicas de gestión del aula basadas en el respeto mutuo y la disciplina positiva.',
    shortDescription: 'Técnicas efectivas para la gestión del aula y disciplina positiva.',
    instructor: 'Norma Skuletich',
    instructorId: '2',
    instructorAvatar: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    price: 10000,
    image: 'https://images.pexels.com/photos/8197528/pexels-photo-8197528.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    category: 'Gestión Educativa',
    duration: '4 semanas',
    lessons: 16,
    students: 145,
    rating: 4.7,
    featured: true,
    level: 'intermediate',
    tags: ['Gestión', 'Disciplina', 'Convivencia', 'Aula'],
    curriculum: [
      { 
        id: '1', 
        title: 'Fundamentos de la Gestión del Aula', 
        duration: '55 min', 
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dGcsHMXbSOA',
        description: 'Principios básicos para crear un ambiente de aprendizaje efectivo.'
      },
      { 
        id: '2', 
        title: 'Técnicas de Disciplina Positiva', 
        duration: '70 min', 
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dGcsHMXbSOA',
        description: 'Estrategias para mantener la disciplina basada en el respeto.'
      },
    ],
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-25T00:00:00.000Z'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'María González',
    avatar: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    course: 'Metodologías de Enseñanza Innovadoras',
    rating: 5,
    comment: 'Excelente curso, transformó completamente mi manera de enseñar. Las técnicas son muy prácticas y efectivas.'
  },
  {
    id: '2',
    name: 'Carlos Mendoza',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    course: 'Tecnología Educativa',
    rating: 5,
    comment: 'Norma explica de manera muy clara cómo integrar la tecnología en el aula. Muy recomendable.'
  },
  {
    id: '3',
    name: 'Ana Rodríguez',
    avatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    course: 'Gestión del Aula',
    rating: 5,
    comment: 'Las técnicas de disciplina positiva han mejorado enormemente el clima en mi aula. Excelente formación.'
  }
];

export const allCourses: Course[] = [...featuredCourses];

// Inscripciones del estudiante
export const mockEnrollments: Enrollment[] = [
  {
    id: '1',
    userId: '1',
    courseId: '1',
    enrolledAt: '2024-01-20T00:00:00.000Z',
    progress: 65,
    completed: false,
    certificateIssued: false
  },
  {
    id: '2',
    userId: '1',
    courseId: '2',
    enrolledAt: '2024-01-25T00:00:00.000Z',
    progress: 30,
    completed: false,
    certificateIssued: false
  }
];

// Progreso de lecciones
export const mockProgress: CourseProgress[] = [
  {
    id: '1',
    userId: '1',
    courseId: '1',
    lessonId: '1',
    completed: true,
    completedAt: '2024-01-21T00:00:00.000Z'
  },
  {
    id: '2',
    userId: '1',
    courseId: '1',
    lessonId: '2',
    completed: true,
    completedAt: '2024-01-22T00:00:00.000Z'
  },
  {
    id: '3',
    userId: '1',
    courseId: '1',
    lessonId: '3',
    completed: false
  }
];