
import React from 'react';
import { Trophy, Image, Folder, Settings } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

type Tab = 'achievements' | 'images' | 'categories' | 'settings';

interface AdminSidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4">
      <h2 className="text-xl font-pixel mb-4">{t('admin.menu')}</h2>
      <nav className="space-y-1">
        <button 
          onClick={() => onTabChange('achievements')}
          className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-2 ${activeTab === 'achievements' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        >
          <Trophy size={18} />
          Conquistas
        </button>
        <button 
          onClick={() => onTabChange('images')}
          className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-2 ${activeTab === 'images' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        >
          <Image size={18} />
          {t('admin.images')}
        </button>
        <button 
          onClick={() => onTabChange('categories')}
          className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-2 ${activeTab === 'categories' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        >
          <Folder size={18} />
          {t('admin.categories')}
        </button>
        <button 
          onClick={() => onTabChange('settings')}
          className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-2 ${activeTab === 'settings' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        >
          <Settings size={18} />
          {t('admin.generalSettings')}
        </button>
      </nav>
    </div>
  );
};

export default AdminSidebar;
