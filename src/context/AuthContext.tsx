import React, { createContext, useContext, useEffect, useState } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'github' | 'email';
  role?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loginUser: (user: AuthUser) => void;
  loginWithEmail: (email: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loginUser: () => {},
  loginWithEmail: async () => {},
  logout: () => {},
});

const AUTH_STORAGE_KEY = 'vault_authenticated_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      // ignore
    }
    return null;
  });

  const saveUser = (u: AuthUser | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const loginUser = (authUser: AuthUser) => {
    saveUser(authUser);
  };

  const loginWithEmail = async (email: string, name?: string) => {
    await new Promise(r => setTimeout(r, 350));
    const defaultName = name || email.split('@')[0].replace(/[._]/g, ' ') || 'Vault Operator';
    const emailUser: AuthUser = {
      id: 'usr_em_' + Math.random().toString(36).substring(2, 8),
      name: defaultName,
      email,
      provider: 'email',
      role: 'Storage Engineer',
    };
    saveUser(emailUser);
  };

  const logout = () => {
    saveUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginUser,
        loginWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
