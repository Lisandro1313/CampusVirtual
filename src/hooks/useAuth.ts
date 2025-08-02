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
      // Demo mode - use localStorage
      const demoUser = localStorage.getItem('demo-user');
      if (demoUser) {
        const user = JSON.parse(demoUser);
        setAuth({
          user: { id: user.id, email: user.email } as User,
          profile: user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuth(prev => ({ ...prev, isLoading: false }));
      }
      return;
    }

    // Real Supabase auth
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setAuth({
          user: session.user,
          profile,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuth(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          let profile = await fetchProfile(session.user.id);
          
          // If no profile exists, try to create one
          if (!profile) {
            profile = await createProfileIfNeeded(session.user, session.user.user_metadata);
          }
          
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

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    if (!supabase) return null;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!supabase) {
        throw new Error('Supabase no está configurado. Por favor configura las variables de entorno.');
      }

      console.log('🔐 Attempting login with:', email);
      
      // Autenticación real con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Supabase auth error:', error.message);
        throw error;
      }

      console.log('✅ Login successful, user:', data.user?.email);
      
      // Wait for profile to be loaded
      if (data.user) {
        console.log('📋 Loading profile for user:', data.user.id);
        const profile = await fetchProfile(data.user.id);
        console.log('👤 Profile loaded:', profile?.name, 'Role:', profile?.role);
      }

    } catch (error) {
      console.error('💥 Login error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    try {
      if (!supabase) {
        throw new Error('Supabase no está configurado. Por favor configura las variables de entorno.');
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

    } catch (error) {
      throw error;
    }
  };

  const createProfileIfNeeded = async (user: User, userData?: any) => {
    if (!supabase) return null;

    try {
      // First check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (existingProfile) {
        return existingProfile;
      }

      // Create new profile
      const profileData = {
        id: user.id,
        name: userData?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario',
        email: user.email || '',
        role: userData?.role || user.user_metadata?.role || 'student',
        phone: userData?.phone || user.user_metadata?.phone,
      };

      const { data: newProfile, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single();

      if (error) {
        console.warn('Profile creation failed:', error);
        return null;
      }

      return newProfile;

    } catch (error) {
      console.warn('Profile creation error:', error);
      return null;
    }
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

    if (!supabase) {
      throw new Error('Supabase no está configurado');
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', auth.user.id);

    if (error) throw error;

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