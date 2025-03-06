
import React from 'react';
import { Image, Upload } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

const ImagesTab: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div>
      <h2 className="text-2xl font-pixel mb-6 flex items-center gap-2">
        <Image className="h-6 w-6" />
        {t('admin.images')}
      </h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">{t('admin.uploadImages')}</h3>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2">
            <Upload size={18} />
            {t('admin.upload')}
          </button>
        </div>
        
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <Image className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">{t('admin.dragImages')}</p>
          <p className="text-xs text-muted-foreground">{t('admin.supportedFormats')}</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">{t('admin.imageLibrary')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
            <span className="text-muted-foreground">{t('admin.noImages')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagesTab;
