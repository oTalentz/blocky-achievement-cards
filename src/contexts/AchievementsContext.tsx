
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Achievement, achievements as initialAchievements } from '../data/achievements';
import { toast } from "sonner";

type AchievementsContextType = {
  achievements: Achievement[];
  addAchievement: (achievement: Achievement) => void;
  updateAchievement: (achievement: Achievement) => void;
  deleteAchievement: (id: string) => void;
  updateAchievementImage: (id: string, imageFile: File) => void;
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

  // Convert File to base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const addAchievement = (achievement: Achievement) => {
    // Ensure the achievement has a unique ID
    if (!achievement.id || achievements.some(a => a.id === achievement.id)) {
      achievement.id = `achievement-${Date.now()}`;
    }
    
    setAchievements(prev => [...prev, achievement]);
    toast.success("Conquista adicionada com sucesso!");
  };

  const updateAchievement = (achievement: Achievement) => {
    setAchievements(prev => 
      prev.map(a => a.id === achievement.id ? achievement : a)
    );
    toast.success("Conquista atualizada com sucesso!");
  };

  const deleteAchievement = (id: string) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
    toast.success("Conquista removida com sucesso!");
  };

  const updateAchievementImage = async (id: string, imageFile: File) => {
    try {
      // Convert the file to base64
      const base64Image = await fileToBase64(imageFile);
      
      setAchievements(prev => 
        prev.map(a => a.id === id ? { ...a, image: base64Image } : a)
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
