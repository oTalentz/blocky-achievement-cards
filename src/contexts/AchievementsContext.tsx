
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Achievement, achievements as initialAchievements } from '../data/achievements';
import { AchievementsContextType } from '../types/achievements';
import { fetchAchievements } from '../utils/achievementUtils';
import { 
  addAchievementService, 
  updateAchievementService, 
  deleteAchievementService, 
  updateAchievementImageService 
} from '../services/achievementService';

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

export const AchievementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch achievements from Supabase
    const loadAchievements = async () => {
      const data = await fetchAchievements(initialAchievements);
      setAchievements(data);
      setIsLoading(false);
    };

    loadAchievements();
  }, []);

  const addAchievement = async (achievement: Achievement) => {
    const newAchievement = await addAchievementService(achievement);
    if (newAchievement) {
      setAchievements(prev => [...prev, newAchievement]);
    }
  };

  const updateAchievement = async (achievement: Achievement) => {
    const updatedAchievement = await updateAchievementService(achievement);
    if (updatedAchievement) {
      setAchievements(prev => 
        prev.map(a => a.id === achievement.id ? updatedAchievement : a)
      );
    }
  };

  const deleteAchievement = async (id: string) => {
    // Find the achievement to get its image path
    const achievement = achievements.find(a => a.id === id);
    const success = await deleteAchievementService(id, achievement?.image || null);
    
    if (success) {
      setAchievements(prev => prev.filter(a => a.id !== id));
    }
  };

  const updateAchievementImage = async (id: string, imageFile: File) => {
    const newImageUrl = await updateAchievementImageService(id, imageFile);
    
    if (newImageUrl) {
      setAchievements(prev => 
        prev.map(a => a.id === id ? { ...a, image: newImageUrl } : a)
      );
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
