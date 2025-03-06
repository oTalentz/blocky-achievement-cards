
import React from 'react';
import { X } from 'lucide-react';

interface ImageZoomModalProps {
  image: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const ImageZoomModal: React.FC<ImageZoomModalProps> = ({ 
  image, 
  title, 
  isOpen, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="relative max-w-3xl max-h-[80vh] w-full bg-black rounded-lg overflow-hidden animate-scale-up">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/80 transition-colors z-10"
        >
          <X size={24} />
        </button>
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-contain pixelated"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/placeholder.svg';
          }}
        />
      </div>
    </div>
  );
};

export default ImageZoomModal;
