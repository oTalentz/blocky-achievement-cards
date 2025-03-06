
import { v4 as uuidv4 } from 'uuid';
import { Achievement } from '../data/achievements';
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";

export const fetchAchievements = async (
  initialAchievements: Achievement[]
): Promise<Achievement[]> => {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*');

    if (error) {
      console.error("Error fetching achievements:", error);
      // Fallback to initial data if database fetch fails
      return initialAchievements;
    }

    if (data && data.length > 0) {
      // Map the database data to our Achievement type, ensuring rarity and category are of the correct type
      const mappedAchievements: Achievement[] = data.map(item => ({
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
      }));
      return mappedAchievements;
    } else {
      // If no data in database, use initial data and insert it
      try {
        for (const achievement of initialAchievements) {
          // Create proper UUID for each achievement instead of using string IDs
          const generatedId = uuidv4();
          
          await supabase.from('achievements').insert({
            id: generatedId,
            title: achievement.title,
            description: achievement.description,
            requirements: achievement.requirements,
            reward: achievement.reward,
            category: achievement.category,
            rarity: achievement.rarity,
            image_path: achievement.image,
            unlocked: achievement.unlocked || false
          });
          
          // Update the achievement ID to the generated UUID
          achievement.id = generatedId;
        }
        return initialAchievements;
      } catch (insertError) {
        console.error("Error inserting initial achievements:", insertError);
        return initialAchievements;
      }
    }
  } catch (error) {
    console.error("Error loading achievements:", error);
    return initialAchievements;
  }
};

export const processAndUploadImage = async (
  imageData: string,
  id: string
): Promise<string> => {
  // If the image is not a base64 string, return it as is
  if (!imageData.startsWith('data:image')) {
    return imageData;
  }

  try {
    // Convert base64 to a file
    const response = await fetch(imageData);
    const blob = await response.blob();
    const file = new File([blob], `achievement-${id}.png`, { type: 'image/png' });
    
    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `achievement-${id}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, file, { upsert: true });
    
    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      toast.error("Erro ao fazer upload da imagem", { duration: 2000 });
      return imageData; // Return original on error
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);
    
    return publicUrl;
  } catch (error) {
    console.error("Error processing image:", error);
    return imageData; // Return original on error
  }
};
