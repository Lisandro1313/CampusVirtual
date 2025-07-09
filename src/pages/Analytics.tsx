import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Clock, Award, Eye, Download, Calendar, Filter } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AnalyticsData {
  revenue: {
    total: number;
    monthly: number;
    growth: number;
    chartData: { month: string; amount: number }[];
  };
  students: {
    total: number;
    active: number;
    new: number;
    retention: number;
    chartData: { month: string; students: number }[];
  };
  courses: {
    total: number;
    published: number;
    avgRating: number;
    completionRate: number;
    topPerforming: { id: string; title: string; students: number; revenue: number; rating: number }[];
  };
  engagement: {
    totalViews: number;
    avgWatchTime: number;
    lessonCompletions: number;
    certificatesIssued: number;
  };
}

const mockAnalytics: AnalyticsData = {
  revenue: {
    total: 125430,
    monthly: 18750,
    growth: 23.5,
    chartData: [
      { month: 'Ene', amount: 12500 },
      { month: 'Feb', amount: 15200 },
      { month: 'Mar', amount: 18750 },
      { month: 'Abr', amount: 16800 },
      { month: 'May', amount: 21300 },
      { month: 'Jun', amount: 19500 }
    ]
  },
  students: {
    total: 2847,
    active: 1923,
    new: 234,
    retention: 87.3,
    chartData: [
      { month: 'Ene', students: 1850 },
      { month: 'Feb', students: 2100 },
      { month: 'Mar', students: 2350 },
      { month: 'Abr', students: 2580 },
      { month: 'May', students: 2720 },
      { month: 'Jun', students: 2847 }
    ]
  },
  courses: {
    total: 12,
    published: 10,
    avgRating: 4.7,
    completionRate: 78.5,
    topPerforming: [
      { id: '1', title: 'Desarrollo Web Full Stack', students: 1250, revenue: 89990, rating: 4.8 },
      { id: '2', title: 'Diseño UX/UI con Figma', students: 890, revenue: 62291, rating: 4.9 },
      { id: '3', title: 'Marketing Digital', students: 1450, revenue: 115855, rating: 4.7 }
    ]
  },
  engagement: {
    totalViews: 45230,
    avgWatchTime: 42.5,
    lessonCompletions: 8934,
    certificatesIssued: 567
  }
};

export const Analytics: React.FC = () => {
  const { auth } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [analytics] = useState<AnalyticsData>(mockAnalytics);

  const periods = [
    { value: '7days', label: 'Últimos 7 días' },
    { value: '30days', label: 'Últimos 30 días' },
    { value: '3months', label: 'Últimos 3 meses' },
    { value: '6months', label: 'Últimos 6 meses' },
    { value: '1year', label: 'Último año' }
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
    data: { month: string; amount?: number; students?: number }[];
    type: 'revenue' | 'students';
  }> = ({ data, type }) => {
    const maxValue = Math.max(...data.map(d => d.amount || d.students || 0));
    
    return (
      <div className="flex items-end space-x-2 h-32">
        {data.map((item, index) => {
          const value = type === 'revenue' ? item.amount : item.students;
          const height = ((value || 0) / maxValue) * 100;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className={`w-full ${type === 'revenue' ? 'bg-blue-500' : 'bg-green-500'} rounded-t transition-all duration-500 hover:opacity-80`}
                style={{ height: `${height}%` }}
              ></div>
              <span className="text-xs text-gray-600 mt-2">{item.month}</span>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analíticas</h1>
            <p className="text-gray-600">Panel de control con métricas detalladas de tu desempeño</p>
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
              Exportar
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Ingresos Totales"
            value={`$${analytics.revenue.total.toLocaleString()}`}
            change={analytics.revenue.growth}
            icon={<DollarSign className="h-6 w-6 text-green-600" />}
            color="bg-green-100"
            subtitle={`$${analytics.revenue.monthly.toLocaleString()} este mes`}
          />
          
          <StatCard
            title="Total Estudiantes"
            value={analytics.students.total.toLocaleString()}
            change={12.3}
            icon={<Users className="h-6 w-6 text-blue-600" />}
            color="bg-blue-100"
            subtitle={`${analytics.students.active} activos`}
          />
          
          <StatCard
            title="Cursos Publicados"
            value={analytics.courses.published}
            icon={<Award className="h-6 w-6 text-purple-600" />}
            color="bg-purple-100"
            subtitle={`${analytics.courses.total} en total`}
          />
          
          <StatCard
            title="Rating Promedio"
            value={analytics.courses.avgRating.toFixed(1)}
            change={5.2}
            icon={<BarChart3 className="h-6 w-6 text-orange-600" />}
            color="bg-orange-100"
            subtitle="De todas las reseñas"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Ingresos por Mes</h3>
              <div className="flex items-center space-x-2 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">+{analytics.revenue.growth}%</span>
              </div>
            </div>
            <SimpleChart data={analytics.revenue.chartData} type="revenue" />
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Tendencia positiva:</strong> Los ingresos han crecido consistentemente en los últimos meses.
              </p>
            </div>
          </div>

          {/* Students Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Crecimiento de Estudiantes</h3>
              <div className="flex items-center space-x-2 text-blue-600">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">{analytics.students.new} nuevos</span>
              </div>
            </div>
            <SimpleChart data={analytics.students.chartData} type="students" />
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Retención del {analytics.students.retention}%:</strong> Excelente tasa de retención de estudiantes.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Top Performing Courses */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Cursos con Mejor Rendimiento</h3>
            <div className="space-y-4">
              {analytics.courses.topPerforming.map((course, index) => (
                <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{course.title}</h4>
                      <p className="text-sm text-gray-600">{course.students} estudiantes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${course.revenue.toLocaleString()}</p>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-600">{course.rating}</span>
                      <span className="text-yellow-400">⭐</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Métricas de Engagement</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Total Visualizaciones</span>
                </div>
                <span className="font-semibold">{analytics.engagement.totalViews.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Tiempo Promedio</span>
                </div>
                <span className="font-semibold">{analytics.engagement.avgWatchTime} min</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">Lecciones Completadas</span>
                </div>
                <span className="font-semibold">{analytics.engagement.lessonCompletions.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-orange-600" />
                  <span className="text-gray-700">Certificados Emitidos</span>
                </div>
                <span className="font-semibold">{analytics.engagement.certificatesIssued}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Tasa de Finalización</h4>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${analytics.courses.completionRate}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{analytics.courses.completionRate}% de los estudiantes completan los cursos</p>
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Insights y Recomendaciones</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-green-50 rounded-xl border border-green-200">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="font-semibold text-green-900 mb-2">Crecimiento Sostenido</h4>
              <p className="text-sm text-green-800">
                Tus ingresos han crecido un 23.5% este mes. Considera crear más contenido similar a tus cursos más exitosos.
              </p>
            </div>

            <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Alta Retención</h4>
              <p className="text-sm text-blue-800">
                Con un 87.3% de retención, tus estudiantes están muy comprometidos. Mantén la calidad del contenido.
              </p>
            </div>

            <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="font-semibold text-purple-900 mb-2">Excelente Rating</h4>
              <p className="text-sm text-purple-800">
                Tu rating promedio de 4.7 está por encima del promedio de la plataforma. ¡Sigue así!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};