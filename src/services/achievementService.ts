
import { supabase } from "../integrations/supabase/client";
import { Achievement } from "../data/achievements";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { processAndUploadImage } from "../utils/achievementUtils";

export const addAchievementService = async (achievement: Achievement): Promise<Achievement | null> => {
  try {
    // Generate a proper UUID
    const generatedId = uuidv4();
    
    // Process and upload the image if it's a base64 string
    const imagePath = await processAndUploadImage(achievement.image, generatedId);
    
    // Save to Supabase with the generated UUID
    const { error } = await supabase
      .from('achievements')
      .insert({
        id: generatedId,
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
      console.error("Error adding achievement:", error);
      toast.error("Erro ao adicionar conquista", { duration: 2000 });
      return null;
    }
    
    // Return the new achievement with the stored image path and generated ID
    const newAchievement = {
      ...achievement,
      id: generatedId,
      image: imagePath
    };
    
    toast.success("Conquista adicionada com sucesso!", { duration: 2000 });
    return newAchievement;
  } catch (error) {
    console.error("Error adding achievement:", error);
    toast.error("Erro ao adicionar conquista", { duration: 2000 });
    return null;
  }
};

export const updateAchievementService = async (achievement: Achievement): Promise<Achievement | null> => {
  try {
    // Process and upload the image if it's a base64 string
    const imagePath = await processAndUploadImage(achievement.image, achievement.id);
    
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
      console.error("Error updating achievement:", error);
      toast.error("Erro ao atualizar conquista", { duration: 2000 });
      return null;
    }
    
    // Return the updated achievement with the stored image path
    const updatedAchievement = {
      ...achievement,
      image: imagePath
    };
    
    toast.success("Conquista atualizada com sucesso!", { duration: 2000 });
    return updatedAchievement;
  } catch (error) {
    console.error("Error updating achievement:", error);
    toast.error("Erro ao atualizar conquista", { duration: 2000 });
    return null;
  }
};

export const deleteAchievementService = async (id: string, currentImage: string | null): Promise<boolean> => {
  try {
    // Delete the image from storage if it exists and is not the placeholder
    if (currentImage && !currentImage.startsWith('/placeholder')) {
      try {
        // Extract the file name from the URL
        const url = new URL(currentImage);
        const filePath = url.pathname.split('/').pop();
        
        if (filePath) {
          // Delete from storage
          const { error: storageError } = await supabase.storage
            .from('images')
            .remove([filePath]);
            
          if (storageError) {
            console.error("Error deleting image from storage:", storageError);
            // Continue with database deletion even if storage deletion fails
          }
        }
      } catch (imageError) {
        console.error("Error processing image URL:", imageError);
        // Continue with database deletion
      }
    }
    
    // Delete from Supabase
    const { error } = await supabase
      .from('achievements')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting achievement:", error);
      toast.error("Erro ao remover conquista", { duration: 2000 });
      return false;
    }
    
    toast.success("Conquista removida com sucesso!", { duration: 2000 });
    return true;
  } catch (error) {
    console.error("Error deleting achievement:", error);
    toast.error("Erro ao remover conquista", { duration: 2000 });
    return false;
  }
};

export const updateAchievementImageService = async (id: string, imageFile: File): Promise<string | null> => {
  try {
    // Upload the new image to Supabase Storage
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `achievement-${id}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, imageFile, { upsert: true });
    
    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      toast.error("Erro ao atualizar imagem", { duration: 2000 });
      return null;
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
      console.error("Error updating achievement image:", error);
      toast.error("Erro ao atualizar imagem na conquista", { duration: 2000 });
      return null;
    }
    
    toast.success("Imagem atualizada com sucesso!", { duration: 2000 });
    return publicUrl;
  } catch (error) {
    console.error("Error updating image:", error);
    toast.error("Erro ao atualizar imagem", { duration: 2000 });
    return null;
  }
};
