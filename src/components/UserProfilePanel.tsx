
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { User, Mail, LogOut, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const UserProfilePanel: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleGoToAdmin = () => {
    navigate('/admin');
    setIsExpanded(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
        aria-expanded={isExpanded}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <User size={18} />
        </div>
        <span className="font-medium hidden md:block">{user.username}</span>
        {isAdmin && (
          <span className="text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded-full hidden md:inline-flex">
            Admin
          </span>
        )}
      </button>

      {isExpanded && (
        <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {/* Profile Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.username}</p>
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Actions */}
          <div className="p-2">
            <button 
              className="flex w-full items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-left"
              onClick={() => toast.info(t('profile.emailVerified'))}
            >
              <Mail size={18} className="text-muted-foreground" />
              <span>{t('profile.email')}</span>
            </button>
            
            {isAdmin && (
              <button 
                className="flex w-full items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-left"
                onClick={handleGoToAdmin}
              >
                <UserCog size={18} className="text-amber-500" />
                <span>{t('admin.dashboard')}</span>
              </button>
            )}
            
            <button 
              className="flex w-full items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-left text-red-500"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>{t('auth.logout')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePanel;
