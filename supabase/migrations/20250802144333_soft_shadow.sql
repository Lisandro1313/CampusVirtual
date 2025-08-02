/*
  # Insert initial data

  1. Initial Data
    - Sample courses for E.S.FD
    - Sample lessons for each course
    - Sample announcements

  Note: Users (admin, Norma) will be created when they first sign up
*/

-- Insert sample courses (will be associated with instructor when they sign up)
INSERT INTO courses (id, title, description, short_description, category, level, price, image_url, featured, tags) VALUES
(
  'course-metodologias',
  'Metodologías de Enseñanza Innovadoras',
  'Descubre las metodologías pedagógicas más efectivas para el aula moderna. Aprende técnicas innovadoras que transformarán tu práctica docente y mejorarán el aprendizaje de tus estudiantes. Este curso abarca desde los fundamentos teóricos hasta la aplicación práctica de metodologías activas, colaborativas y centradas en el estudiante.',
  'Técnicas pedagógicas innovadoras para el aula del siglo XXI.',
  'Pedagogía',
  'intermediate',
  15000.00,
  'https://images.pexels.com/photos/8197530/pexels-photo-8197530.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
  true,
  ARRAY['Pedagogía', 'Metodología', 'Innovación', 'Didáctica']
),
(
  'course-tecnologia',
  'Tecnología Educativa y Herramientas Digitales',
  'Integra la tecnología en el aula de manera efectiva. Aprende a utilizar herramientas digitales que potencien el aprendizaje y la participación de tus estudiantes. Desde plataformas educativas hasta aplicaciones móviles, descubre cómo la tecnología puede transformar tu enseñanza.',
  'Integración efectiva de tecnología en el proceso educativo.',
  'Tecnología Educativa',
  'beginner',
  12000.00,
  'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
  true,
  ARRAY['Tecnología', 'Herramientas Digitales', 'Innovación', 'TIC']
),
(
  'course-gestion',
  'Gestión del Aula y Disciplina Positiva',
  'Desarrolla habilidades para crear un ambiente de aprendizaje positivo y productivo. Aprende técnicas de gestión del aula basadas en el respeto mutuo y la disciplina positiva. Estrategias para manejar conflictos, motivar estudiantes y crear un clima de aprendizaje óptimo.',
  'Técnicas efectivas para la gestión del aula y disciplina positiva.',
  'Gestión Educativa',
  'intermediate',
  10000.00,
  'https://images.pexels.com/photos/8197528/pexels-photo-8197528.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
  true,
  ARRAY['Gestión', 'Disciplina', 'Convivencia', 'Aula']
);

-- Insert sample lessons for each course
INSERT INTO lessons (course_id, title, description, video_url, content_type, duration_minutes, order_index, is_free) VALUES
-- Metodologías de Enseñanza
('course-metodologias', 'Fundamentos de la Pedagogía Moderna', 'Conceptos fundamentales de las nuevas metodologías pedagógicas.', 'https://www.youtube.com/embed/dGcsHMXbSOA', 'video', 45, 1, true),
('course-metodologias', 'Técnicas de Enseñanza Activa', 'Estrategias para involucrar activamente a los estudiantes en el proceso de aprendizaje.', 'https://www.youtube.com/embed/dGcsHMXbSOA', 'video', 60, 2, false),
('course-metodologias', 'Evaluación Formativa', 'Métodos de evaluación continua para mejorar el aprendizaje.', 'https://www.youtube.com/embed/dGcsHMXbSOA', 'video', 75, 3, false),
('course-metodologias', 'Ejercicio Práctico: Planificación de Clase', 'Aplica las metodologías aprendidas en una planificación real.', '', 'text', 30, 4, false),

-- Tecnología Educativa
('course-tecnologia', 'Introducción a la Tecnología Educativa', 'Conceptos básicos de la integración tecnológica en educación.', 'https://www.youtube.com/embed/dGcsHMXbSOA', 'video', 50, 1, true),
('course-tecnologia', 'Herramientas Digitales para el Aula', 'Plataformas y aplicaciones útiles para la enseñanza.', 'https://www.youtube.com/embed/dGcsHMXbSOA', 'video', 65, 2, false),
('course-tecnologia', 'Creación de Contenido Digital', 'Cómo crear materiales educativos digitales atractivos.', 'https://www.youtube.com/embed/dGcsHMXbSOA', 'video', 55, 3, false),

-- Gestión del Aula
('course-gestion', 'Fundamentos de la Gestión del Aula', 'Principios básicos para crear un ambiente de aprendizaje efectivo.', 'https://www.youtube.com/embed/dGcsHMXbSOA', 'video', 55, 1, true),
('course-gestion', 'Técnicas de Disciplina Positiva', 'Estrategias para mantener la disciplina basada en el respeto.', 'https://www.youtube.com/embed/dGcsHMXbSOA', 'video', 70, 2, false),
('course-gestion', 'Resolución de Conflictos', 'Métodos para manejar y resolver conflictos en el aula.', 'https://www.youtube.com/embed/dGcsHMXbSOA', 'video', 60, 3, false);