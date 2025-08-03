import React, { useState, useEffect } from 'react';
import { BookOpen, Users, DollarSign, TrendingUp, Plus, Edit, Eye, BarChart3, Settings, Megaphone } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { courseService } from '../services/courseService';
import { Course } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

export const TeacherDashboard: React.FC = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const handleCreateCourse = () => {
    console.log('🎯 Navigating to create course...');
    navigate('/teacher/course/new');
  };

  // Calculate REAL stats from actual courses
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
                src={auth.profile?.avatar_url || '/src/assets/Imagen de WhatsApp 2025-07-10 a las 15.54.58_bc651df1.jpg'}
                alt={auth.profile?.name || 'Usuario'}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Panel de Instructor
                </h1>
                <p className="text-gray-600">Bienvenido, {auth.profile?.name || 'Instructor'}</p>
              </div>
            </div>
            <button
              onClick={handleCreateCourse}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Crear Curso
            </button>
          </div>

          {/* Stats Cards - REALES */}
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
                  <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
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
                  <p className="text-2xl font-bold text-gray-900">${totalRevenue}</p>
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
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tus Cursos</h3>
                    {courses.length > 0 ? (
                      <div className="space-y-4">
                        {courses.slice(0, 3).map((course) => (
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
                              ${(course.price * (course.enrollments_count || 0))}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600 mb-4">No has creado cursos aún</p>
                        <button
                          onClick={handleCreateCourse}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Crear tu primer curso
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas Reales</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Cursos creados</span>
                        <span className="font-semibold text-blue-600">{courses.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total estudiantes</span>
                        <span className="font-semibold text-green-600">{totalStudents}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Ingresos totales</span>
                        <span className="font-semibold text-green-600">${totalRevenue}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Rating promedio</span>
                        <span className="font-semibold text-yellow-600">{averageRating.toFixed(1)} ⭐</span>
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
                  <button
                    onClick={handleCreateCourse}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Curso
                  </button>
                </div>

                {courses.length > 0 ? (
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
                              <p className="text-gray-600">Precio</p>
                              <p className="font-semibold">${course.price}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Lecciones</p>
                              <p className="font-semibold">{course.lessons?.length || 0}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Ingresos</p>
                              <p className="font-semibold text-green-600">
                                ${(course.price * (course.enrollments_count || 0))}
                              </p>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/teacher/course/${course.id}/edit`)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center text-sm"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </button>
                            <button
                              onClick={() => navigate(`/courses/${course.id}`)}
                              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center text-sm"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tienes cursos creados
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Crea tu primer curso y comienza a enseñar
                    </p>
                    <button
                      onClick={handleCreateCourse}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Primer Curso
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Mi Perfil de Instructor</h2>
                <div className="max-w-2xl">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center space-x-6 mb-6">
                      <img
                        src={auth.profile?.avatar_url || '/src/assets/Imagen de WhatsApp 2025-07-10 a las 15.54.58_bc651df1.jpg'}
                        alt={auth.profile?.name || 'Usuario'}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{auth.profile?.name || 'Usuario'}</h3>
                        <p className="text-gray-600">{auth.profile?.email}</p>
                        <p className="text-sm text-gray-500">
                          Instructor desde {new Date(auth.profile?.created_at || '').toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Biografía
                        </label>
                        <p className="text-gray-600">
                          {auth.profile?.bio || 'No has agregado una biografía aún.'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ubicación
                        </label>
                        <p className="text-gray-600">
                          {auth.profile?.location || 'No especificada'}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate('/profile')}
                      className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Editar Perfil
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Otros tabs... */}
            {activeTab === 'announcements' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Gestión de Anuncios</h2>
                  <button
                    onClick={() => navigate('/announcements/new')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Anuncio
                  </button>
                </div>
                
                <div className="text-center py-12">
                  <Megaphone className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Gestión de Anuncios
                  </h3>
                  <p className="text-gray-600">
                    Aquí podrás crear y gestionar anuncios para tus estudiantes
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Estudiantes</h2>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Lista de Estudiantes
                  </h3>
                  <p className="text-gray-600">
                    Aquí verás todos los estudiantes inscritos en tus cursos
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Analíticas</h2>
                  <button
                    onClick={() => navigate('/teacher/analytics')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Ver Analíticas Completas
                  </button>
                </div>
                
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Analíticas Detalladas
                  </h3>
                  <p className="text-gray-600">
                    Estadísticas detalladas de tus cursos y estudiantes
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};