
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Settings, Home } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AchievementsTab from '../components/admin/tabs/AchievementsTab';
import ImagesTab from '../components/admin/tabs/ImagesTab';
import CategoriesTab from '../components/admin/tabs/CategoriesTab';
import SettingsTab from '../components/admin/tabs/SettingsTab';

type Tab = 'achievements' | 'images' | 'categories' | 'settings';

const Admin: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('achievements');
  
  // If the user is not authenticated or not an admin, redirect to home
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-pixel flex items-center gap-2">
            <Settings className="h-8 w-8" />
            {t('admin.dashboard')}
          </h1>
          
          <Link 
            to="/" 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Home className="h-5 w-5" />
            {t('admin.returnHome') || 'Return to Home'}
          </Link>
        </div>

        <div className="grid md:grid-cols-[250px_1fr] gap-6">
          {/* Sidebar */}
          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Content */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            {activeTab === 'achievements' && <AchievementsTab />}
            {activeTab === 'images' && <ImagesTab />}
            {activeTab === 'categories' && <CategoriesTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
