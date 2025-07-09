import React, { useState } from 'react';
import { BookOpen, Clock, Award, TrendingUp, Calendar, Target, CheckCircle, Play, BarChart3, Trophy } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { mockEnrollments, allCourses, mockProgress } from '../data/mockData';
import { Link } from 'react-router-dom';

interface WeeklyGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const mockWeeklyGoals: WeeklyGoal[] = [
  {
    id: '1',
    title: 'Lecciones Completadas',
    target: 10,
    current: 7,
    unit: 'lecciones',
    icon: <CheckCircle className="h-5 w-5" />,
    color: 'bg-green-500'
  },
  {
    id: '2',
    title: 'Horas de Estudio',
    target: 15,
    current: 12,
    unit: 'horas',
    icon: <Clock className="h-5 w-5" />,
    color: 'bg-blue-500'
  },
  {
    id: '3',
    title: 'Días Consecutivos',
    target: 7,
    current: 5,
    unit: 'días',
    icon: <Calendar className="h-5 w-5" />,
    color: 'bg-purple-500'
  }
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Primer Paso',
    description: 'Completaste tu primera lección',
    icon: <Play className="h-6 w-6" />,
    unlockedAt: '2024-01-20T10:00:00Z',
    rarity: 'common'
  },
  {
    id: '2',
    title: 'Estudiante Dedicado',
    description: 'Estudiaste 5 días consecutivos',
    icon: <Calendar className="h-6 w-6" />,
    unlockedAt: '2024-01-22T15:30:00Z',
    rarity: 'rare'
  },
  {
    id: '3',
    title: 'Maratón de Aprendizaje',
    description: 'Completaste 10 lecciones en un día',
    icon: <Trophy className="h-6 w-6" />,
    unlockedAt: '2024-01-25T20:45:00Z',
    rarity: 'epic'
  }
];

export const StudentProgress: React.FC = () => {
  const { auth } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Get enrolled courses with progress
  const enrolledCourses = mockEnrollments
    .filter(enrollment => enrollment.userId === auth.user?.id)
    .map(enrollment => {
      const course = allCourses.find(c => c.id === enrollment.courseId);
      const courseProgress = mockProgress.filter(p => 
        p.userId === auth.user?.id && p.courseId === enrollment.courseId
      );
      return { ...enrollment, course, lessons: courseProgress };
    })
    .filter(item => item.course);

  const totalLessons = enrolledCourses.reduce((acc, e) => acc + (e.course?.lessons || 0), 0);
  const completedLessons = enrolledCourses.reduce((acc, e) => acc + e.lessons.filter(l => l.completed).length, 0);
  const totalHours = completedLessons * 0.75; // Estimate 45min per lesson
  const averageProgress = enrolledCourses.reduce((acc, e) => acc + e.progress, 0) / enrolledCourses.length || 0;

  const periods = [
    { value: 'week', label: 'Esta semana' },
    { value: 'month', label: 'Este mes' },
    { value: 'quarter', label: 'Este trimestre' },
    { value: 'year', label: 'Este año' }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
    trend?: number;
  }> = ({ title, value, subtitle, icon, color, trend }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center space-x-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`h-4 w-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            <span className="text-sm font-medium">{Math.abs(trend)}%</span>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Progreso</h1>
            <p className="text-gray-600">Seguimiento detallado de tu aprendizaje y logros</p>
          </div>
          
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
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Lecciones Completadas"
            value={completedLessons}
            subtitle={`de ${totalLessons} totales`}
            icon={<CheckCircle className="h-6 w-6" />}
            color="bg-green-500"
            trend={15.3}
          />
          
          <StatCard
            title="Horas de Estudio"
            value={`${Math.round(totalHours)}h`}
            subtitle="tiempo total invertido"
            icon={<Clock className="h-6 w-6" />}
            color="bg-blue-500"
            trend={8.7}
          />
          
          <StatCard
            title="Progreso Promedio"
            value={`${Math.round(averageProgress)}%`}
            subtitle="en todos los cursos"
            icon={<BarChart3 className="h-6 w-6" />}
            color="bg-purple-500"
            trend={12.1}
          />
          
          <StatCard
            title="Cursos Activos"
            value={enrolledCourses.length}
            subtitle="en progreso"
            icon={<BookOpen className="h-6 w-6" />}
            color="bg-orange-500"
          />
        </div>

        {/* Weekly Goals */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Objetivos de la Semana</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockWeeklyGoals.map((goal) => (
              <div key={goal.id} className="p-6 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 ${goal.color} rounded-lg flex items-center justify-center text-white`}>
                    {goal.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-3">{goal.title}</h4>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className={`${goal.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                  ></div>
                </div>
                
                <p className="text-sm text-gray-600">
                  {goal.current >= goal.target ? '¡Objetivo completado!' : 
                   `Faltan ${goal.target - goal.current} ${goal.unit}`}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Course Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Progreso por Curso</h3>
            <div className="space-y-6">
              {enrolledCourses.map((enrollment) => (
                <div key={enrollment.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={enrollment.course?.image}
                      alt={enrollment.course?.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 line-clamp-1">
                        {enrollment.course?.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Por {enrollment.course?.instructor}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progreso</span>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {enrollment.lessons.filter(l => l.completed).length} de {enrollment.course?.lessons} lecciones
                    </span>
                    <Link
                      to={`/course/${enrollment.courseId}/learn`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Continuar →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Logros Recientes</h3>
            <div className="space-y-4">
              {mockAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-white">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity === 'common' ? 'Común' :
                         achievement.rarity === 'rare' ? 'Raro' :
                         achievement.rarity === 'epic' ? 'Épico' : 'Legendario'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{achievement.description}</p>
                    <p className="text-xs text-gray-500">
                      Desbloqueado {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl text-center">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">¡Sigue así!</h4>
              <p className="text-sm text-gray-600">
                Has desbloqueado {mockAchievements.length} logros. Continúa aprendiendo para obtener más.
              </p>
            </div>
          </div>
        </div>

        {/* Learning Streak */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Racha de Aprendizaje</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">5</span>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-1">Días consecutivos</h4>
                <p className="text-gray-600">¡Tu mejor racha hasta ahora!</p>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4">
                <h5 className="font-semibold text-gray-900 mb-2">Mantén tu racha</h5>
                <p className="text-sm text-gray-600 mb-3">
                  Completa al menos una lección hoy para continuar tu racha de aprendizaje.
                </p>
                <Link
                  to="/courses"
                  className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                  Continuar aprendiendo →
                </Link>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Actividad de los últimos 7 días</h5>
              <div className="grid grid-cols-7 gap-2">
                {[...Array(7)].map((_, index) => {
                  const isActive = index < 5; // Mock data: active for first 5 days
                  return (
                    <div key={index} className="text-center">
                      <div className={`w-8 h-8 rounded-lg mb-2 ${
                        isActive ? 'bg-green-500' : 'bg-gray-200'
                      }`}></div>
                      <span className="text-xs text-gray-600">
                        {['L', 'M', 'M', 'J', 'V', 'S', 'D'][index]}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Días activos esta semana</span>
                  <span className="font-semibold">5/7</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Mejor racha personal</span>
                  <span className="font-semibold">12 días</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total días activos</span>
                  <span className="font-semibold">45 días</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};