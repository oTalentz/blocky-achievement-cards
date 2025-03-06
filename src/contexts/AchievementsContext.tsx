
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Achievement, achievements as initialAchievements } from '../data/achievements';
import { toast } from "sonner";

type AchievementsContextType = {
  achievements: Achievement[];
  addAchievement: (achievement: Achievement) => void;
  updateAchievement: (achievement: Achievement) => void;
  deleteAchievement: (id: string) => void;
  updateAchievementImage: (id: string, imageUrl: string) => void;
};

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

export const AchievementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    // Load achievements from localStorage or use the initial data
    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
      try {
        setAchievements(JSON.parse(savedAchievements));
      } catch (error) {
        console.error("Error parsing achievements from localStorage:", error);
        setAchievements(initialAchievements);
      }
    } else {
      setAchievements(initialAchievements);
    }
  }, []);

  // Save to localStorage whenever achievements change
  useEffect(() => {
    if (achievements.length > 0) {
      localStorage.setItem('achievements', JSON.stringify(achievements));
    }
  }, [achievements]);

  const addAchievement = (achievement: Achievement) => {
    // Ensure the achievement has a unique ID
    if (!achievement.id || achievements.some(a => a.id === achievement.id)) {
      achievement.id = `achievement-${Date.now()}`;
    }
    
    // If the image is a blob URL, we should use a placeholder instead
    if (achievement.image && achievement.image.startsWith('blob:')) {
      achievement.image = '/placeholder.svg';
    }
    
    setAchievements(prev => [...prev, achievement]);
    toast.success("Conquista adicionada com sucesso!");
  };

  const updateAchievement = (achievement: Achievement) => {
    // Check if image is a blob URL and replace with placeholder if needed
    if (achievement.image && achievement.image.startsWith('blob:')) {
      achievement.image = '/placeholder.svg';
    }
    
    setAchievements(prev => 
      prev.map(a => a.id === achievement.id ? achievement : a)
    );
    toast.success("Conquista atualizada com sucesso!");
  };

  const deleteAchievement = (id: string) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
    toast.success("Conquista removida com sucesso!");
  };

  const updateAchievementImage = (id: string, imageUrl: string) => {
    // Instead of using blob URLs directly, use the placeholder
    const finalImageUrl = imageUrl.startsWith('blob:') ? '/placeholder.svg' : imageUrl;
    
    setAchievements(prev => 
      prev.map(a => a.id === id ? { ...a, image: finalImageUrl } : a)
    );
    toast.success("Imagem atualizada com sucesso!");
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
