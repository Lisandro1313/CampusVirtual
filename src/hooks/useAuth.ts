import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  avatar_url?: string;
  joinedAt?: string;
  created_at?: string;
  bio?: string;
  location?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  profile: User | null;
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
    profile: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    if (supabase) {
      // Supabase auth
      initializeSupabaseAuth();
    } else {
      // Local auth fallback
      initializeLocalAuth();
    }
  }, []);

  const initializeSupabaseAuth = async () => {
    if (!supabase) return;

    try {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setAuth(prev => ({ ...prev, isLoading: false }));
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setAuth({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      });
    } catch (error) {
      console.error('Error initializing Supabase auth:', error);
      setAuth(prev => ({ ...prev, isLoading: false }));
    }
  };

  const initializeLocalAuth = () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setAuth({
        user,
        profile: user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuth(prev => ({ ...prev, isLoading: false }));
    }
  };

  const loadUserProfile = async (userId: string) => {
    if (!supabase) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        setAuth(prev => ({ ...prev, isLoading: false }));
        return;
      }

      console.log('👤 Profile loaded:', profile);
      
      setAuth({
        user: profile,
        profile: profile,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
      setAuth(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signIn = async (email: string, password: string) => {
    if (supabase) {
      // Supabase sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase login error:', error);
        throw new Error(error.message);
      }

      if (data.user) {
        await loadUserProfile(data.user.id);
      }
    } else {
      // Local sign in fallback
      const allUsers = Object.keys(localStorage)
        .filter(key => key.startsWith('user-'))
        .map(key => JSON.parse(localStorage.getItem(key) || '{}'));
      
      const user = allUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Credenciales incorrectas');
      }
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      setAuth({
        user,
        profile: user,
        isAuthenticated: true,
        isLoading: false,
      });
    }
  };

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    if (supabase) {
      // Supabase sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Supabase signup error:', error);
        throw new Error(error.message);
      }

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            email,
            role: 'student',
            phone: phone || '',
            bio: '',
            location: ''
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw new Error('Error creando perfil: ' + profileError.message);
        }

        await loadUserProfile(data.user.id);
      }
    } else {
      // Local sign up fallback
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
      
      const userWithPassword = { ...newUser, password };
      localStorage.setItem(`user-${email}`, JSON.stringify(userWithPassword));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      setAuth({
        user: newUser,
        profile: newUser,
        isAuthenticated: true,
        isLoading: false,
      });
    }
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('currentUser');
    }
    
    setAuth({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!auth.user) return;
    
    if (supabase) {
      // Update in Supabase
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', auth.user.id);

      if (error) {
        throw new Error('Error actualizando perfil: ' + error.message);
      }

      // Reload profile
      await loadUserProfile(auth.user.id);
    } else {
      // Update locally
      const updatedUser = { ...auth.user, ...updates };
      
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
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
        user: updatedUser,
        profile: updatedUser
      }));
    }
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