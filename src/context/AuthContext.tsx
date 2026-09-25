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
  loginWithGoogle: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
  loginWithEmail: (email: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loginWithGoogle: async () => {},
  loginWithGitHub: async () => {},
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

  const loginWithGoogle = async () => {
    // Simulated realistic high-fidelity Google OAuth authentication
    await new Promise(r => setTimeout(r, 450));
    const googleUser: AuthUser = {
      id: 'usr_g_' + Math.random().toString(36).substring(2, 8),
      name: 'Aritra Pal',
      email: 'aritra345pal@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      provider: 'google',
      role: 'Cluster Administrator',
    };
    saveUser(googleUser);
  };

  const loginWithGitHub = async () => {
    await new Promise(r => setTimeout(r, 450));
    const ghUser: AuthUser = {
      id: 'usr_gh_' + Math.random().toString(36).substring(2, 8),
      name: 'Aritra (GitHub)',
      email: 'aritra.dev@github.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      provider: 'github',
      role: 'DevOps Engineer',
    };
    saveUser(ghUser);
  };

  const loginWithEmail = async (email: string, name?: string) => {
    await new Promise(r => setTimeout(r, 350));
    const defaultName = name || email.split('@')[0] || 'Vault Operator';
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
        loginWithGoogle,
        loginWithGitHub,
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
