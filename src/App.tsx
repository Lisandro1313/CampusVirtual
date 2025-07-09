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
import { Analytics } from './pages/Analytics';
import { StudentProgress } from './pages/StudentProgress';
import { TeacherAnalytics } from './pages/TeacherAnalytics';
import { Cart } from './pages/Cart';
import { Profile } from './pages/Profile';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { NewCourse } from './pages/NewCourse';

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

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  switch (auth.user?.role) {
    case 'teacher':
      return <TeacherDashboard />;
    case 'admin':
      return <TeacherDashboard />; // Admin uses teacher dashboard for now
    case 'student':
    default:
      return <StudentDashboard />;
  }
};

function AppContent() {
  const { auth } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route 
              path="/login" 
              element={auth.isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
            />
            <Route path="/register" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl">Register Page - Coming Soon</div>
              </div>
            } />
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