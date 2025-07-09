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
    bio: 'Estudiante apasionado por la tecnología y el desarrollo web.',
    location: 'Buenos Aires, Argentina'
  },
  {
    id: '2',
    name: 'María González',
    email: 'docente@campus.com',
    role: 'teacher',
    avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    joinedAt: '2023-08-10T00:00:00.000Z',
    bio: 'Desarrolladora Full Stack con 8 años de experiencia. Especialista en React y Node.js.',
    location: 'Córdoba, Argentina'
  },
  {
    id: '3',
    name: 'Admin Campus',
    email: 'admin@campus.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    joinedAt: '2023-01-01T00:00:00.000Z',
    bio: 'Administrador del sistema Campus Lisandro.',
    location: 'Buenos Aires, Argentina'
  }
];

export const featuredCourses: Course[] = [
  {
    id: '1',
    title: 'Desarrollo Web Full Stack con React y Node.js',
    description: 'Aprende a crear aplicaciones web completas desde cero usando las tecnologías más demandadas del mercado. Este curso te llevará desde los fundamentos hasta proyectos avanzados.',
    shortDescription: 'Domina React, Node.js, y MongoDB para crear aplicaciones web profesionales.',
    instructor: 'María González',
    instructorId: '2',
    instructorAvatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    price: 89.99,
    originalPrice: 129.99,
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    category: 'Tecnología',
    duration: '12 semanas',
    lessons: 45,
    students: 1250,
    rating: 4.8,
    featured: true,
    level: 'intermediate',
    tags: ['React', 'Node.js', 'JavaScript', 'MongoDB'],
    curriculum: [
      { 
        id: '1', 
        title: 'Introducción a React', 
        duration: '45 min', 
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dGcsHMXbSOA',
        description: 'Aprende los conceptos básicos de React y cómo configurar tu primer proyecto.'
      },
      { 
        id: '2', 
        title: 'Componentes y Props', 
        duration: '60 min', 
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dGcsHMXbSOA',
        description: 'Domina la creación de componentes reutilizables y el paso de datos con props.'
      },
      { 
        id: '3', 
        title: 'Estado y Hooks', 
        duration: '75 min', 
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dGcsHMXbSOA',
        description: 'Maneja el estado de la aplicación con useState y otros hooks esenciales.'
      },
      { 
        id: '4', 
        title: 'Ejercicio Práctico: Todo App', 
        duration: '30 min', 
        type: 'quiz',
        description: 'Pon en práctica lo aprendido creando una aplicación de tareas.'
      },
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: '2',
    title: 'Diseño UX/UI Profesional con Figma',
    description: 'Conviértete en un diseñador UX/UI profesional y aprende a crear interfaces intuitivas y atractivas que mejoren la experiencia del usuario.',
    shortDescription: 'Diseña interfaces profesionales y mejora la experiencia del usuario.',
    instructor: 'Carlos Mendoza',
    instructorId: '4',
    instructorAvatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    price: 69.99,
    originalPrice: 99.99,
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    category: 'Diseño',
    duration: '8 semanas',
    lessons: 32,
    students: 890,
    rating: 4.9,
    featured: true,
    level: 'beginner',
    tags: ['Figma', 'UX', 'UI', 'Prototipado'],
    curriculum: [
      { 
        id: '1', 
        title: 'Fundamentos del Diseño UX', 
        duration: '50 min', 
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dGcsHMXbSOA',
        description: 'Comprende los principios básicos del diseño centrado en el usuario.'
      },
      { 
        id: '2', 
        title: 'Wireframing y Prototipado', 
        duration: '65 min', 
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dGcsHMXbSOA',
        description: 'Aprende a crear wireframes y prototipos efectivos en Figma.'
      },
    ],
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z'
  },
  {
    id: '3',
    title: 'Marketing Digital y Redes Sociales',
    description: 'Estrategias completas de marketing digital para hacer crecer tu negocio en el mundo digital y maximizar tu presencia online.',
    shortDescription: 'Domina las estrategias de marketing digital más efectivas.',
    instructor: 'Ana Rodríguez',
    instructorId: '5',
    instructorAvatar: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    price: 79.99,
    image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    category: 'Marketing',
    duration: '10 semanas',
    lessons: 38,
    students: 1450,
    rating: 4.7,
    featured: true,
    level: 'intermediate',
    tags: ['Marketing', 'Redes Sociales', 'SEO', 'Publicidad'],
    curriculum: [
      { 
        id: '1', 
        title: 'Estrategias de Marketing Digital', 
        duration: '55 min', 
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dGcsHMXbSOA',
        description: 'Fundamentos y estrategias clave del marketing digital moderno.'
      },
      { 
        id: '2', 
        title: 'SEO y SEM', 
        duration: '70 min', 
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dGcsHMXbSOA',
        description: 'Optimización para motores de búsqueda y marketing en buscadores.'
      },
    ],
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-25T00:00:00.000Z'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Laura Martínez',
    avatar: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    course: 'Desarrollo Web Full Stack',
    rating: 5,
    comment: 'Excelente curso, muy completo y bien explicado. Los proyectos prácticos me ayudaron mucho a consolidar los conocimientos.'
  },
  {
    id: '2',
    name: 'Roberto Chen',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    course: 'Diseño UX/UI con Figma',
    rating: 5,
    comment: 'El instructor explica de manera muy clara y los ejercicios son súper útiles. Recomiendo este curso a cualquiera que quiera aprender diseño.'
  },
  {
    id: '3',
    name: 'Sofía Herrera',
    avatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    course: 'Marketing Digital',
    rating: 5,
    comment: 'Increíble la cantidad de estrategias que aprendí. Ya estoy aplicando todo en mi negocio y veo resultados reales.'
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