
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { User, Mail, KeyRound, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/client';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Update username
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { username }
      });
      
      if (metadataError) throw metadataError;
      
      // Update email if it has changed
      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email });
        
        if (emailError) throw emailError;
        
        toast.success(t('profile.emailUpdateSuccess'));
        toast.info(t('profile.verifyNewEmail'));
      } else {
        toast.success(t('profile.profileUpdated'));
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || t('profile.updateError'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error(t('profile.passwordsDoNotMatch'));
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) throw error;
      
      toast.success(t('profile.passwordUpdated'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error.message || t('profile.passwordUpdateError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-background">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-primary hover:underline"
          >
            <ArrowLeft size={16} className="mr-1" />
            {t('common.backToHome')}
          </button>
        </div>
      
        <h1 className="text-3xl font-bold mb-8">{t('profile.title')}</h1>
        
        <div className="flex items-center mb-8 gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.username}</h2>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Profile Information Form */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User size={20} />
              {t('profile.basicInfo')}
            </h2>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-1">
                  {t('profile.username')}
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  {t('profile.email')}
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md"
                    required
                  />
                  <Mail size={18} className="text-muted-foreground" />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-2 rounded-md"
              >
                <Save size={16} />
                {t('profile.saveChanges')}
              </button>
            </form>
          </div>
          
          {/* Password Change Form */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <KeyRound size={20} />
              {t('profile.changePassword')}
            </h2>
            
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                  {t('profile.newPassword')}
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md"
                  required
                  minLength={6}
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                  {t('profile.confirmPassword')}
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md"
                  required
                  minLength={6}
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-2 rounded-md"
              >
                <KeyRound size={16} />
                {t('profile.updatePassword')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
