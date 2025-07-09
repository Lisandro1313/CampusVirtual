import { useState, useEffect, createContext, useContext } from 'react';
import { AuthState, User } from '../types';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext<{
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthState = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('campus-user');
    if (savedUser) {
      setAuth({
        user: JSON.parse(savedUser),
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuth(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Find user in mock data
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Simulate password validation (in real app, this would be handled by backend)
    if (password !== 'password123') {
      throw new Error('Contraseña incorrecta');
    }

    localStorage.setItem('campus-user', JSON.stringify(user));
    setAuth({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const register = async (name: string, email: string, password: string, role = 'student') => {
    // Simulate registration API call
    const mockUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: role as 'student' | 'teacher' | 'admin',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      joinedAt: new Date().toISOString(),
    };

    localStorage.setItem('campus-user', JSON.stringify(mockUser));
    setAuth({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('campus-user');
    setAuth({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return { auth, login, register, logout, AuthContext };
};