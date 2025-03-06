
import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useImages } from '../../contexts/ImagesContext';

const ImageUploader: React.FC = () => {
  const { t } = useLanguage();
  const { addImage, isUploading } = useImages();
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
      // Reset input so the same file can be uploaded again
      e.target.value = '';
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.match('image.*')) {
      alert(t('admin.onlyImages'));
      return;
    }
    
    await addImage(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{t('admin.uploadImages')}</h3>
        <button 
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2"
          onClick={handleButtonClick}
          disabled={isUploading}
        >
          <Upload size={18} />
          {isUploading ? t('admin.uploading') : t('admin.upload')}
        </button>
      </div>
      
      <div 
        className={`border-2 border-dashed ${dragActive ? 'border-primary' : 'border-border'} rounded-lg p-8 text-center cursor-pointer transition-colors`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
          disabled={isUploading}
        />
        
        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-2">{t('admin.dragImages')}</p>
        <p className="text-xs text-muted-foreground">{t('admin.supportedFormats')}</p>
      </div>
    </div>
  );
};

export default ImageUploader;
