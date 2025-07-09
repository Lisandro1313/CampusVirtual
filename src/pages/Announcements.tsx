import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar, User, Eye, Heart, MessageCircle, Share2, Filter, Search, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  category: 'general' | 'academic' | 'events' | 'technical';
  priority: 'low' | 'medium' | 'high';
  likes: number;
  comments: number;
  views: number;
  isLiked?: boolean;
  image?: string;
}

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: '🎉 Nuevos cursos de Inteligencia Artificial disponibles',
    content: 'Estamos emocionados de anunciar el lanzamiento de nuestra nueva serie de cursos sobre IA y Machine Learning. Incluye proyectos prácticos con TensorFlow, PyTorch y más. Los primeros 100 estudiantes tendrán un 30% de descuento.',
    author: {
      name: 'María González',
      avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      role: 'Directora Académica'
    },
    publishedAt: '2024-01-15T10:00:00Z',
    category: 'academic',
    priority: 'high',
    likes: 127,
    comments: 23,
    views: 1250,
    isLiked: false,
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2'
  },
  {
    id: '2',
    title: '📅 Webinar gratuito: "El futuro del desarrollo web"',
    content: 'Únete a nuestro webinar exclusivo el próximo viernes 19 de enero a las 19:00 hs. Hablaremos sobre las tendencias más importantes en desarrollo web para 2024, incluyendo frameworks emergentes, herramientas de IA y mejores prácticas.',
    author: {
      name: 'Carlos Mendoza',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      role: 'Instructor Senior'
    },
    publishedAt: '2024-01-14T15:30:00Z',
    category: 'events',
    priority: 'medium',
    likes: 89,
    comments: 15,
    views: 890,
    isLiked: true
  },
  {
    id: '3',
    title: '🔧 Mantenimiento programado del sistema',
    content: 'Informamos que el próximo domingo 21 de enero realizaremos mantenimiento en nuestros servidores de 02:00 a 06:00 hs. Durante este período, la plataforma no estará disponible. Agradecemos su comprensión.',
    author: {
      name: 'Equipo Técnico',
      avatar: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      role: 'Administración'
    },
    publishedAt: '2024-01-13T09:15:00Z',
    category: 'technical',
    priority: 'medium',
    likes: 34,
    comments: 8,
    views: 567,
    isLiked: false
  },
  {
    id: '4',
    title: '🏆 Concurso de proyectos estudiantiles 2024',
    content: 'Lanzamos nuestro concurso anual de proyectos! Categorías: Desarrollo Web, Mobile, IA/ML, y Diseño UX/UI. Premios de hasta $5000 USD y mentorías personalizadas. Inscripciones abiertas hasta el 15 de febrero.',
    author: {
      name: 'Ana Rodríguez',
      avatar: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      role: 'Coordinadora de Eventos'
    },
    publishedAt: '2024-01-12T14:20:00Z',
    category: 'events',
    priority: 'high',
    likes: 203,
    comments: 45,
    views: 1890,
    isLiked: true,
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2'
  },
  {
    id: '5',
    title: '📚 Nueva biblioteca de recursos disponible',
    content: 'Hemos agregado más de 500 recursos nuevos a nuestra biblioteca digital: eBooks, templates, códigos de ejemplo, y herramientas exclusivas. Todos los estudiantes activos tienen acceso completo.',
    author: {
      name: 'Biblioteca Digital',
      avatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      role: 'Recursos Académicos'
    },
    publishedAt: '2024-01-11T11:45:00Z',
    category: 'academic',
    priority: 'low',
    likes: 76,
    comments: 12,
    views: 432,
    isLiked: false
  }
];

export const Announcements: React.FC = () => {
  const { auth } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'Todas las categorías', icon: Megaphone },
    { value: 'general', label: 'General', icon: Megaphone },
    { value: 'academic', label: 'Académico', icon: User },
    { value: 'events', label: 'Eventos', icon: Calendar },
    { value: 'technical', label: 'Técnico', icon: Filter }
  ];

  const priorities = [
    { value: 'all', label: 'Todas las prioridades' },
    { value: 'high', label: 'Alta prioridad' },
    { value: 'medium', label: 'Prioridad media' },
    { value: 'low', label: 'Prioridad baja' }
  ];

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || announcement.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || announcement.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const handleLike = (id: string) => {
    setAnnouncements(prev => prev.map(announcement => 
      announcement.id === id 
        ? { 
            ...announcement, 
            isLiked: !announcement.isLiked,
            likes: announcement.isLiked ? announcement.likes - 1 : announcement.likes + 1
          }
        : announcement
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'events': return 'bg-purple-100 text-purple-800';
      case 'technical': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    if (diffInHours < 48) return 'Hace 1 día';
    return `Hace ${Math.floor(diffInHours / 24)} días`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Megaphone className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Cartelera de Anuncios</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mantente al día con las últimas noticias, eventos y actualizaciones de Campus Lisandro
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar anuncios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3 mt-6">
            {categories.slice(1).map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
                    selectedCategory === category.value
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {filteredAnnouncements.length} de {announcements.length} anuncios
          </p>
        </div>

        {/* Announcements Grid */}
        <div className="space-y-6">
          {filteredAnnouncements.map((announcement) => (
            <div key={announcement.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              {announcement.image && (
                <img
                  src={announcement.image}
                  alt={announcement.title}
                  className="w-full h-64 object-cover"
                />
              )}
              
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={announcement.author.avatar}
                      alt={announcement.author.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{announcement.author.name}</h3>
                      <p className="text-sm text-gray-600">{announcement.author.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                      {announcement.priority === 'high' ? 'Alta' : 
                       announcement.priority === 'medium' ? 'Media' : 'Baja'} prioridad
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(announcement.category)}`}>
                      {announcement.category === 'academic' ? 'Académico' :
                       announcement.category === 'events' ? 'Eventos' :
                       announcement.category === 'technical' ? 'Técnico' : 'General'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {announcement.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {announcement.content}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleLike(announcement.id)}
                      className={`flex items-center space-x-2 transition-colors ${
                        announcement.isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${announcement.isLiked ? 'fill-current' : ''}`} />
                      <span className="font-medium">{announcement.likes}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <MessageCircle className="h-5 w-5" />
                      <span className="font-medium">{announcement.comments}</span>
                    </button>
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Eye className="h-5 w-5" />
                      <span className="font-medium">{announcement.views}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {formatDate(announcement.publishedAt)}
                    </span>
                    <button className="text-gray-600 hover:text-blue-600 transition-colors">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Megaphone className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron anuncios
            </h3>
            <p className="text-gray-600 mb-8">
              Intenta ajustar tus filtros de búsqueda
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedPriority('all');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        )}

        {/* Create Announcement Button for Teachers/Admins */}
        {(auth.user?.role === 'teacher' || auth.user?.role === 'admin') && (
          <div className="fixed bottom-8 right-8">
            <Link
              to="/announcements/new"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="h-6 w-6" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};