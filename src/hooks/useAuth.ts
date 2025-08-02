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
      console.warn('⚠️ Supabase not configured, setting loading to false');
      setAuth(prev => ({ ...prev, isLoading: false }));
      return;
    }

    console.log('🚀 Initializing Supabase auth...');
    const initAuth = async () => {
      console.log('🔍 Getting initial session...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        console.log('👤 Found existing session for:', session.user.email);
        const profile = await fetchProfile(session.user.id);
        console.log('📋 Profile loaded:', profile?.name, 'Role:', profile?.role);
        setAuth({
          user: session.user,
          profile,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        console.log('❌ No existing session found');
        setAuth(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          console.log('👤 User logged in, fetching profile...');
          let profile = await fetchProfile(session.user.id);
          
          console.log('📋 Profile fetch result:', {
            profileExists: !!profile,
            profileName: profile?.name,
            profileRole: profile?.role,
            userId: session.user.id
          });
          
          if (!profile) {
            console.log('⚠️ No profile found for user:', session.user.id);
            console.log('📧 User email:', session.user.email);
            console.log('🔍 Checking if this matches our database...');
            
            // Let's check what's in the profiles table
            if (supabase) {
              const { data: allProfiles, error: listError } = await supabase
                .from('profiles')
                .select('id, email, name, role');
              
              console.log('📊 All profiles in database:', allProfiles);
              console.log('🔍 Looking for email:', session.user.email);
              
              const matchingProfile = allProfiles?.find(p => p.email === session.user.email);
              if (matchingProfile) {
                console.log('🎯 Found matching profile by email:', matchingProfile);
                profile = matchingProfile as Profile;
              } else {
                console.log('❌ No matching profile found by email either');
              }
            }
          }
          
          if (profile) {
            console.log('✅ Setting auth state with profile:', {
              name: profile.name,
              role: profile.role,
              email: profile.email
            });
          } else {
            console.log('❌ Still no profile found - this is the issue!');
          }
          
          setAuth({
            user: session.user,
            profile,
            isAuthenticated: true,
            isLoading: false,
          });
          
          // Navigate to dashboard after successful login
          if (event === 'SIGNED_IN' && profile?.role) {
            console.log('🎯 Navigating to dashboard after login for role:', profile.role);
            setTimeout(() => {
              console.log('🚀 Executing navigation to /dashboard');
              window.location.href = '/dashboard';
            }, 100);
          } else if (event === 'SIGNED_IN') {
            console.log('🚨 Cannot navigate - missing profile or role:', {
              hasProfile: !!profile,
              role: profile?.role
            });
          }
        } else {
          console.log('❌ User logged out, clearing auth state');
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
    
    console.log('📋 Fetching profile for user:', userId);
    
    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Query timeout after 3 seconds')), 3000);
    });
    
    try {
      console.log('⏳ Attempting direct profile query with 3s timeout...');
      
      const queryPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);
      
      if (data && !error) {
        console.log('✅ Profile found by ID:', data.name, data.role);
        return data;
      }
      
      console.log('❌ Profile not found by ID, error:', error?.message);
    } catch (directError) {
      console.log('❌ Direct query failed or timed out:', directError);
    }
    
    // Try email fallback with timeout
    try {
      console.log('🔄 Trying email fallback with timeout...');
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user?.email) {
          const emailQueryPromise = supabase
            .from('profiles')
            .select('*')
            .eq('email', user.email)
            .single();
          
          const { data: profileByEmail, error: emailError } = await Promise.race([
            emailQueryPromise, 
            timeoutPromise
          ]);
          
          if (profileByEmail && !emailError) {
            console.log('✅ Found profile by email:', profileByEmail.name, profileByEmail.role);
            return profileByEmail;
          }
          
          console.log('❌ Email query failed:', emailError?.message);
        }
      } catch (emailError) {
        console.log('❌ Email query also failed or timed out:', emailError);
      }
    } catch (directError) {
      console.log('❌ Direct query failed or timed out:', directError);
    }
    
    // Create emergency fallback profile
    console.log('🆘 Creating emergency fallback profile');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const mockProfile: Profile = {
        id: userId,
        name: user?.email?.split('@')[0] || 'Usuario',
        email: user?.email || '',
        role: 'student',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('🎭 Using emergency profile:', mockProfile);
      return mockProfile;
    } catch (fallbackError) {
      console.log('💥 Even fallback failed:', fallbackError);
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!supabase) {
        console.error('❌ Supabase not configured');
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
      console.log('🎯 Auth state will be updated by onAuthStateChange listener');

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
      console.log('🔍 Checking if profile exists for user:', user.id);
      // First check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (existingProfile) {
        console.log('✅ Found existing profile:', existingProfile.name, existingProfile.role);
        return existingProfile;
      }

      console.log('🆕 Creating new profile...');
      // Create new profile
      const profileData = {
        id: user.id,
        name: userData?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario',
        email: user.email || '',
        role: userData?.role || user.user_metadata?.role || 'student',
        phone: userData?.phone || user.user_metadata?.phone,
      };

      console.log('📝 Profile data to insert:', profileData);
      const { data: newProfile, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single();

      if (error) {
        console.error('❌ Profile creation failed:', error);
        return null;
      }

      console.log('✅ Profile created successfully:', newProfile);
      return newProfile;

    } catch (error) {
      console.error('❌ Profile creation error:', error);
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