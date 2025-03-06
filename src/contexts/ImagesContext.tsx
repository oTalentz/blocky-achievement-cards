
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

        if (data && data.length > 0) {
          setImages(data.map(img => ({
            id: img.id,
            name: img.name,
            url: img.url,
            createdAt: img.created_at,
            size: img.size || 0
          })));
        }
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
        toast.error("A imagem é muito grande (máximo 5MB)", { duration: 2000 });
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
        console.error("Error uploading to storage:", uploadError);
        toast.error("Erro ao carregar imagem para o storage", { duration: 2000 });
        return;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      // Save image metadata to the database
      const { data: dbData, error: dbError } = await supabase
        .from('gallery_images')
        .insert([{
          name: imageFile.name,
          url: publicUrl,
          size: imageFile.size,
        }])
        .select('*')
        .single();
      
      if (dbError) {
        console.error("Error saving to database:", dbError);
        toast.error("Erro ao salvar imagem no banco de dados", { duration: 2000 });
        return;
      }
      
      // Add to state with the database ID
      setImages(prev => [{
        id: dbData.id,
        name: dbData.name,
        url: dbData.url,
        createdAt: dbData.created_at,
        size: dbData.size
      }, ...prev]);
      
      toast.success("Imagem carregada com sucesso!", { duration: 2000 });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erro ao carregar imagem", { duration: 2000 });
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
        console.error("Error fetching image:", fetchError);
        toast.error("Erro ao encontrar imagem", { duration: 2000 });
        return;
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
          // Continue with database deletion even if storage deletion fails
        }
      }
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);
      
      if (dbError) {
        console.error("Error deleting from database:", dbError);
        toast.error("Erro ao remover imagem do banco de dados", { duration: 2000 });
        return;
      }
      
      // Update state
      setImages(prev => prev.filter(img => img.id !== id));
      toast.success("Imagem removida com sucesso!", { duration: 2000 });
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Erro ao remover imagem", { duration: 2000 });
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
