import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Star, Clock, Users, Play, CheckCircle, Globe, 
  Award, Download, Heart, Share2, ShoppingCart 
} from 'lucide-react';
import { courseService } from '../services/courseService';
import { mercadoPagoService } from '../services/mercadoPagoService';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Course } from '../lib/supabase';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams();
  const { addToCart, isInCart } = useCart();
  const { auth } = useAuth();
  const [favorites, setFavorites] = useLocalStorage<string[]>('course-favorites', []);
  const [activeTab, setActiveTab] = useState('overview');
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  React.useEffect(() => {
    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const courseData = await courseService.getCourse(courseId!);
      setCourse(courseData);
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollment = async () => {
    if (!auth.isAuthenticated || !course) return;
    
    setEnrolling(true);
    try {
      // Simulate MercadoPago payment
      const confirmed = confirm(`¿Confirmar pago de $${course.price} por MercadoPago?\n\n(Esto es una simulación)`);
      
      if (confirmed) {
        // Enroll user in course
        await courseService.enrollInCourse(course.id, auth.user?.id || auth.profile?.id || '');
        alert('¡Pago exitoso! Ya estás inscrito en el curso.');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error processing enrollment:', error);
      alert('Error al procesar la inscripción. Intenta nuevamente.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Curso no encontrado</h2>
          <Link to="/courses" className="text-blue-600 hover:text-blue-500">
            Volver a cursos
          </Link>
        </div>
      </div>
    );
  }

  const toggleFavorite = () => {
    setFavorites(prev => 
      prev.includes(course.id) 
        ? prev.filter(id => id !== course.id)
        : [...prev, course.id]
    );
  };

  const isFavorite = favorites.includes(course.id);
  const inCart = isInCart(course.id);

  const tabs = [
    { id: 'overview', label: 'Descripción' },
    { id: 'curriculum', label: 'Contenido' },
    { id: 'instructor', label: 'Instructor' },
    { id: 'reviews', label: 'Reseñas' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/courses"
            className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a cursos
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {course.category}
                </span>
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {course.level === 'beginner' ? 'Principiante' :
                   course.level === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-blue-100 mb-6">{course.shortDescription}</p>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-blue-200">({course.enrollments_count || 0} estudiantes)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-5 w-5 text-blue-200" />
                  <span>8 semanas</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Play className="h-5 w-5 text-blue-200" />
                  <span>{course.lessons?.length || 0} lecciones</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={course.instructor?.avatar_url || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'}
                  alt={course.instructor?.name || 'Instructor'}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">Creado por {course.instructor?.name || 'Norma Skuletich'}</p>
                  <p className="text-blue-200 text-sm">Instructor experto</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Course Preview */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-40 transition-all">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <Play className="h-6 w-6 text-blue-600 ml-1" />
                    </div>
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold text-blue-600">
                        ${course.price.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={toggleFavorite}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Heart className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                    </button>
                  </div>

                  <div className="space-y-3 mb-6">
                    <button
                      onClick={handleEnrollment}
                      disabled={enrolling || !auth.isAuthenticated}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                        !auth.isAuthenticated
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : enrolling
                          ? 'bg-blue-400 text-white cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
                      }`}
                    >
                      {!auth.isAuthenticated ? (
                        'Inicia sesión para inscribirte'
                      ) : enrolling ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline mr-2"></div>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-5 w-5 inline mr-2" />
                          Inscribirse al Curso
                        </>
                      )}
                    </button>

                    {auth.isAuthenticated && (
                      <Link
                        to={`/course/${course.id}/learn`}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Vista previa gratuita
                      </Link>
                    )}
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Acceso de por vida</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-green-600" />
                      <span>Certificado de finalización</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Download className="h-4 w-4 text-green-600" />
                      <span>Recursos descargables</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-green-600" />
                      <span>Acceso desde cualquier dispositivo</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button className="w-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartir este curso
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="prose max-w-none">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Descripción del curso</h3>
                <p className="text-gray-700 leading-relaxed mb-6">{course.description}</p>
                
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Lo que aprenderás</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {[
                    'Fundamentos sólidos de la tecnología',
                    'Proyectos prácticos del mundo real',
                    'Mejores prácticas de la industria',
                    'Técnicas avanzadas y optimización',
                    'Preparación para certificaciones',
                    'Networking y oportunidades laborales'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="text-xl font-semibold text-gray-900 mb-4">Requisitos</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Conocimientos básicos de computación</li>
                  <li>• Ganas de aprender y dedicar tiempo al estudio</li>
                  <li>• Acceso a una computadora con internet</li>
                </ul>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contenido del curso</h3>
                <div className="space-y-4">
                  {(course.lessons || []).map((lesson, index) => (
                    <div key={lesson.id} className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                            <p className="text-gray-600 text-sm">{lesson.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">{lesson.duration_minutes} min</span>
                          {lesson.content_type === 'video' ? (
                            <Play className="h-4 w-4 text-gray-400" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'instructor' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Sobre el instructor</h3>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-start space-x-6">
                    <img
                      src={course.instructor?.avatar_url || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'}
                      alt={course.instructor?.name || 'Instructor'}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">{course.instructor?.name || 'Norma Skuletich'}</h4>
                      <p className="text-gray-600 mb-4">
                        {course.instructor?.bio || 'Magister en Educación con más de 15 años de experiencia en formación docente y gestión educativa.'}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">4.8</div>
                          <div className="text-sm text-gray-600">Rating</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">15,420</div>
                          <div className="text-sm text-gray-600">Docentes formados</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">25</div>
                          <div className="text-sm text-gray-600">Cursos</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">15</div>
                          <div className="text-sm text-gray-600">Años exp.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Reseñas de estudiantes</h3>
                <div className="space-y-6">
                  {[
                    {
                      name: 'María González',
                      avatar: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
                      rating: 5,
                      comment: 'Excelente curso, muy completo y bien explicado. Los proyectos prácticos me ayudaron mucho.',
                      date: '2 semanas'
                    },
                    {
                      name: 'Carlos Mendoza',
                      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
                      rating: 5,
                      comment: 'El instructor explica de manera muy clara. Recomiendo este curso a cualquiera.',
                      date: '1 mes'
                    },
                    {
                      name: 'Ana Rodríguez',
                      avatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
                      rating: 4,
                      comment: 'Muy buen contenido, aunque me hubiera gustado más ejemplos prácticos.',
                      date: '3 semanas'
                    }
                  ].map((review, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-start space-x-4">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{review.name}</h4>
                            <span className="text-sm text-gray-500">Hace {review.date}</span>
                          </div>
                          <div className="flex items-center space-x-1 mb-3">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-8">
              <h4 className="font-semibold text-gray-900 mb-4">Cursos relacionados</h4>
              <div className="space-y-4">
                {/* Related courses would be loaded here */}
                <p className="text-sm text-gray-500 text-center py-4">
                  Cursos relacionados se mostrarán aquí
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};