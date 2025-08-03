import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  joinedAt: string;
  bio?: string;
  location?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType {
  auth: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthState = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Verificar si hay usuario guardado
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setAuth({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuth(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Intentando login con:', email);
    
    // Buscar usuario en localStorage
    const allUsers = Object.keys(localStorage)
      .filter(key => key.startsWith('user-'))
      .map(key => JSON.parse(localStorage.getItem(key) || '{}'));
    
    const user = allUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Credenciales incorrectas');
    }
    
    // Guardar usuario actual
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    setAuth({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
    
    console.log('✅ Login exitoso');
  };

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    console.log('📝 Creando usuario:', email);
    
    // Verificar si ya existe
    const existingUser = localStorage.getItem(`user-${email}`);
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'student',
      avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      joinedAt: new Date().toISOString(),
      bio: '',
      location: '',
      phone: phone || ''
    };
    
    // Guardar usuario con password
    const userWithPassword = { ...newUser, password };
    localStorage.setItem(`user-${email}`, JSON.stringify(userWithPassword));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    setAuth({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });
    
    console.log('✅ Usuario creado exitosamente');
  };

  const signOut = () => {
    localStorage.removeItem('currentUser');
    setAuth({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!auth.user) return;
    
    const updatedUser = { ...auth.user, ...updates };
    
    // Actualizar en localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Actualizar también en el registro de usuarios
    const userWithPassword = localStorage.getItem(`user-${auth.user.email}`);
    if (userWithPassword) {
      const userData = JSON.parse(userWithPassword);
      localStorage.setItem(`user-${auth.user.email}`, JSON.stringify({
        ...userData,
        ...updates
      }));
    }
    
    setAuth(prev => ({
      ...prev,
      user: updatedUser
    }));
  };

  return { auth, signIn, signUp, signOut, updateProfile, AuthContext };
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};