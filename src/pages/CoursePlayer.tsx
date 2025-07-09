import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle, Clock, FileText, Pizza as Quiz, ChevronRight, ChevronDown } from 'lucide-react';
import { allCourses, mockProgress } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';

export const CoursePlayer: React.FC = () => {
  const { courseId } = useParams();
  const { auth } = useAuth();
  const [currentLessonId, setCurrentLessonId] = useState('1');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const course = allCourses.find(c => c.id === courseId);
  const currentLesson = course?.curriculum.find(l => l.id === currentLessonId);
  
  // Get user progress for this course
  const userProgress = mockProgress.filter(p => 
    p.userId === auth.user?.id && p.courseId === courseId
  );

  const isLessonCompleted = (lessonId: string) => {
    return userProgress.some(p => p.lessonId === lessonId && p.completed);
  };

  const completedLessons = userProgress.filter(p => p.completed).length;
  const totalLessons = course?.curriculum.length || 0;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

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

  const markLessonComplete = (lessonId: string) => {
    // In a real app, this would make an API call
    console.log(`Marking lesson ${lessonId} as complete`);
  };

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
              {completedLessons} de {totalLessons} lecciones completadas
            </p>
          </div>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Contenido del Curso</h3>
            <div className="space-y-2">
              {course.curriculum.map((lesson, index) => {
                const isCompleted = isLessonCompleted(lesson.id);
                const isCurrent = lesson.id === currentLessonId;
                
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLessonId(lesson.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      isCurrent
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {isCompleted ? (
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
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{lesson.duration}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500 capitalize">{lesson.type}</span>
                        </div>
                      </div>
                    </div>
                  </button>
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
            </div>

            <div className="flex items-center space-x-4">
              {!isLessonCompleted(currentLessonId) && (
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
          {currentLesson?.type === 'video' ? (
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
          ) : currentLesson?.type === 'quiz' ? (
            <div className="w-full h-full flex items-center justify-center p-8">
              <div className="bg-white rounded-xl p-8 max-w-2xl w-full">
                <div className="text-center">
                  <Quiz className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {currentLesson.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {currentLesson.description}
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    Comenzar Ejercicio
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center p-8">
              <div className="bg-white rounded-xl p-8 max-w-4xl w-full">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {currentLesson?.title}
                </h3>
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {currentLesson?.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                const currentIndex = course.curriculum.findIndex(l => l.id === currentLessonId);
                if (currentIndex > 0) {
                  setCurrentLessonId(course.curriculum[currentIndex - 1].id);
                }
              }}
              disabled={course.curriculum.findIndex(l => l.id === currentLessonId) === 0}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Lección Anterior
            </button>

            <button
              onClick={() => {
                const currentIndex = course.curriculum.findIndex(l => l.id === currentLessonId);
                if (currentIndex < course.curriculum.length - 1) {
                  setCurrentLessonId(course.curriculum[currentIndex + 1].id);
                }
              }}
              disabled={course.curriculum.findIndex(l => l.id === currentLessonId) === course.curriculum.length - 1}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente Lección
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};