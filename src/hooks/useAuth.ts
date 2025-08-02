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
      // If Supabase is not configured, use demo mode immediately
      if (!supabase) {
        return handleDemoLogin(email, password);
      }

      // Try Supabase authentication, but fallback to demo mode on any error
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If it's an invalid credentials error, try demo mode
        if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
          console.warn('Supabase user not found, trying demo mode:', error.message);
          return handleDemoLogin(email, password);
        }
        throw error;
      }

    } catch (error) {
      console.warn('Supabase authentication failed, falling back to demo mode:', error);
      return handleDemoLogin(email, password);
    }
  };

  const handleDemoLogin = (email: string, password: string) => {
    if (email === 'admin@esfd.com' && password === 'admin123') {
      const adminUser = {
        id: 'admin-1',
        name: 'Administrador E.S.FD',
        email: 'admin@esfd.com',
        role: 'admin',
        avatar_url: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      localStorage.setItem('demo-user', JSON.stringify(adminUser));
      setAuth({
        user: { id: adminUser.id, email: adminUser.email } as User,
        profile: adminUser,
        isAuthenticated: true,
        isLoading: false,
      });
      return;
    }
    
    if (email === 'norma@esfd.com' && password === 'norma123') {
      const teacherUser = {
        id: 'teacher-1',
        name: 'Norma Skuletich',
        email: 'norma@esfd.com',
        role: 'teacher',
        bio: 'Magister en Educación. Directora de E.S.FD con más de 15 años de experiencia en formación docente.',
        phone: '1121673242',
        location: 'Calle 102 n 735, Punta Lara',
        avatar_url: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      localStorage.setItem('demo-user', JSON.stringify(teacherUser));
      setAuth({
        user: { id: teacherUser.id, email: teacherUser.email } as User,
        profile: teacherUser,
        isAuthenticated: true,
        isLoading: false,
      });
      return;
    }
    
    throw new Error('Credenciales incorrectas');
  };

  const createDemoUser = async (email: string, password: string, name: string, role: 'admin' | 'teacher') => {
    if (!supabase) return;

    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (authError) throw authError;

      // Create profile in database
      if (authData.user) {
        const profileData = {
          id: authData.user.id,
          name,
          email,
          role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          avatar_url: role === 'admin' 
            ? 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
            : 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          bio: role === 'teacher' ? 'Magister en Educación. Directora de E.S.FD con más de 15 años de experiencia en formación docente.' : undefined,
          phone: role === 'teacher' ? '1121673242' : undefined,
          location: role === 'teacher' ? 'Calle 102 n 735, Punta Lara' : undefined
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .insert([profileData]);

        if (profileError) {
          console.warn('Profile creation failed:', profileError);
        }
      }
    } catch (error) {
      console.warn('Demo user creation failed:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    try {
      // If Supabase is not configured, use demo mode
      if (!supabase) {
        return handleDemoSignup(email, password, name, phone);
      }

      // Try Supabase signup
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

      // If signup successful, user will be logged in automatically
      // The auth state change listener will handle profile creation

    } catch (error) {
      console.warn('Supabase signup failed, using demo mode:', error);
      return handleDemoSignup(email, password, name, phone);
    }
  };

  const handleDemoSignup = (email: string, password: string, name: string, phone?: string) => {
    // Demo mode - create student
    const newUser = {
      id: `student-${Date.now()}`,
      name,
      email,
      role: 'student' as const,
      phone,
      avatar_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    localStorage.setItem('demo-user', JSON.stringify(newUser));
    setAuth({
      user: { id: newUser.id, email: newUser.email } as User,
      profile: newUser,
      isAuthenticated: true,
      isLoading: false,
    });
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
        avatar_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: newProfile, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single();

      if (error) {
        console.warn('Profile creation failed:', error);
        // Return a basic profile structure even if database insert fails
        return {
          id: user.id,
          name,
          email: user.email || '',
          role: 'student' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }

      return newProfile;

    } catch (error) {
      console.warn('Profile creation error:', error);
      return null;
    }
  };

  const signOut = async () => {
    if (!supabase) {
      localStorage.removeItem('demo-user');
      setAuth({
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!auth.user) throw new Error('No user logged in');

    if (!supabase) {
      // Demo mode
      const currentUser = JSON.parse(localStorage.getItem('demo-user') || '{}');
      const updatedUser = { ...currentUser, ...updates };
      localStorage.setItem('demo-user', JSON.stringify(updatedUser));
      setAuth(prev => ({ ...prev, profile: updatedUser }));
      return;
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