
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Achievement, achievements as initialAchievements } from '../data/achievements';
import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

type AchievementsContextType = {
  achievements: Achievement[];
  addAchievement: (achievement: Achievement) => Promise<void>;
  updateAchievement: (achievement: Achievement) => Promise<void>;
  deleteAchievement: (id: string) => Promise<void>;
  updateAchievementImage: (id: string, imageFile: File) => Promise<void>;
};

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

export const AchievementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch achievements from Supabase
    const fetchAchievements = async () => {
      try {
        const { data, error } = await supabase
          .from('achievements')
          .select('*');

        if (error) {
          console.error("Error fetching achievements:", error);
          // Fallback to initial data if database fetch fails
          setAchievements(initialAchievements);
          return;
        }

        if (data.length > 0) {
          // Map the database data to our Achievement type
          const mappedAchievements: Achievement[] = data.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description || '',
            requirements: item.requirements || '',
            reward: item.reward || '',
            category: item.category,
            rarity: item.rarity,
            image: item.image_path || '/placeholder.svg',
            unlocked: item.unlocked || false
          }));
          setAchievements(mappedAchievements);
        } else {
          // If no data in database, use initial data and insert it
          await Promise.all(initialAchievements.map(async (achievement) => {
            await supabase.from('achievements').insert({
              id: achievement.id,
              title: achievement.title,
              description: achievement.description,
              requirements: achievement.requirements,
              reward: achievement.reward,
              category: achievement.category,
              rarity: achievement.rarity,
              image_path: achievement.image,
              unlocked: achievement.unlocked || false
            });
          }));
          setAchievements(initialAchievements);
        }
      } catch (error) {
        console.error("Error loading achievements:", error);
        setAchievements(initialAchievements);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  // Convert File to base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const addAchievement = async (achievement: Achievement) => {
    try {
      // Ensure the achievement has a unique ID
      if (!achievement.id) {
        achievement.id = uuidv4();
      }
      
      // Upload the image to Supabase Storage if it's a base64 string (new image)
      let imagePath = achievement.image;
      
      if (achievement.image.startsWith('data:image')) {
        // It's a base64 image, we need to convert and upload
        // First, convert the base64 to a file
        const response = await fetch(achievement.image);
        const blob = await response.blob();
        const file = new File([blob], `achievement-${achievement.id}.png`, { type: 'image/png' });
        
        // Then upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `achievement-${achievement.id}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, file);
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);
        
        imagePath = publicUrl;
      }
      
      // Save to Supabase
      const { error } = await supabase
        .from('achievements')
        .insert({
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          requirements: achievement.requirements,
          reward: achievement.reward,
          category: achievement.category,
          rarity: achievement.rarity,
          image_path: imagePath,
          unlocked: achievement.unlocked || false
        });
      
      if (error) {
        throw error;
      }
      
      // Update the achievement with the stored image path
      const newAchievement = {
        ...achievement,
        image: imagePath
      };
      
      setAchievements(prev => [...prev, newAchievement]);
      toast.success("Conquista adicionada com sucesso!");
    } catch (error) {
      console.error("Error adding achievement:", error);
      toast.error("Erro ao adicionar conquista");
    }
  };

  const updateAchievement = async (achievement: Achievement) => {
    try {
      // Check if the image has been changed (is a base64 string)
      let imagePath = achievement.image;
      
      if (achievement.image.startsWith('data:image')) {
        // It's a base64 image, we need to convert and upload
        // First, convert the base64 to a file
        const response = await fetch(achievement.image);
        const blob = await response.blob();
        const file = new File([blob], `achievement-${achievement.id}.png`, { type: 'image/png' });
        
        // Then upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `achievement-${achievement.id}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, file, { upsert: true });
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);
        
        imagePath = publicUrl;
      }
      
      // Update the achievement in Supabase
      const { error } = await supabase
        .from('achievements')
        .update({
          title: achievement.title,
          description: achievement.description,
          requirements: achievement.requirements,
          reward: achievement.reward,
          category: achievement.category,
          rarity: achievement.rarity,
          image_path: imagePath,
          unlocked: achievement.unlocked || false
        })
        .eq('id', achievement.id);
      
      if (error) {
        throw error;
      }
      
      // Update the achievement with the stored image path
      const updatedAchievement = {
        ...achievement,
        image: imagePath
      };
      
      setAchievements(prev => 
        prev.map(a => a.id === achievement.id ? updatedAchievement : a)
      );
      toast.success("Conquista atualizada com sucesso!");
    } catch (error) {
      console.error("Error updating achievement:", error);
      toast.error("Erro ao atualizar conquista");
    }
  };

  const deleteAchievement = async (id: string) => {
    try {
      // Get the achievement first to get the image path
      const achievement = achievements.find(a => a.id === id);
      
      if (achievement && achievement.image && !achievement.image.startsWith('/placeholder')) {
        // Extract the file name from the URL
        const url = new URL(achievement.image);
        const filePath = url.pathname.split('/').pop();
        
        if (filePath) {
          // Delete from storage
          await supabase.storage
            .from('images')
            .remove([filePath]);
        }
      }
      
      // Delete from Supabase
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setAchievements(prev => prev.filter(a => a.id !== id));
      toast.success("Conquista removida com sucesso!");
    } catch (error) {
      console.error("Error deleting achievement:", error);
      toast.error("Erro ao remover conquista");
    }
  };

  const updateAchievementImage = async (id: string, imageFile: File) => {
    try {
      // Upload the new image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `achievement-${id}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, imageFile, { upsert: true });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);
      
      // Update the achievement in Supabase
      const { error } = await supabase
        .from('achievements')
        .update({ image_path: publicUrl })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setAchievements(prev => 
        prev.map(a => a.id === id ? { ...a, image: publicUrl } : a)
      );
      toast.success("Imagem atualizada com sucesso!");
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("Erro ao atualizar imagem");
    }
  };

  return (
    <AchievementsContext.Provider
      value={{
        achievements,
        addAchievement,
        updateAchievement,
        deleteAchievement,
        updateAchievementImage
      }}
    >
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = (): AchievementsContextType => {
  const context = useContext(AchievementsContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
};
