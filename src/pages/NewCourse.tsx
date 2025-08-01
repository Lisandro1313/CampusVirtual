import React, { useState } from 'react';
import { Plus, X, Upload, Save, Eye, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { courseService } from '../services/courseService';

import { Course, Lesson } from '../lib/supabase';

export const NewCourse: React.FC = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  
  const [courseData, setCourseData] = useState({
    title: '',
    short_description: '',
    description: '',
    category: 'Pedagogía',
    level: 'beginner',
    price: 0,
    tags: [],
    image_url: 'https://images.pexels.com/photos/8197530/pexels-photo-8197530.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    featured: false
  });

  const [lessons, setLessons] = useState<Omit<Lesson, 'id' | 'course_id' | 'created_at' | 'updated_at'>[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    duration_minutes: 0,
    content_type: 'video' as const,
    video_url: '',
    file_url: '',
    order_index: 0,
    is_free: false
  });
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Pedagogía', 'Tecnología Educativa', 'Gestión Educativa', 'Didáctica', 
    'Evaluación', 'Psicología Educativa', 'Metodología', 'Inclusión Educativa'
  ];

  const addTag = () => {
    if (newTag.trim() && !courseData.tags.includes(newTag.trim())) {
      setCourseData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setCourseData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addLesson = () => {
    if (newLesson.title.trim()) {
      setLessons(prev => [...prev, {
        ...newLesson,
        order_index: prev.length
      }]);
      setNewLesson({
        title: '',
        description: '',
        duration_minutes: 0,
        content_type: 'video',
        video_url: '',
        file_url: '',
        order_index: 0,
        is_free: false
      });
      setShowLessonForm(false);
    }
  };

  const removeLesson = (index: number) => {
    setLessons(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create course
      const newCourse = await courseService.createCourse({
        ...courseData,
        instructor_id: auth.profile?.id || 'teacher-1'
      });

      // Create lessons
      for (const lessonData of lessons) {
        await courseService.createLesson({
          ...lessonData,
          course_id: newCourse.id
        });
      }

      setIsSubmitting(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error al crear el curso. Intenta nuevamente.');
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    // Store preview data temporarily
    localStorage.setItem('course-preview', JSON.stringify(courseData));
    window.open('/course/preview', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              to="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Curso</h1>
            <p className="text-gray-600">Comparte tu conocimiento con el mundo</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handlePreview}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Eye className="h-4 w-4 mr-2" />
              Vista Previa
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Básica</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Curso *
                </label>
                <input
                  type="text"
                  required
                  value={courseData.title}
                  onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Desarrollo Web Full Stack con React"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción Corta *
                </label>
                <input
                  type="text"
                  required
                  value={courseData.short_description}
                  onChange={(e) => setCourseData(prev => ({ ...prev, short_description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descripción breve que aparecerá en las tarjetas del curso"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción Completa *
                </label>
                <textarea
                  required
                  rows={5}
                  value={courseData.description}
                  onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descripción detallada del curso, objetivos de aprendizaje, requisitos previos..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  required
                  value={courseData.category}
                  onChange={(e) => setCourseData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel *
                </label>
                <select
                  required
                  value={courseData.level}
                  onChange={(e) => setCourseData(prev => ({ ...prev, level: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio (USD) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={courseData.price}
                  onChange={(e) => setCourseData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="15000"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiquetas
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {courseData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Agregar etiqueta"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Contenido del Curso</h2>
              <button
                type="button"
                onClick={() => setShowLessonForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Lección
              </button>
            </div>

            {/* Lessons List */}
            <div className="space-y-4 mb-6">
              {lessons.map((lesson, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {index + 1}. {lesson.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">{lesson.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Tipo: {lesson.content_type === 'video' ? 'Video' : lesson.content_type === 'pdf' ? 'PDF' : 'Enlace'}</span>
                        <span>Duración: {lesson.duration_minutes} min</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLesson(index)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Lesson Form */}
            {showLessonForm && (
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nueva Lección</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título de la Lección
                    </label>
                    <input
                      type="text"
                      value={newLesson.title}
                      onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Introducción a React"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      rows={3}
                      value={newLesson.description}
                      onChange={(e) => setNewLesson(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descripción de la lección"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Contenido
                    </label>
                    <select
                      value={newLesson.content_type}
                      onChange={(e) => setNewLesson(prev => ({ ...prev, content_type: e.target.value as any }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="video">Video</option>
                      <option value="pdf">PDF</option>
                      <option value="link">Enlace</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duración (minutos)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newLesson.duration_minutes}
                      onChange={(e) => setNewLesson(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="45"
                    />
                  </div>

                  {newLesson.content_type === 'video' && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL del Video
                      </label>
                      <input
                        type="url"
                        value={newLesson.video_url}
                        onChange={(e) => setNewLesson(prev => ({ ...prev, video_url: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://youtube.com/embed/..."
                      />
                    </div>
                  )}

                  {(newLesson.content_type === 'pdf' || newLesson.content_type === 'link') && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {newLesson.content_type === 'pdf' ? 'URL del PDF' : 'URL del Enlace'}
                      </label>
                      <input
                        type="url"
                        value={newLesson.file_url}
                        onChange={(e) => setNewLesson(prev => ({ ...prev, file_url: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://..."
                      />
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newLesson.is_free}
                        onChange={(e) => setNewLesson(prev => ({ ...prev, is_free: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Lección gratuita (vista previa)</span>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={addLesson}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Agregar Lección
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLessonForm(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/dashboard"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || lessons.length === 0}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:transform-none flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creando Curso...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Crear Curso
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};