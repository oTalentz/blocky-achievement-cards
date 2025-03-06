
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Auth: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isRegistering) {
        // Sign up with Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: t('auth.registrationSuccess'),
          description: t('auth.checkEmailVerification'),
        });
      } else {
        // Sign in with Supabase and get the session
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        // Importante: Aqui não precisamos chamar login explicitamente, pois o AuthContext 
        // já está detectando a mudança de estado de autenticação através do listener
        // Apenas mostramos uma mensagem de sucesso
        toast({
          title: t('auth.loginSuccess'),
        });
        
        navigate('/');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: t('auth.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center bg-background">
      <div className="max-w-md w-full bg-card shadow-sm rounded-lg border border-border p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {isRegistering ? t('auth.register') : t('auth.login')}
        </h1>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              {t('auth.email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-border rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              {t('auth.password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-border rounded-md"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-md flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              isRegistering ? t('auth.register') : t('auth.login')
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-primary hover:underline"
          >
            {isRegistering ? t('auth.alreadyHaveAccount') : t('auth.dontHaveAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
