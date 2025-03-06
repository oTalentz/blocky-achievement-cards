
import React from 'react';
import { Trash, Download, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useImages, ImageItem } from '../../contexts/ImagesContext';

const ImageGallery: React.FC = () => {
  const { t } = useLanguage();
  const { images, deleteImage } = useImages();

  const handleDelete = (imageId: string) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      deleteImage(imageId);
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const downloadImage = (image: ImageItem) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openImage = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">{t('admin.imageLibrary')}</h3>
      
      {images.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
            <span className="text-muted-foreground">{t('admin.noImages')}</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="group relative bg-muted rounded-md overflow-hidden border border-border">
              <div className="aspect-square relative">
                <img 
                  src={image.url} 
                  alt={image.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openImage(image.url)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                      <ExternalLink size={18} />
                    </button>
                    <button 
                      onClick={() => downloadImage(image)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                      <Download size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(image.id)}
                      className="p-2 bg-white/10 hover:bg-destructive/80 rounded-full text-white transition-colors"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-2 text-xs truncate">
                <div className="font-medium truncate" title={image.name}>{image.name}</div>
                <div className="text-muted-foreground flex justify-between">
                  <span>{formatSize(image.size)}</span>
                  <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
