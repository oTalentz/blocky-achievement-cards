
import { supabase } from "../integrations/supabase/client";
import { Achievement } from '../types/achievements';
import { toast } from "sonner";

// Convert File to base64 string
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Map database row to Achievement type
export const mapDbRowToAchievement = (item: any): Achievement => ({
  id: item.id,
  title: item.title,
  description: item.description || '',
  requirements: item.requirements || '',
  reward: item.reward || '',
  // Cast the category to the correct type using type assertion
  category: item.category as "building" | "redstone" | "decoration" | "landscape" | "megaproject",
  // Cast the rarity to the correct type using type assertion
  rarity: item.rarity as "common" | "uncommon" | "rare" | "epic" | "legendary",
  image: item.image_path || '/placeholder.svg',
  unlocked: item.unlocked || false
});

// Upload image to Supabase Storage
export const uploadImageToStorage = async (imageData: string | File, achievementId: string): Promise<string> => {
  try {
    let file: File;
    
    if (typeof imageData === 'string' && imageData.startsWith('data:image')) {
      // Convert base64 to file
      const response = await fetch(imageData);
      const blob = await response.blob();
      file = new File([blob], `achievement-${achievementId}.png`, { type: 'image/png' });
    } else if (imageData instanceof File) {
      file = imageData;
    } else {
      // If it's not a base64 string or a File, return the original image data
      return imageData as string;
    }
    
    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `achievement-${achievementId}.${fileExt}`;
    
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
    
    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    toast.error("Erro ao fazer upload da imagem");
    throw error;
  }
};
