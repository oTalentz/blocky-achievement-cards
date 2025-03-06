
import React, { createContext, useContext, useState, useEffect } from 'react';
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
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    // Check for existing Supabase session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const isAdmin = session.user.email?.includes('admin@') || false;
        
        const user: User = {
          id: session.user.id,
          username: session.user.email?.split('@')[0] || '',
          email: session.user.email || '',
          isAdmin
        };
        
        setUser(user);
      }
      
      setIsLoading(false);
    };
    
    checkSession();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const isAdmin = session.user.email?.includes('admin@') || false;
          
          const user: User = {
            id: session.user.id,
            username: session.user.email?.split('@')[0] || '',
            email: session.user.email || '',
            isAdmin
          };
          
          setUser(user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        const isAdmin = email.includes('admin@');
        
        const user: User = {
          id: data.user.id,
          username: email.split('@')[0],
          email,
          isAdmin
        };
        
        setUser(user);
        toast.success(t('auth.loginSuccess'));
      }
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please check your credentials.");
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
        const user: User = {
          id: data.user.id,
          username,
          email,
          isAdmin: false
        };
        
        setUser(user);
        toast.success(t('auth.registerSuccess'));
      }
    } catch (error) {
      console.error(error);
      toast.error("Registration failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
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
