
import React from 'react';
import { Image } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import ImageUploader from '../ImageUploader';
import ImageGallery from '../ImageGallery';

const ImagesTab: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div>
      <h2 className="text-2xl font-pixel mb-6 flex items-center gap-2">
        <Image className="h-6 w-6" />
        {t('admin.images')}
      </h2>
      
      <ImageUploader />
      <ImageGallery />
    </div>
  );
};

export default ImagesTab;
