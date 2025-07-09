/*
  # Configuración inicial de Campus Lisandro

  1. Nuevas Tablas
    - `profiles` - Perfiles de usuarios extendidos
    - `courses` - Cursos creados por instructores
    - `lessons` - Lecciones individuales dentro de cursos
    - `lesson_purchases` - Compras de lecciones individuales
    - `announcements` - Cartelera de anuncios
    - `email_notifications` - Log de emails enviados
    - `lesson_progress` - Progreso de estudiantes en lecciones

  2. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas para cada tipo de usuario
    - Protección de contenido premium

  3. Funcionalidades
    - Sistema de pagos por lección
    - Notificaciones automáticas
    - Cartelera de anuncios
*/

-- Crear tabla de perfiles extendidos
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  avatar_url text,
  bio text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de cursos
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  short_description text,
  instructor_id uuid REFERENCES profiles(id) NOT NULL,
  category text NOT NULL,
  level text NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  image_url text,
  featured boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de lecciones
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  video_url text,
  duration_minutes integer DEFAULT 0,
  price decimal(10,2) NOT NULL DEFAULT 0,
  order_index integer NOT NULL DEFAULT 0,
  content_type text DEFAULT 'video' CHECK (content_type IN ('video', 'text', 'quiz')),
  materials jsonb DEFAULT '[]', -- PDFs, archivos adjuntos
  is_free boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de compras de lecciones
CREATE TABLE IF NOT EXISTS lesson_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  lesson_id uuid REFERENCES lessons(id) NOT NULL,
  amount_paid decimal(10,2) NOT NULL,
  payment_method text NOT NULL,
  stripe_payment_id text,
  purchased_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Crear tabla de progreso de lecciones
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  lesson_id uuid REFERENCES lessons(id) NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  watch_time_seconds integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Crear tabla de anuncios
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES profiles(id) NOT NULL,
  published boolean DEFAULT false,
  published_at timestamptz,
  email_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de notificaciones por email
CREATE TABLE IF NOT EXISTS email_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email text NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  type text NOT NULL CHECK (type IN ('announcement', 'purchase_confirmation', 'new_lesson')),
  sent_at timestamptz DEFAULT now(),
  announcement_id uuid REFERENCES announcements(id),
  lesson_id uuid REFERENCES lessons(id)
);

-- Crear tabla de suscripciones a notificaciones
CREATE TABLE IF NOT EXISTS notification_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  email_announcements boolean DEFAULT true,
  email_new_lessons boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Políticas para courses
CREATE POLICY "Anyone can read published courses"
  ON courses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Teachers can create courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers can update own courses"
  ON courses FOR UPDATE
  TO authenticated
  USING (
    instructor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Políticas para lessons
CREATE POLICY "Anyone can read lesson info"
  ON lessons FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Teachers can manage lessons"
  ON lessons FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE id = course_id 
      AND (instructor_id = auth.uid() OR 
           EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
    )
  );

-- Políticas para lesson_purchases
CREATE POLICY "Users can read own purchases"
  ON lesson_purchases FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create purchases"
  ON lesson_purchases FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Políticas para lesson_progress
CREATE POLICY "Users can manage own progress"
  ON lesson_progress FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Políticas para announcements
CREATE POLICY "Anyone can read published announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (published = true);

CREATE POLICY "Teachers and admins can manage announcements"
  ON announcements FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('teacher', 'admin')
    )
  );

-- Políticas para email_notifications (solo admins)
CREATE POLICY "Admins can read email notifications"
  ON email_notifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Políticas para notification_subscriptions
CREATE POLICY "Users can manage own subscriptions"
  ON notification_subscriptions FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_lesson_progress_updated_at BEFORE UPDATE ON lesson_progress FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();