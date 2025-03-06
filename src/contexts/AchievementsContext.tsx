
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Achievement } from '../types/achievements';
import { AchievementsContextType } from '../types/achievements';
import * as achievementService from '../services/achievementService';

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

export const AchievementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const loadedAchievements = await achievementService.fetchAchievements();
        setAchievements(loadedAchievements);
      } catch (error) {
        console.error("Error in achievements context:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAchievements();
  }, []);

  const addAchievement = async (achievement: Achievement) => {
    try {
      const newAchievement = await achievementService.addAchievement(achievement);
      setAchievements(prev => [...prev, newAchievement]);
    } catch (error) {
      console.error("Error adding achievement:", error);
    }
  };

  const updateAchievement = async (achievement: Achievement) => {
    try {
      const updatedAchievement = await achievementService.updateAchievement(achievement);
      setAchievements(prev => 
        prev.map(a => a.id === achievement.id ? updatedAchievement : a)
      );
    } catch (error) {
      console.error("Error updating achievement:", error);
    }
  };

  const deleteAchievement = async (id: string) => {
    try {
      await achievementService.deleteAchievement(id);
      setAchievements(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error deleting achievement:", error);
    }
  };

  const updateAchievementImage = async (id: string, imageFile: File) => {
    try {
      const newImageUrl = await achievementService.updateAchievementImage(id, imageFile);
      setAchievements(prev => 
        prev.map(a => a.id === id ? { ...a, image: newImageUrl } : a)
      );
    } catch (error) {
      console.error("Error updating achievement image:", error);
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
