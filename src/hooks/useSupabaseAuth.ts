
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

export const useSupabaseAuth = () => {
  const { setIsAuthenticated, setIsAdmin, setUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // User is logged in
          setIsAuthenticated(true);
          // In a real app, you would check user roles from your database
          // For now, we'll consider all authenticated users as admins
          setIsAdmin(true);
          
          if (session.user) {
            setUserProfile({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.email?.split('@')[0] || 'User',
              avatar: session.user.user_metadata.avatar_url || '',
            });
          }
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setIsAuthenticated(true);
          setIsAdmin(true);
          
          if (session.user) {
            setUserProfile({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.email?.split('@')[0] || 'User',
              avatar: session.user.user_metadata.avatar_url || '',
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setUserProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setIsAuthenticated, setIsAdmin, setUserProfile]);

  return { isLoading };
};
