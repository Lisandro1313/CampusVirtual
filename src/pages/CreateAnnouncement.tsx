import React, { useState } from 'react';
import { ArrowLeft, Save, Eye, Send, Image, Calendar, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AnnouncementData {
  title: string;
  content: string;
  category: 'general' | 'academic' | 'events' | 'technical';
  priority: 'low' | 'medium' | 'high';
  publishNow: boolean;
  sendEmail: boolean;
  image?: string;
}

export const CreateAnnouncement: React.FC = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useLocalStorage('announcements', []);
  
  const [announcementData, setAnnouncementData] = useState<AnnouncementData>({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium',
    publishNow: true,
    sendEmail: false,
    image: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const categories = [
    { value: 'general', label: 'General', description: 'Anuncios generales para toda la comunidad' },
    { value: 'academic', label: 'Académico', description: 'Relacionado con cursos y contenido educativo' },
    { value: 'events', label: 'Eventos', description: 'Webinars, talleres y eventos especiales' },
    { value: 'technical', label: 'Técnico', description: 'Mantenimiento y actualizaciones del sistema' }
  ];

  const priorities = [
    { value: 'low', label: 'Baja', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'Alta', color: 'bg-red-100 text-red-800' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate announcement creation
    setTimeout(() => {
      const newAnnouncement = {
        id: Date.now().toString(),
        ...announcementData,
        author: {
          name: auth.user?.name || 'Instructor',
          avatar: auth.user?.avatar || '',
          role: auth.user?.role || 'teacher'
        },
        publishedAt: announcementData.publishNow ? new Date().toISOString() : null,
        likes: 0,
        comments: 0,
        views: 0,
        isLiked: false,
        createdAt: new Date().toISOString()
      };

      setAnnouncements((prev: any[]) => [newAnnouncement, ...prev]);
      setIsSubmitting(false);
      navigate('/announcements');
    }, 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a service like Cloudinary
      // For now, we'll use a placeholder
      setAnnouncementData(prev => ({
        ...prev,
        image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2'
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              to="/announcements"
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Anuncios
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Anuncio</h1>
            <p className="text-gray-600">Comparte información importante con tu comunidad</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Editar' : 'Vista Previa'}
            </button>
          </div>
        </div>

        {showPreview ? (
          /* Preview Mode */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {announcementData.image && (
              <img
                src={announcementData.image}
                alt={announcementData.title}
                className="w-full h-64 object-cover"
              />
            )}
            
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={auth.user?.avatar}
                    alt={auth.user?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{auth.user?.name}</h3>
                    <p className="text-sm text-gray-600">{auth.user?.role === 'teacher' ? 'Instructor' : 'Administrador'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    priorities.find(p => p.value === announcementData.priority)?.color
                  }`}>
                    Prioridad {priorities.find(p => p.value === announcementData.priority)?.label}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {categories.find(c => c.value === announcementData.category)?.label}
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {announcementData.title || 'Título del anuncio'}
              </h2>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {announcementData.content || 'Contenido del anuncio aparecerá aquí...'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
                <div className="flex items-center space-x-6">
                  <span className="text-gray-500 text-sm">0 likes</span>
                  <span className="text-gray-500 text-sm">0 comentarios</span>
                  <span className="text-gray-500 text-sm">0 visualizaciones</span>
                </div>
                <span className="text-sm text-gray-500">
                  {announcementData.publishNow ? 'Se publicará inmediatamente' : 'Guardado como borrador'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Básica</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título del Anuncio *
                  </label>
                  <input
                    type="text"
                    required
                    value={announcementData.title}
                    onChange={(e) => setAnnouncementData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Nuevos cursos disponibles"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenido *
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={announcementData.content}
                    onChange={(e) => setAnnouncementData(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Escribe el contenido de tu anuncio aquí..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      required
                      value={announcementData.category}
                      onChange={(e) => setAnnouncementData(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      {categories.find(c => c.value === announcementData.category)?.description}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridad *
                    </label>
                    <select
                      required
                      value={announcementData.priority}
                      onChange={(e) => setAnnouncementData(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>
                          Prioridad {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagen (Opcional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Haz clic para subir una imagen</p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG hasta 10MB</p>
                    </label>
                  </div>
                  {announcementData.image && (
                    <div className="mt-4">
                      <img
                        src={announcementData.image}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Publishing Options */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Opciones de Publicación</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Publicar inmediatamente</h3>
                      <p className="text-sm text-gray-600">El anuncio será visible para todos los usuarios</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={announcementData.publishNow}
                      onChange={(e) => setAnnouncementData(prev => ({ ...prev, publishNow: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Send className="h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Enviar por email</h3>
                      <p className="text-sm text-gray-600">Notificar a usuarios suscritos por correo electrónico</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={announcementData.sendEmail}
                      onChange={(e) => setAnnouncementData(prev => ({ ...prev, sendEmail: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>

              {announcementData.sendEmail && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Alcance estimado</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    Este anuncio se enviará por email a aproximadamente 2,847 usuarios suscritos.
                  </p>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4">
              <Link
                to="/announcements"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:transform-none flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {announcementData.publishNow ? 'Publicando...' : 'Guardando...'}
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    {announcementData.publishNow ? 'Publicar Anuncio' : 'Guardar Borrador'}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};