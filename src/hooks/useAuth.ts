import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType {
  auth: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
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
    if (!supabase) {
      setAuth(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const profile = createEmptyProfile(session.user);
          setAuth({
            user: session.user,
            profile,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuth(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Auth init error:', error);
        setAuth(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = createEmptyProfile(session.user);
          setAuth({
            user: session.user,
            profile,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuth({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const createEmptyProfile = (user: User): Profile => {
    const savedProfile = localStorage.getItem(`profile-${user.id}`);
    if (savedProfile) {
      return JSON.parse(savedProfile);
    }

    let role: 'student' | 'teacher' | 'admin' = 'student';
    if (user.email?.includes('admin') || user.email?.includes('norma')) {
      role = 'teacher';
    }
    
    const emptyProfile: Profile = {
      id: user.id,
      name: user.email?.split('@')[0] || 'Usuario',
      email: user.email || '',
      role,
      avatar_url: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      bio: '',
      location: '',
      phone: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    localStorage.setItem(`profile-${user.id}`, JSON.stringify(emptyProfile));
    return emptyProfile;
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase no está configurado');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    if (!supabase) {
      throw new Error('Supabase no está configurado');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          role: 'student'
        }
      }
    });

    if (error) throw error;
  };

  const signOut = async () => {
    if (!supabase) {
      throw new Error('Supabase no está configurado');
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!auth.user || !auth.profile) return;

    const updatedProfile = { ...auth.profile, ...updates };
    
    localStorage.setItem(`profile-${auth.user.id}`, JSON.stringify(updatedProfile));
    
    setAuth(prev => ({
      ...prev,
      profile: updatedProfile
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