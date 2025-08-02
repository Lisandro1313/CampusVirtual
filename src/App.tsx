import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AuthProvider } from './components/auth/AuthProvider';
import { useAuth } from './hooks/useAuth';
import { Landing } from './pages/Landing';
import { Courses } from './pages/Courses';
import { Login } from './pages/Login';
import { StudentDashboard } from './pages/StudentDashboard';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { NewCoursePlayer } from './pages/NewCoursePlayer';
import { Announcements } from './pages/Announcements';
import { CreateAnnouncement } from './pages/CreateAnnouncement';
import { Analytics } from './pages/Analytics';
import { StudentProgress } from './pages/StudentProgress';
import { TeacherAnalytics } from './pages/TeacherAnalytics';
import { Cart } from './pages/Cart';
import { Profile } from './pages/Profile';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { NewCourse } from './pages/NewCourse';
import { CourseDetail } from './pages/CourseDetail';
import { Register } from './pages/Register';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { auth } = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.user?.role || '')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const DashboardRouter: React.FC = () => {
  const { auth } = useAuth();

  React.useEffect(() => {
    console.log('🏠 DashboardRouter - auth state changed:', {
      isAuthenticated: auth.isAuthenticated,
      isLoading: auth.isLoading,
      userRole: auth.profile?.role,
      userId: auth.user?.id,
      profileExists: !!auth.profile
    });
  }, [auth]);

  if (!auth.isAuthenticated) {
    console.log('🚫 Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (auth.isLoading) {
    console.log('⏳ Auth still loading...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil de usuario...</p>
        </div>
      </div>
    );
  }

  if (!auth.profile) {
    console.log('⚠️ No profile found, showing error');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Error de Perfil</h2>
          <p className="text-gray-600 mb-4">No se pudo cargar tu perfil. Verifica la configuración.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  console.log('🎯 Routing to dashboard based on role:', auth.profile?.role);
  switch (auth.profile?.role) {
    case 'teacher':
      console.log('👩‍🏫 Loading teacher dashboard');
      return <TeacherDashboard />;
    case 'admin':
      console.log('👨‍💼 Loading admin dashboard (teacher dashboard)');
      return <TeacherDashboard />;
    case 'student':
    default:
      console.log('👨‍🎓 Loading student dashboard');
      return <StudentDashboard />;
  }
};

function AppContent() {
  const { auth } = useAuth();

  // Auto-navigate after successful login
  React.useEffect(() => {
    if (auth.isAuthenticated && !auth.isLoading && window.location.pathname === '/login') {
      console.log('🎯 Auto-navigating to dashboard after login');
      window.location.href = '/dashboard';
    }
  }, [auth.isAuthenticated, auth.isLoading]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route 
              path="/announcements/new" 
              element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                  <CreateAnnouncement />
                </ProtectedRoute>
              } 
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route 
              path="/login" 
              element={auth.isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={auth.isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/course/:courseId/learn" 
              element={
                <ProtectedRoute>
                  <NewCoursePlayer />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teacher/course/new" 
              element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                  <NewCourse />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teacher/analytics" 
              element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                  <TeacherAnalytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/progress" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentProgress />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;