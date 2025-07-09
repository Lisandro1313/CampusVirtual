import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Clock, Award, Eye, Download, Calendar, Star, BookOpen, Target } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { allCourses } from '../data/mockData';

interface DetailedAnalytics {
  overview: {
    totalRevenue: number;
    monthlyRevenue: number;
    totalStudents: number;
    activeStudents: number;
    avgRating: number;
    totalCourses: number;
  };
  coursePerformance: {
    id: string;
    title: string;
    students: number;
    revenue: number;
    rating: number;
    completionRate: number;
    avgWatchTime: number;
    reviews: number;
    monthlyGrowth: number;
  }[];
  studentEngagement: {
    totalViews: number;
    avgSessionTime: number;
    returnRate: number;
    completionRate: number;
    certificatesIssued: number;
  };
  revenueBreakdown: {
    month: string;
    revenue: number;
    students: number;
  }[];
  topLessons: {
    id: string;
    title: string;
    course: string;
    views: number;
    avgRating: number;
    completionRate: number;
  }[];
}

const mockDetailedAnalytics: DetailedAnalytics = {
  overview: {
    totalRevenue: 125430,
    monthlyRevenue: 18750,
    totalStudents: 2847,
    activeStudents: 1923,
    avgRating: 4.7,
    totalCourses: 12
  },
  coursePerformance: [
    {
      id: '1',
      title: 'Desarrollo Web Full Stack con React y Node.js',
      students: 1250,
      revenue: 89990,
      rating: 4.8,
      completionRate: 78.5,
      avgWatchTime: 42.3,
      reviews: 234,
      monthlyGrowth: 15.2
    },
    {
      id: '2',
      title: 'Diseño UX/UI Profesional con Figma',
      students: 890,
      revenue: 62291,
      rating: 4.9,
      completionRate: 85.2,
      avgWatchTime: 38.7,
      reviews: 178,
      monthlyGrowth: 23.1
    },
    {
      id: '3',
      title: 'Marketing Digital y Redes Sociales',
      students: 1450,
      revenue: 115855,
      rating: 4.7,
      completionRate: 72.8,
      avgWatchTime: 35.9,
      reviews: 289,
      monthlyGrowth: 8.7
    }
  ],
  studentEngagement: {
    totalViews: 45230,
    avgSessionTime: 28.5,
    returnRate: 87.3,
    completionRate: 78.9,
    certificatesIssued: 567
  },
  revenueBreakdown: [
    { month: 'Ene', revenue: 12500, students: 180 },
    { month: 'Feb', revenue: 15200, students: 220 },
    { month: 'Mar', revenue: 18750, students: 275 },
    { month: 'Abr', revenue: 16800, students: 245 },
    { month: 'May', revenue: 21300, students: 310 },
    { month: 'Jun', revenue: 19500, students: 285 }
  ],
  topLessons: [
    {
      id: '1',
      title: 'Introducción a React Hooks',
      course: 'Desarrollo Web Full Stack',
      views: 3420,
      avgRating: 4.9,
      completionRate: 92.1
    },
    {
      id: '2',
      title: 'Principios de Diseño UX',
      course: 'Diseño UX/UI Profesional',
      views: 2890,
      avgRating: 4.8,
      completionRate: 89.5
    },
    {
      id: '3',
      title: 'Estrategias de SEO Avanzado',
      course: 'Marketing Digital',
      views: 2650,
      avgRating: 4.7,
      completionRate: 85.3
    }
  ]
};

