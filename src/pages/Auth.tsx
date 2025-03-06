
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../hooks/use-toast';
import { Loader2, UserCog } from 'lucide-react';

const Auth: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleLoginAsAdmin = () => {
    setEmail('admin@example.com');
    setPassword('admin123');
    setIsRegistering(false);
  };

  const handleLoginAsUser = () => {
    setEmail('user@example.com');
    setPassword('user123');
    setIsRegistering(false);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isRegistering) {
        // Sign up with Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username || email.split('@')[0],
            }
          }
        });
        
        if (error) throw error;
        
        toast({
          title: t('auth.registrationSuccess'),
          description: t('auth.checkEmailVerification'),
          duration: 2000,
          id: 'register-success'
        });
      } else {
        // Sign in with Supabase and get the session
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: t('auth.loginSuccess'),
          duration: 2000,
          id: 'login-success'
        });
        
        navigate('/');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: t('auth.error'),
        description: error.message,
        variant: 'destructive',
        duration: 2000
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
          {isRegistering && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                {t('auth.username')}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md"
              />
            </div>
          )}
          
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

        {!isRegistering && (
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-sm text-center mb-3">{t('auth.loginAs')}:</p>
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleLoginAsAdmin}
                className="w-full flex items-center justify-center space-x-2 bg-amber-500 text-white py-2 rounded-md hover:bg-amber-600 transition-colors"
              >
                <UserCog size={16} />
                <span>{t('auth.adminAccount')}</span>
              </button>
              <button
                onClick={handleLoginAsUser}
                className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                <span>{t('auth.normalAccount')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
