import { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string, telefono?: string, bio?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthState = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuthState = async () => {
      const storedToken = localStorage.getItem('token');

      if (storedToken) {
        try {
          const userData = await apiService.getProfile();
          const user: User = {
            id: userData._id,
            name: userData.nombre,
            email: userData.email,
            role: userData.rol === 'docente' ? 'teacher' : 'student',
            joinedAt: userData.fechaRegistro || new Date().toISOString(),
            avatar: userData.avatar,
            bio: userData.bio,
            location: userData.telefono
          };

          setAuth({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error verificando autenticación:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuth({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setAuth(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuthState();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);

      const user: User = {
        id: response.user.id,
        name: response.user.nombre,
        email: response.user.email,
        role: response.user.rol === 'docente' ? 'teacher' : 'student',
        joinedAt: new Date().toISOString(),
      };

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(user));

      setAuth({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error al iniciar sesión');
    }
  };

  const register = async (name: string, email: string, password: string, role: string, telefono?: string, bio?: string) => {
    try {
      const response = await apiService.register({
        nombre: name,
        email,
        password,
        rol: role === 'teacher' ? 'docente' : 'alumno',
        telefono,
        bio
      });

      const user: User = {
        id: response.user.id,
        name: response.user.nombre,
        email: response.user.email,
        role: response.user.rol === 'docente' ? 'teacher' : 'student',
        joinedAt: new Date().toISOString(),
      };

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(user));

      setAuth({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error al registrarse');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return { auth, login, register, logout, AuthContext };
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};