export const TeacherAnalytics: React.FC = () => {
  const { auth } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [analytics] = useState<DetailedAnalytics>(mockDetailedAnalytics);

  const periods = [
    { value: '7days', label: 'Últimos 7 días' },
    { value: '30days', label: 'Últimos 30 días' },
    { value: '3months', label: 'Últimos 3 meses' },
    { value: '6months', label: 'Últimos 6 meses' },
    { value: '1year', label: 'Último año' }
  ];

  const metrics = [
    { value: 'revenue', label: 'Ingresos', icon: DollarSign, color: 'text-green-600' },
    { value: 'students', label: 'Estudiantes', icon: Users, color: 'text-blue-600' },
    { value: 'engagement', label: 'Engagement', icon: Eye, color: 'text-purple-600' },
    { value: 'ratings', label: 'Calificaciones', icon: Star, color: 'text-yellow-600' }
  ];

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }> = ({ title, value, change, icon, color, subtitle }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`h-4 w-4 ${change < 0 ? 'rotate-180' : ''}`} />
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-gray-600 text-sm">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  const SimpleChart: React.FC<{
    data: { month: string; revenue?: number; students?: number }[];
    type: 'revenue' | 'students';
  }> = ({ data, type }) => {
    const maxValue = Math.max(...data.map(d => d.revenue || d.students || 0));
    
    return (
      <div className="flex items-end space-x-3 h-40">
        {data.map((item, index) => {
          const value = type === 'revenue' ? item.revenue : item.students;
          const height = ((value || 0) / maxValue) * 100;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="relative group">
                <div
                  className={`w-full ${type === 'revenue' ? 'bg-gradient-to-t from-green-500 to-green-400' : 'bg-gradient-to-t from-blue-500 to-blue-400'} rounded-t transition-all duration-500 hover:opacity-80 cursor-pointer`}
                  style={{ height: `${height}%`, minHeight: '4px' }}
                ></div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {type === 'revenue' ? `$${value?.toLocaleString()}` : `${value} estudiantes`}
                </div>
              </div>
              <span className="text-xs text-gray-600 mt-2 font-medium">{item.month}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analíticas Avanzadas</h1>
            <p className="text-gray-600">Análisis detallado del rendimiento de tus cursos y estudiantes</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Exportar Reporte
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Ingresos Totales"
            value={`$${analytics.overview.totalRevenue.toLocaleString()}`}
            change={23.5}
            icon={<DollarSign className="h-6 w-6 text-green-600" />}
            color="bg-green-100"
            subtitle={`$${analytics.overview.monthlyRevenue.toLocaleString()} este mes`}
          />
          
          <StatCard
            title="Total Estudiantes"
            value={analytics.overview.totalStudents.toLocaleString()}
            change={12.3}
            icon={<Users className="h-6 w-6 text-blue-600" />}
            color="bg-blue-100"
            subtitle={`${analytics.overview.activeStudents} activos`}
          />
          
          <StatCard
            title="Rating Promedio"
            value={analytics.overview.avgRating.toFixed(1)}
            change={5.2}
            icon={<Star className="h-6 w-6 text-yellow-600" />}
            color="bg-yellow-100"
            subtitle="De todas las reseñas"
          />
          
          <StatCard
            title="Cursos Publicados"
            value={analytics.overview.totalCourses}
            icon={<BookOpen className="h-6 w-6 text-purple-600" />}
            color="bg-purple-100"
            subtitle="Contenido disponible"
          />
        </div>

        {/* Metric Selector */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis por Métrica</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <button
                  key={metric.value}
                  onClick={() => setSelectedMetric(metric.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedMetric === metric.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${metric.color}`} />
                  <span className="text-sm font-medium">{metric.label}</span>
                </button>
              );
            })}
          </div>

          {selectedMetric === 'revenue' && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Evolución de Ingresos</h4>
              <SimpleChart data={analytics.revenueBreakdown} type="revenue" />
            </div>
          )}

          {selectedMetric === 'students' && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Crecimiento de Estudiantes</h4>
              <SimpleChart data={analytics.revenueBreakdown} type="students" />
            </div>
          )}

          {selectedMetric === 'engagement' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {analytics.studentEngagement.totalViews.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Visualizaciones</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {analytics.studentEngagement.avgSessionTime} min
                </div>
                <div className="text-sm text-gray-600">Tiempo Promedio</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {analytics.studentEngagement.returnRate}%
                </div>
                <div className="text-sm text-gray-600">Tasa de Retorno</div>
              </div>
            </div>
          )}

          {selectedMetric === 'ratings' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Distribución de Calificaciones</h4>
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 w-16">
                    <span className="text-sm font-medium">{stars}</span>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stars === 5 ? 65 : stars === 4 ? 25 : stars === 3 ? 8 : stars === 2 ? 2 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {stars === 5 ? '65%' : stars === 4 ? '25%' : stars === 3 ? '8%' : stars === 2 ? '2%' : '0%'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Course Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Rendimiento por Curso</h3>
            <div className="space-y-4">
              {analytics.coursePerformance.map((course, index) => (
                <div key={course.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 line-clamp-1">{course.title}</h4>
                    <div className={`flex items-center space-x-1 ${course.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <TrendingUp className={`h-4 w-4 ${course.monthlyGrowth < 0 ? 'rotate-180' : ''}`} />
                      <span className="text-sm font-medium">{Math.abs(course.monthlyGrowth)}%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Estudiantes:</span>
                      <span className="font-semibold ml-1">{course.students.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Ingresos:</span>
                      <span className="font-semibold ml-1 text-green-600">${course.revenue.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-semibold ml-1">{course.rating} ⭐</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Finalización:</span>
                      <span className="font-semibold ml-1">{course.completionRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Lecciones Más Populares</h3>
            <div className="space-y-4">
              {analytics.topLessons.map((lesson, index) => (
                <div key={lesson.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 line-clamp-1">{lesson.title}</h4>
                    <p className="text-sm text-gray-600">{lesson.course}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{lesson.views.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">{lesson.avgRating} ⭐</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Engagement Insights */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Insights de Engagement</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <Eye className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-900 mb-1">
                {analytics.studentEngagement.totalViews.toLocaleString()}
              </div>
              <div className="text-sm text-blue-700">Visualizaciones Totales</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-900 mb-1">
                {analytics.studentEngagement.avgSessionTime} min
              </div>
              <div className="text-sm text-green-700">Tiempo Promedio</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-purple-900 mb-1">
                {analytics.studentEngagement.completionRate}%
              </div>
              <div className="text-sm text-purple-700">Tasa de Finalización</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <Award className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-orange-900 mb-1">
                {analytics.studentEngagement.certificatesIssued}
              </div>
              <div className="text-sm text-orange-700">Certificados Emitidos</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-green-50 rounded-xl border border-green-200">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="font-semibold text-green-900 mb-2">Excelente Retención</h4>
              <p className="text-sm text-green-800">
                Tu tasa de retorno del 87.3% está muy por encima del promedio de la industria (65%).
              </p>
            </div>

            <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Crecimiento Sostenido</h4>
              <p className="text-sm text-blue-800">
                El crecimiento mensual promedio del 15% indica una demanda constante por tu contenido.
              </p>
            </div>

            <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="font-semibold text-purple-900 mb-2">Alta Calidad</h4>
              <p className="text-sm text-purple-800">
                Tu rating promedio de 4.7 y alta tasa de finalización demuestran contenido de calidad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};