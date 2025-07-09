import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<{
  auth: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role?: string) => Promise<void>;
  signOut: () => Promise<void>;
} | null>(null);

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within an AuthProvider');
  }
  return context;
};

export const useSupabaseAuthState = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuth(prev => ({
        ...prev,
        session,
        user: session?.user || null,
        isAuthenticated: !!session?.user,
      }));

      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setAuth(prev => ({ ...prev, isLoading: false }));
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuth(prev => ({
          ...prev,
          session,
          user: session?.user || null,
          isAuthenticated: !!session?.user,
        }));

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setAuth(prev => ({
            ...prev,
            profile: null,
            isLoading: false,
          }));
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setAuth(prev => ({
        ...prev,
        profile,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
      setAuth(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signUp = async (email: string, password: string, name: string, role = 'student') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name,
          email,
          role: role as 'student' | 'teacher' | 'admin',
        });

      if (profileError) throw profileError;

      // Create notification subscription
      await supabase
        .from('notification_subscriptions')
        .insert({
          user_id: data.user.id,
          email_announcements: true,
          email_new_lessons: true,
        });
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return { auth, signIn, signUp, signOut, AuthContext };
};