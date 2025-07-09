import React from 'react';
import { useSupabaseAuthState } from '../../hooks/useSupabaseAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const SupabaseAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { auth, signIn, signUp, signOut, AuthContext } = useSupabaseAuthState();

  return (
    <AuthContext.Provider value={{ auth, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};