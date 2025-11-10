import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types'; // Make sure you have a User type

interface AuthContextType {
  isPatientAuthenticated: boolean;
  patientLogin: (user: User, token: string) => void;
  patientLogout: () => void;
  patientUser: User | null;
  isAdminAuthenticated: boolean;
  adminLogin: () => void;
  adminLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isPatientAuthenticated, setIsPatientAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [patientUser, setPatientUser] = useState<User | null>(null);

  const patientLogin = (user: User, token: string) => {
    setIsPatientAuthenticated(true);
    setPatientUser(user);
    sessionStorage.setItem('authToken', token);
  };

  const patientLogout = () => {
    setIsPatientAuthenticated(false);
    setPatientUser(null);
    sessionStorage.removeItem('authToken');
  };

  const adminLogin = () => setIsAdminAuthenticated(true);
  const adminLogout = () => setIsAdminAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isPatientAuthenticated, patientLogin, patientLogout, patientUser, isAdminAuthenticated, adminLogin, adminLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};