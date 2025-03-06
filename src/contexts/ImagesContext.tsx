
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

export type ImageItem = {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  size: number;
};

type ImagesContextType = {
  images: ImageItem[];
  addImage: (imageFile: File) => Promise<void>;
  deleteImage: (id: string) => void;
  isUploading: boolean;
};

const ImagesContext = createContext<ImagesContextType | undefined>(undefined);

export const ImagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Load images from localStorage or use empty array
    const savedImages = localStorage.getItem('images');
    if (savedImages) {
      try {
        setImages(JSON.parse(savedImages));
      } catch (error) {
        console.error("Error parsing images from localStorage:", error);
        setImages([]);
      }
    }
  }, []);

  // Save to localStorage whenever images change
  useEffect(() => {
    if (images) {
      localStorage.setItem('images', JSON.stringify(images));
    }
  }, [images]);

  // Convert File to base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const addImage = async (imageFile: File) => {
    try {
      setIsUploading(true);
      
      // Check file size - limit to 5MB
      if (imageFile.size > 5 * 1024 * 1024) {
        toast.error("A imagem é muito grande (máximo 5MB)");
        return;
      }
      
      // Convert to base64
      const base64Image = await fileToBase64(imageFile);
      
      // Create new image object
      const newImage: ImageItem = {
        id: `image-${Date.now()}`,
        name: imageFile.name,
        url: base64Image,
        createdAt: new Date().toISOString(),
        size: imageFile.size
      };
      
      // Add to state
      setImages(prev => [newImage, ...prev]);
      toast.success("Imagem carregada com sucesso!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erro ao carregar imagem");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    toast.success("Imagem removida com sucesso!");
  };

  return (
    <ImagesContext.Provider
      value={{
        images,
        addImage,
        deleteImage,
        isUploading
      }}
    >
      {children}
    </ImagesContext.Provider>
  );
};

export const useImages = (): ImagesContextType => {
  const context = useContext(ImagesContext);
  if (context === undefined) {
    throw new Error('useImages must be used within an ImagesProvider');
  }
  return context;
};
