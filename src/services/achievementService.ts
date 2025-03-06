
import { supabase } from "../integrations/supabase/client";
import { Achievement } from '../types/achievements';
import { mapDbRowToAchievement, uploadImageToStorage } from '../utils/achievementUtils';
import { achievements as initialAchievements } from '../data/achievements';
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

// Fetch all achievements
export const fetchAchievements = async (): Promise<Achievement[]> => {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*');

    if (error) {
      console.error("Error fetching achievements:", error);
      // Fallback to initial data if database fetch fails
      return initialAchievements;
    }

    if (data.length > 0) {
      // Map the database data to our Achievement type
      return data.map(mapDbRowToAchievement);
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
      return initialAchievements;
    }
  } catch (error) {
    console.error("Error loading achievements:", error);
    return initialAchievements;
  }
};

// Add a new achievement
export const addAchievement = async (achievement: Achievement): Promise<Achievement> => {
  try {
    // Ensure the achievement has a unique ID
    if (!achievement.id) {
      achievement.id = uuidv4();
    }
    
    // Upload the image if it's a base64 string
    let imagePath = achievement.image;
    if (achievement.image.startsWith('data:image')) {
      imagePath = await uploadImageToStorage(achievement.image, achievement.id);
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
    
    // Return the achievement with the updated image path
    toast.success("Conquista adicionada com sucesso!");
    return {
      ...achievement,
      image: imagePath
    };
  } catch (error) {
    console.error("Error adding achievement:", error);
    toast.error("Erro ao adicionar conquista");
    throw error;
  }
};

// Update an existing achievement
export const updateAchievement = async (achievement: Achievement): Promise<Achievement> => {
  try {
    // Check if the image has been changed (is a base64 string)
    let imagePath = achievement.image;
    if (achievement.image.startsWith('data:image')) {
      imagePath = await uploadImageToStorage(achievement.image, achievement.id);
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
    
    // Return the achievement with the updated image path
    toast.success("Conquista atualizada com sucesso!");
    return {
      ...achievement,
      image: imagePath
    };
  } catch (error) {
    console.error("Error updating achievement:", error);
    toast.error("Erro ao atualizar conquista");
    throw error;
  }
};

// Delete an achievement
export const deleteAchievement = async (id: string): Promise<void> => {
  try {
    // Get the achievement first to get the image path
    const { data, error: fetchError } = await supabase
      .from('achievements')
      .select('image_path')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      throw fetchError;
    }
    
    // Delete the image from storage if exists
    if (data?.image_path && !data.image_path.startsWith('/placeholder')) {
      // Extract the file name from the URL
      const url = new URL(data.image_path);
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
    
    toast.success("Conquista removida com sucesso!");
  } catch (error) {
    console.error("Error deleting achievement:", error);
    toast.error("Erro ao remover conquista");
    throw error;
  }
};

// Update just the image of an achievement
export const updateAchievementImage = async (id: string, imageFile: File): Promise<string> => {
  try {
    // Upload the new image to Supabase Storage
    const imagePath = await uploadImageToStorage(imageFile, id);
    
    // Update the achievement in Supabase
    const { error } = await supabase
      .from('achievements')
      .update({ image_path: imagePath })
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    toast.success("Imagem atualizada com sucesso!");
    return imagePath;
  } catch (error) {
    console.error("Error updating image:", error);
    toast.error("Erro ao atualizar imagem");
    throw error;
  }
};
