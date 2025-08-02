import React from 'react';
import { useAuthState } from '../../hooks/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { auth, signIn, signUp, signOut, updateProfile, AuthContext } = useAuthState();

  return (
    <AuthContext.Provider value={{ auth, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};