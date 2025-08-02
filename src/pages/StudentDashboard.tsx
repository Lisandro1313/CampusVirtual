import React, { useState } from 'react';
import { BookOpen, Clock, Award, TrendingUp, Play, CheckCircle, User, Settings, BarChart3, Megaphone } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { courseService } from '../services/courseService';
import { Enrollment, Course } from '../lib/supabase';
import { Link } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (auth.profile?.id) {
      loadEnrollments();
    }
  }, [auth.profile?.id]);

  const loadEnrollments = async () => {
    try {
      const userEnrollments = await courseService.getUserEnrollments(auth.profile?.id || '');
      setEnrollments(userEnrollments);
    } catch (error) {
      console.error('Error loading enrollments:', error);
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate real stats from actual enrollments
  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter(e => e.completed).length;
  const averageProgress = enrollments.reduce((acc, e) => acc + e.progress, 0) / totalCourses || 0;
  const totalHours = Math.round(averageProgress * totalCourses * 0.75); // Estimate based on real progress

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  const tabs = [
    { id: 'courses', label: 'Mis Cursos', icon: BookOpen },
    { id: 'progress', label: 'Progreso', icon: TrendingUp },
    { id: 'announcements', label: 'Anuncios', icon: Megaphone },
    { id: 'certificates', label: 'Certificados', icon: Award },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={auth.user?.avatar}
              alt={auth.user?.name}
              className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ¡Hola, {auth.user?.name}! 👋
              </h1>
              <p className="text-gray-600">Continúa tu aprendizaje donde lo dejaste</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cursos Activos</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completados</p>
                  <p className="text-2xl font-bold text-gray-900">{completedCourses}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Progreso Promedio</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(averageProgress)}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Horas de Estudio</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(totalHours)}h</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'courses' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Mis Cursos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      <img
                        src={(enrollment as any).course?.image_url || 'https://images.pexels.com/photos/8197530/pexels-photo-8197530.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2'}
                        alt={(enrollment as any).course?.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {(enrollment as any).course?.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Por Norma Skuletich
                        </p>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progreso</span>
                            <span>{enrollment.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <Link
                          to={`/course/${enrollment.course_id}/learn`}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Continuar Curso
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {enrollments.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tienes cursos inscritos
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Explora nuestro catálogo y comienza tu aprendizaje
                    </p>
                    <Link
                      to="/courses"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Explorar Cursos
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'progress' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Progreso Detallado</h2>
                <div className="space-y-6">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">
                          {(enrollment as any).course?.title}
                        </h3>
                        <span className="text-sm font-medium text-blue-600">
                          {enrollment.progress}% completado
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Lecciones</p>
                          <p className="font-semibold">{(enrollment as any).course?.lessons?.length || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Completadas</p>
                          <p className="font-semibold">
                            {Math.round((enrollment.progress / 100) * ((enrollment as any).course?.lessons?.length || 0))}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Tiempo restante</p>
                          <p className="font-semibold">
                            {Math.round(((100 - enrollment.progress) / 100) * 12)} semanas
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Inscrito</p>
                          <p className="font-semibold">
                            {new Date(enrollment.enrolled_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'announcements' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Anuncios Recientes</h2>
                  <Link
                    to="/announcements"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Ver todos →
                  </Link>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                        <Megaphone className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-900 mb-2">
                          🎉 Nuevos cursos de IA disponibles
                        </h3>
                        <p className="text-blue-800 text-sm mb-3">
                          Descubre nuestra nueva serie de cursos sobre Inteligencia Artificial y Machine Learning.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-blue-600">Hace 2 días</span>
                          <Link
                            to="/announcements"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Leer más
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-900 mb-2">
                          🏆 Concurso de proyectos 2024
                        </h3>
                        <p className="text-green-800 text-sm mb-3">
                          Participa en nuestro concurso anual con premios de hasta $5000 USD.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-green-600">Hace 5 días</span>
                          <Link
                            to="/announcements"
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            Leer más
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <Link
                    to="/progress"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
                  >
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Ver Progreso Detallado
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'certificates' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Certificados</h2>
                <div className="text-center py-12">
                  <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No tienes certificados aún
                  </h3>
                  <p className="text-gray-600">
                    Completa tus cursos para obtener certificados verificados
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Mi Perfil</h2>
                <div className="max-w-2xl">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center space-x-6 mb-6">
                      <img
                        src={auth.user?.avatar}
                        alt={auth.user?.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{auth.user?.name}</h3>
                        <p className="text-gray-600">{auth.user?.email}</p>
                        <p className="text-sm text-gray-500">
                          Miembro desde {new Date(auth.user?.joinedAt || '').toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Biografía
                        </label>
                        <p className="text-gray-600">
                          {auth.user?.bio || 'No has agregado una biografía aún.'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ubicación
                        </label>
                        <p className="text-gray-600">
                          {auth.user?.location || 'No especificada'}
                        </p>
                      </div>
                    </div>

                    <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Editar Perfil
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};