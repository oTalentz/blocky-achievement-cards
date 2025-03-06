
import React, { createContext, useContext } from 'react';
import { Achievement } from '../data/achievements';
import { AchievementsContextType } from '../types/achievement.types';
import { useAchievementsStorage } from '../hooks/useAchievementsStorage';
import { useAchievementsSync } from '../hooks/useAchievementsSync';
import { achievementOperations } from '../utils/achievementUtils';

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

export const AchievementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    achievements, 
    setAchievements, 
    pendingChanges, 
    setPendingChanges,
    isInitialLoad,
    loadAchievements
  } = useAchievementsStorage();
  
  // Set up sync mechanisms
  useAchievementsSync({
    achievements,
    setAchievements,
    pendingChanges,
    loadAchievements,
    isInitialLoad
  });

  const addAchievement = (achievement: Achievement) => {
    achievementOperations.addAchievement(achievement, setAchievements, setPendingChanges);
  };

  const updateAchievement = (achievement: Achievement) => {
    achievementOperations.updateAchievement(achievement, setAchievements, setPendingChanges);
  };

  const deleteAchievement = (id: string) => {
    achievementOperations.deleteAchievement(id, setAchievements, setPendingChanges);
  };

  const updateAchievementImage = (id: string, imageUrl: string) => {
    achievementOperations.updateAchievementImage(id, imageUrl, setAchievements, setPendingChanges);
  };
  
  const confirmAllChanges = () => {
    if (pendingChanges) {
      achievementOperations.confirmAllChanges(achievements, setPendingChanges);
    }
  };
  
  const hasPendingChanges = () => pendingChanges;

  return (
    <AchievementsContext.Provider
      value={{
        achievements,
        pendingChanges,
        addAchievement,
        updateAchievement,
        deleteAchievement,
        updateAchievementImage,
        confirmAllChanges,
        hasPendingChanges
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
