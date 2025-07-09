import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Star, Clock, Users, Play, CheckCircle, Globe, 
  Award, Download, Heart, Share2, ShoppingCart 
} from 'lucide-react';
import { allCourses } from '../data/mockData';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams();
  const { addToCart, isInCart } = useCart();
  const { auth } = useAuth();
  const [favorites, setFavorites] = useLocalStorage<string[]>('course-favorites', []);
  const [activeTab, setActiveTab] = useState('overview');

  const course = allCourses.find(c => c.id === courseId);

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
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-blue-200">({course.students} estudiantes)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-5 w-5 text-blue-200" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Play className="h-5 w-5 text-blue-200" />
                  <span>{course.lessons} lecciones</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={course.instructorAvatar}
                  alt={course.instructor}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">Creado por {course.instructor}</p>
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
                      {course.originalPrice && (
                        <span className="text-gray-400 text-lg line-through mr-2">
                          ${course.originalPrice}
                        </span>
                      )}
                      <span className="text-3xl font-bold text-blue-600">
                        ${course.price}
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
                      onClick={() => addToCart(course.id)}
                      disabled={inCart}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                        inCart
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
                      }`}
                    >
                      {inCart ? (
                        <>
                          <CheckCircle className="h-5 w-5 inline mr-2" />
                          En el carrito
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-5 w-5 inline mr-2" />
                          Agregar al carrito
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
                  {course.curriculum.map((lesson, index) => (
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
                          <span className="text-sm text-gray-500">{lesson.duration}</span>
                          {lesson.type === 'video' ? (
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
                      src={course.instructorAvatar}
                      alt={course.instructor}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">{course.instructor}</h4>
                      <p className="text-gray-600 mb-4">
                        Experto en {course.category} con más de 8 años de experiencia en la industria. 
                        Ha trabajado con empresas líderes y ha ayudado a miles de estudiantes a 
                        alcanzar sus objetivos profesionales.
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">4.8</div>
                          <div className="text-sm text-gray-600">Rating</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">15,420</div>
                          <div className="text-sm text-gray-600">Estudiantes</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">12</div>
                          <div className="text-sm text-gray-600">Cursos</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">8</div>
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
                {allCourses
                  .filter(c => c.id !== course.id && c.category === course.category)
                  .slice(0, 3)
                  .map((relatedCourse) => (
                    <Link
                      key={relatedCourse.id}
                      to={`/courses/${relatedCourse.id}`}
                      className="block hover:bg-gray-50 rounded-lg p-3 transition-colors"
                    >
                      <div className="flex space-x-3">
                        <img
                          src={relatedCourse.image}
                          alt={relatedCourse.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 text-sm line-clamp-2">
                            {relatedCourse.title}
                          </h5>
                          <p className="text-sm text-gray-600">{relatedCourse.instructor}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600">{relatedCourse.rating}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};