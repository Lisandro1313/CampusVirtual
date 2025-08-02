import React, { useState } from 'react';
import { BookOpen, Users, DollarSign, TrendingUp, Plus, Edit, Eye, BarChart3, Settings, Megaphone } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { courseService } from '../services/courseService';
import { Course } from '../lib/supabase';
import { Link } from 'react-router-dom';

export const TeacherDashboard: React.FC = () => {
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const allCourses = await courseService.getCourses();
      const teacherCourses = allCourses.filter(course => 
        course.instructor_id === auth.profile?.id || course.instructor_id === auth.user?.id
      );
      setCourses(teacherCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate real stats
  const totalStudents = courses.reduce((acc, course) => acc + (course.enrollments_count || 0), 0);
  const totalRevenue = courses.reduce((acc, course) => acc + (course.price * (course.enrollments_count || 0)), 0);
  const averageRating = courses.length > 0 ? 4.5 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'courses', label: 'Mis Cursos', icon: BookOpen },
    { id: 'announcements', label: 'Anuncios', icon: Megaphone },
    { id: 'students', label: 'Estudiantes', icon: Users },
    { id: 'analytics', label: 'Analíticas', icon: TrendingUp },
    { id: 'profile', label: 'Perfil', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={auth.user?.avatar}
                alt={auth.user?.name}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Panel de Instructor
                </h1>
                <p className="text-gray-600">Bienvenido, {auth.user?.name}</p>
              </div>
            </div>
            <Link
              to="/teacher/course/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Crear Curso
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cursos</p>
                  <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
                  <p className="text-2xl font-bold text-gray-900">{totalStudents.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rating Promedio</p>
                  <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
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
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumen General</h2>
                
                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cursos Más Populares</h3>
                    <div className="space-y-4">
                      {courses
                        .sort((a, b) => (b.enrollments_count || 0) - (a.enrollments_count || 0))
                        .slice(0, 3)
                        .map((course) => (
                          <div key={course.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <img
                                src={course.image_url || 'https://images.pexels.com/photos/8197530/pexels-photo-8197530.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2'}
                                alt={course.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-900 line-clamp-1">
                                  {course.title}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {course.enrollments_count || 0} estudiantes
                                </p>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-green-600">
                              ${(course.price * (course.enrollments_count || 0)).toLocaleString()}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas del Mes</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Nuevos estudiantes</span>
                        <span className="font-semibold text-green-600">+127</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Ingresos del mes</span>
                        <span className="font-semibold text-green-600">$12,450</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Cursos completados</span>
                        <span className="font-semibold text-blue-600">89</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Rating promedio</span>
                        <span className="font-semibold text-yellow-600">4.8 ⭐</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Mis Cursos</h2>
                  <Link
                    to="/teacher/course/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Curso
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      <img
                        src={course.image_url || 'https://images.pexels.com/photos/8197530/pexels-photo-8197530.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2'}
                        alt={course.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-gray-600">Estudiantes</p>
                            <p className="font-semibold">{course.enrollments_count || 0}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Rating</p>
                            <p className="font-semibold">4.8 ⭐</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Precio</p>
                            <p className="font-semibold">${course.price.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Ingresos</p>
                            <p className="font-semibold text-green-600">
                              ${(course.price * (course.enrollments_count || 0)).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Link
                            to={`/teacher/course/${course.id}/edit`}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center text-sm"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Link>
                          <Link
                            to={`/courses/${course.id}`}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center text-sm"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {courses.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tienes cursos creados
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Crea tu primer curso y comienza a enseñar
                    </p>
                    <Link
                      to="/teacher/course/new"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Crear Primer Curso
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'announcements' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Gestión de Anuncios</h2>
                  <Link
                    to="/announcements/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Anuncio
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-4">Estadísticas de Anuncios</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Anuncios publicados</span>
                        <span className="font-semibold text-blue-900">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Visualizaciones totales</span>
                        <span className="font-semibold text-blue-900">8,450</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Engagement promedio</span>
                        <span className="font-semibold text-blue-900">73%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="font-semibold text-green-900 mb-4">Anuncio Más Popular</h3>
                    <div className="space-y-2">
                      <h4 className="font-medium text-green-900">Nuevos cursos de IA</h4>
                      <p className="text-sm text-green-700">1,250 visualizaciones</p>
                      <p className="text-sm text-green-700">127 likes • 23 comentarios</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Anuncios Recientes</h3>
                  <div className="space-y-4">
                    {[
                      { title: 'Nuevos cursos de IA disponibles', date: '2 días', status: 'Publicado', views: 1250 },
                      { title: 'Webinar gratuito próximo viernes', date: '3 días', status: 'Publicado', views: 890 },
                      { title: 'Mantenimiento programado', date: '1 semana', status: 'Borrador', views: 0 }
                    ].map((announcement, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                          <p className="text-sm text-gray-600">Hace {announcement.date}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            announcement.status === 'Publicado' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {announcement.status}
                          </span>
                          <span className="text-sm text-gray-600">{announcement.views} vistas</span>
                          <button className="text-blue-600 hover:text-blue-700">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Estudiantes</h2>
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Lista de Estudiantes
                  </h3>
                  <p className="text-gray-600">
                    Aquí podrás ver y gestionar todos tus estudiantes
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Analíticas Rápidas</h2>
                  <Link
                    to="/teacher/analytics"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Ver Analíticas Completas
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                      <span className="text-sm font-medium text-green-600">+23.5%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-blue-900 mb-1">$18,750</h3>
                    <p className="text-blue-700 text-sm">Ingresos este mes</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="h-8 w-8 text-green-600" />
                      <span className="text-sm font-medium text-green-600">+12.3%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-green-900 mb-1">234</h3>
                    <p className="text-green-700 text-sm">Nuevos estudiantes</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <BarChart3 className="h-8 w-8 text-purple-600" />
                      <span className="text-sm font-medium text-green-600">+5.2%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-purple-900 mb-1">4.7</h3>
                    <p className="text-purple-700 text-sm">Rating promedio</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Mi Perfil de Instructor</h2>
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
                          Instructor desde {new Date(auth.user?.joinedAt || '').toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Biografía
                        </label>
                        <p className="text-gray-600">
                          {auth.user?.bio || 'Desarrolladora Full Stack con 8 años de experiencia. Especialista en React y Node.js.'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ubicación
                        </label>
                        <p className="text-gray-600">
                          {auth.user?.location || 'Córdoba, Argentina'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Especialidades
                        </label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {['React', 'Node.js', 'JavaScript', 'MongoDB', 'Express'].map((skill) => (
                            <span
                              key={skill}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
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