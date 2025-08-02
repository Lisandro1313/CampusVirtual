import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const demoUsers = [
    { 
      email: 'admin@esfd.com', 
      role: 'Administrador', 
      password: 'admin123',
      description: 'Puede gestionar todo el sistema'
    },
    { 
      email: 'norma@esfd.com', 
      role: 'Norma Skuletich (Docente)', 
      password: 'norma123',
      description: 'Directora y Magister en Educación'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
            <img 
              src="/src/assets/Imagen de WhatsApp 2025-07-10 a las 15.54.58_bc651df1.jpg" 
              alt="E.S.FD Logo" 
              className="h-12 w-12 rounded-lg object-cover"
            />
            <span className="text-3xl font-bold text-white">E.S.FD</span>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">
            Iniciar Sesión
          </h2>
          <p className="text-blue-200">
            Accede a tu cuenta de formación docente
          </p>
        </div>

        {/* Demo Users */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
          <h3 className="text-white font-semibold mb-3 text-center">👥 Usuarios de Prueba</h3>
          <div className="mb-3 p-2 bg-blue-600/20 rounded-lg">
            <p className="text-blue-200 text-xs text-center">
              💡 Estos usuarios funcionan en modo demo si no están configurados en Supabase
            </p>
          </div>
          <div className="space-y-2">
            {demoUsers.map((user, index) => (
              <button
                key={index}
                onClick={() => {
                  setEmail(user.email);
                  setPassword(user.password);
                }}
                className="w-full text-left bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">{user.role}</p>
                    <p className="text-blue-200 text-sm">{user.email}</p>
                    <p className="text-blue-300 text-xs">{user.description}</p>
                  </div>
                  <span className="text-blue-300 text-xs">Click para usar</span>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-3 p-2 bg-blue-600/20 rounded-lg">
            <p className="text-blue-200 text-xs text-center">
              💡 Los estudiantes se registran usando el formulario de registro
            </p>
          </div>
        </div>

        <form className="bg-white rounded-2xl shadow-2xl p-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              ¿Eres estudiante y no tienes cuenta?{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-500 font-semibold transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};