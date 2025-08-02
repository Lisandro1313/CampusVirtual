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
      console.warn('⚠️ Supabase not configured, using demo mode');
      setAuth(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('👤 Found existing session for:', session.user.email);
          const profile = createMockProfile(session.user);
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
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          const profile = createMockProfile(session.user);
          
          setAuth({
            user: session.user,
            profile,
            isAuthenticated: true,
            isLoading: false,
          });
          
          // Navigate to dashboard after successful login
          if (event === 'SIGNED_IN') {
            console.log('🎯 Navigating to dashboard');
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 100);
          }
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

  const createMockProfile = (user: User): Profile => {
    // Determine role based on email
    let role: 'student' | 'teacher' | 'admin' = 'student';
    
    if (user.email?.includes('admin') || user.email?.includes('norma')) {
      role = 'teacher';
    }
    
    return {
      id: user.id,
      name: user.email?.split('@')[0] || 'Usuario',
      email: user.email || '',
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase no está configurado');
    }

    console.log('🔐 Attempting login with:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Supabase auth error:', error.message);
      throw error;
    }

    console.log('✅ Login successful for:', data.user?.email);
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
    if (!auth.user) throw new Error('No user logged in');

    setAuth(prev => ({
      ...prev,
      profile: prev.profile ? { ...prev.profile, ...updates } : null
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