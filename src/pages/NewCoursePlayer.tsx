import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle, Clock, FileText, Pizza as Quiz, ChevronRight, ChevronDown, Lock, CreditCard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { allCourses } from '../data/mockData';
import { PaymentModal } from '../components/payment/PaymentModal';
import { PaymentSuccess } from '../components/payment/PaymentSuccess';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'text' | 'quiz';
  videoUrl?: string;
  description?: string;
  price?: number;
  is_free?: boolean;
  is_purchased?: boolean;
}

export const NewCoursePlayer: React.FC = () => {
  const { courseId } = useParams();
  const { auth } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (courseId) {
      // Use mock data instead of Supabase
      const foundCourse = allCourses.find(c => c.id === courseId);
      if (foundCourse) {
        setCourse(foundCourse);
        // Convert curriculum to lessons format
        const mockLessons = foundCourse.curriculum.map((lesson, index) => ({
          ...lesson,
          price: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 10 : 0,
          is_free: Math.random() > 0.7,
          is_purchased: Math.random() > 0.5,
          duration_minutes: parseInt(lesson.duration.split(' ')[0]) || 45
        }));
        setLessons(mockLessons);
        if (mockLessons.length > 0) {
          setCurrentLessonId(mockLessons[0].id);
        }
      }
      setLoading(false);
    }
  }, [courseId]);

  const currentLesson = lessons.find(l => l.id === currentLessonId);
  const completedLessons = lessons.filter(l => Math.random() > 0.6).length; // Mock completed lessons
  const progressPercentage = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

  const handlePurchaseLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    // Mock payment success
    setShowSuccessModal(true);
    // Update lesson as purchased
    if (selectedLesson) {
      setLessons(prev => prev.map(lesson => 
        lesson.id === selectedLesson.id 
          ? { ...lesson, is_purchased: true }
          : lesson
      ));
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    // Mock lesson completion
    console.log(`Lesson ${lessonId} marked as complete`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Curso no encontrado</h2>
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-500">
            Volver al dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden`}>
        <div className="p-6 border-b border-gray-200">
          <Link
            to="/dashboard"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Link>
          
          <h1 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h1>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progreso del curso</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {completedLessons} de {lessons.length} lecciones completadas
            </p>
          </div>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Contenido del Curso</h3>
            <div className="space-y-2">
              {lessons.map((lesson, index) => {
                const isCompleted = lesson.progress?.completed;
                const isCurrent = lesson.id === currentLessonId;
                const isPurchased = lesson.is_purchased;
                
                return (
                  <div key={lesson.id} className="relative">
                    <button
                      onClick={() => setCurrentLessonId(lesson.id)}
                      disabled={!isPurchased}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        isCurrent
                          ? 'bg-blue-50 border-2 border-blue-200'
                          : isPurchased
                          ? 'hover:bg-gray-50 border-2 border-transparent'
                          : 'bg-gray-100 border-2 border-transparent opacity-75'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {!isPurchased ? (
                            <Lock className="h-5 w-5 text-gray-400" />
                          ) : Math.random() > 0.7 ? ( // Mock completion status
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : lesson.type === 'video' ? (
                            <Play className="h-5 w-5 text-gray-400" />
                          ) : lesson.type === 'quiz' ? (
                            <Quiz className="h-5 w-5 text-gray-400" />
                          ) : (
                            <FileText className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${isCurrent ? 'text-blue-900' : 'text-gray-900'}`}>
                            {index + 1}. {lesson.title}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{lesson.duration}</span>
                            </div>
                            {lesson.price && lesson.price > 0 && (
                              <span className={`text-xs font-semibold ${isPurchased ? 'text-green-600' : 'text-blue-600'}`}>
                                {isPurchased ? 'Comprado' : `$${lesson.price}`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                    
                    {!isPurchased && lesson.price && lesson.price > 0 && (
                      <button
                        onClick={() => handlePurchaseLesson(lesson)}
                        className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded text-xs flex items-center"
                      >
                        <CreditCard className="h-3 w-3 mr-1" />
                        Comprar
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
            
            <div className="flex-1 mx-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {currentLesson?.title}
              </h2>
              {currentLesson?.price && currentLesson.price > 0 && !currentLesson?.is_purchased && (
                <p className="text-sm text-orange-600 mt-1">
                  Esta lección requiere compra individual - ${currentLesson?.price}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {currentLesson?.is_purchased && Math.random() > 0.7 && ( // Mock completion check
                <button
                  onClick={() => markLessonComplete(currentLessonId)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marcar como Completada
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-black">
          {currentLesson?.is_purchased ? (
            currentLesson?.type === 'video' ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-full max-w-4xl aspect-video">
                  <iframe
                    src={currentLesson.videoUrl}
                    title={currentLesson.title}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="bg-white rounded-xl p-8 max-w-2xl w-full">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {currentLesson.title}
                  </h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      {currentLesson.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center p-8">
              <div className="bg-white rounded-xl p-8 max-w-2xl w-full text-center">
                <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Contenido Bloqueado
                </h3>
                <p className="text-gray-600 mb-6">
                  Esta lección requiere compra individual para acceder al contenido.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">{currentLesson?.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{currentLesson?.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Duración: {currentLesson?.duration}
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${currentLesson?.price}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => currentLesson && handlePurchaseLesson(currentLesson)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center mx-auto"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Comprar esta Lección
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                const currentIndex = lessons.findIndex(l => l.id === currentLessonId);
                if (currentIndex > 0) {
                  setCurrentLessonId(lessons[currentIndex - 1].id);
                }
              }}
              disabled={lessons.findIndex(l => l.id === currentLessonId) === 0}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Lección Anterior
            </button>

            <button
              onClick={() => {
                const currentIndex = lessons.findIndex(l => l.id === currentLessonId);
                if (currentIndex < lessons.length - 1) {
                  setCurrentLessonId(lessons[currentIndex + 1].id);
                }
              }}
              disabled={lessons.findIndex(l => l.id === currentLessonId) === lessons.length - 1}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente Lección
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedLesson && (
        <PaymentModal
          lesson={{
            id: selectedLesson.id,
            title: selectedLesson.title,
            description: selectedLesson.description,
            duration_minutes: parseInt(selectedLesson.duration.split(' ')[0]) || 45,
            price: selectedLesson.price || 0
          }}
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedLesson(null);
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && selectedLesson && (
        <PaymentSuccess
          lessonTitle={selectedLesson.title}
          onContinue={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
};