
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

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
  deleteImage: (id: string) => Promise<void>;
  isUploading: boolean;
};

const ImagesContext = createContext<ImagesContextType | undefined>(undefined);

export const ImagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Fetch images from Supabase
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching images:", error);
          return;
        }

        setImages(data.map(img => ({
          id: img.id,
          name: img.name,
          url: img.url,
          createdAt: img.created_at,
          size: img.size || 0
        })));
      } catch (error) {
        console.error("Error in fetchImages:", error);
      }
    };

    fetchImages();
  }, []);

  const addImage = async (imageFile: File) => {
    try {
      setIsUploading(true);
      
      // Check file size - limit to 5MB
      if (imageFile.size > 5 * 1024 * 1024) {
        toast.error("A imagem é muito grande (máximo 5MB)");
        return;
      }
      
      // Generate a unique file name
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('images')
        .upload(filePath, imageFile);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      // Create new image object
      const newImage: Omit<ImageItem, 'id'> & { id?: string } = {
        name: imageFile.name,
        url: publicUrl,
        createdAt: new Date().toISOString(),
        size: imageFile.size
      };
      
      // Save image metadata to the database
      const { data: dbData, error: dbError } = await supabase
        .from('gallery_images')
        .insert([{
          name: newImage.name,
          url: publicUrl,
          size: newImage.size,
        }])
        .select('*')
        .single();
      
      if (dbError) {
        throw dbError;
      }
      
      // Add to state with the database ID
      setImages(prev => [{
        id: dbData.id,
        name: dbData.name,
        url: dbData.url,
        createdAt: dbData.created_at,
        size: dbData.size
      }, ...prev]);
      
      toast.success("Imagem carregada com sucesso!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erro ao carregar imagem");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (id: string) => {
    try {
      // First get the image to find its URL
      const { data: imageData, error: fetchError } = await supabase
        .from('gallery_images')
        .select('url')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Extract the file path from the URL
      const fileUrl = new URL(imageData.url);
      const filePath = fileUrl.pathname.split('/').pop();
      
      if (filePath) {
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('images')
          .remove([filePath]);
        
        if (storageError) {
          console.error("Error deleting from storage:", storageError);
        }
      }
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);
      
      if (dbError) {
        throw dbError;
      }
      
      // Update state
      setImages(prev => prev.filter(img => img.id !== id));
      toast.success("Imagem removida com sucesso!");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Erro ao remover imagem");
    }
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
