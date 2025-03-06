
import React from 'react';
import { Settings, Save } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

const SettingsTab: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div>
      <h2 className="text-2xl font-pixel mb-6 flex items-center gap-2">
        <Settings className="h-6 w-6" />
        {t('admin.generalSettings')}
      </h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{t('admin.siteSettings')}</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="site-title" className="block text-sm font-medium mb-1">
                {t('admin.siteTitle')}
              </label>
              <input
                id="site-title"
                type="text"
                defaultValue="MC Conquistas"
                className="w-full px-3 py-2 border border-border rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="site-description" className="block text-sm font-medium mb-1">
                {t('admin.siteDescription')}
              </label>
              <textarea
                id="site-description"
                rows={3}
                defaultValue="Plataforma de conquistas para jogadores de Minecraft"
                className="w-full px-3 py-2 border border-border rounded-md resize-none"
              />
            </div>
            
            <div className="flex justify-end">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2">
                <Save size={18} />
                {t('admin.saveChanges')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
