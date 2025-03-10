
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { toast } from "sonner";
import { useLanguage } from './LanguageContext';
import { supabase } from '../integrations/supabase/client';

type User = {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  const adminLoginToastShown = useRef(false);

  // Função para verificar se é um email de administrador
  const checkIfAdmin = (email: string | undefined): boolean => {
    if (!email) return false;
    return email.includes('admin@');
  };

  useEffect(() => {
    // Check for existing Supabase session on mount
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const isAdmin = checkIfAdmin(session.user.email);
          
          const user: User = {
            id: session.user.id,
            username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || '',
            email: session.user.email || '',
            isAdmin
          };
          
          setUser(user);
          
          if (isAdmin && !adminLoginToastShown.current) {
            console.log('Usuário administrativo autenticado:', user.email);
            adminLoginToastShown.current = true;
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (event === 'SIGNED_IN' && session) {
          const isAdmin = checkIfAdmin(session.user.email);
          
          const user: User = {
            id: session.user.id,
            username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || '',
            email: session.user.email || '',
            isAdmin
          };
          
          setUser(user);
          
          // Evitar múltiplas notificações de login admin
          if (isAdmin && !adminLoginToastShown.current) {
            console.log('Usuário administrativo autenticado:', user.email);
            toast.success(t('auth.adminLoginSuccess'), {
              duration: 2000, // Reduz para 2 segundos
              id: 'admin-login-success' // ID único para evitar duplicatas
            });
            adminLoginToastShown.current = true;
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          adminLoginToastShown.current = false;
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [t]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        const isAdmin = checkIfAdmin(email);
        
        const user: User = {
          id: data.user.id,
          username: data.user.user_metadata?.username || email.split('@')[0],
          email,
          isAdmin
        };
        
        setUser(user);
        
        // Usar ID único para o toast e duração reduzida
        if (isAdmin) {
          toast.success(t('auth.adminLoginSuccess'), {
            duration: 2000,
            id: 'admin-login-success'
          });
          adminLoginToastShown.current = true;
        } else {
          toast.success(t('auth.loginSuccess'), {
            duration: 2000,
            id: 'login-success'
          });
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "Login failed. Please check your credentials.", {
        duration: 2000
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success(t('auth.registerSuccess'), {
          duration: 2000
        });
        // Note: Não definimos o usuário aqui porque o Supabase geralmente
        // requer confirmação de email antes de permitir login completo
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || "Registration failed. Please try again.", {
        duration: 2000
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      adminLoginToastShown.current = false;
      toast.success(t('auth.logoutSuccess'), {
        duration: 2000
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || "Logout failed. Please try again.", {
        duration: 2000
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAdmin: user?.isAdmin || false,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
