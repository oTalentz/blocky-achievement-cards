
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Achievement, achievements as initialAchievements } from '../data/achievements';
import { toast } from "sonner";

type AchievementsContextType = {
  achievements: Achievement[];
  pendingChanges: boolean;
  addAchievement: (achievement: Achievement) => void;
  updateAchievement: (achievement: Achievement) => void;
  deleteAchievement: (id: string) => void;
  updateAchievementImage: (id: string, imageUrl: string) => void;
  confirmAllChanges: () => void;
  hasPendingChanges: () => boolean;
};

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

export const AchievementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [pendingChanges, setPendingChanges] = useState(false);
  
  // Setup event listener for storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'achievements' && e.newValue) {
        setAchievements(JSON.parse(e.newValue));
        toast.info("Conquistas atualizadas em tempo real!");
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    // Load achievements from localStorage or use the initial data
    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    } else {
      setAchievements(initialAchievements);
    }
  }, []);

  // Save to localStorage whenever achievements change and there are confirmed changes
  useEffect(() => {
    if (achievements.length > 0) {
      localStorage.setItem('achievements', JSON.stringify(achievements));
      
      // Broadcast the change to other tabs/windows
      if (!pendingChanges) {
        const event = new StorageEvent('storage', {
          key: 'achievements',
          newValue: JSON.stringify(achievements)
        });
        window.dispatchEvent(event);
      }
    }
  }, [achievements, pendingChanges]);

  const addAchievement = (achievement: Achievement) => {
    // Ensure the achievement has a unique ID
    if (!achievement.id || achievements.some(a => a.id === achievement.id)) {
      achievement.id = `achievement-${Date.now()}`;
    }
    
    setAchievements(prev => [...prev, achievement]);
    setPendingChanges(true);
    toast.success("Conquista adicionada! Lembre-se de confirmar as alterações.");
  };

  const updateAchievement = (achievement: Achievement) => {
    setAchievements(prev => 
      prev.map(a => a.id === achievement.id ? achievement : a)
    );
    setPendingChanges(true);
    toast.success("Conquista atualizada! Lembre-se de confirmar as alterações.");
  };

  const deleteAchievement = (id: string) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
    setPendingChanges(true);
    toast.success("Conquista removida! Lembre-se de confirmar as alterações.");
  };

  const updateAchievementImage = (id: string, imageUrl: string) => {
    setAchievements(prev => 
      prev.map(a => a.id === id ? { ...a, image: imageUrl } : a)
    );
    setPendingChanges(true);
    toast.success("Imagem atualizada! Lembre-se de confirmar as alterações.");
  };
  
  const confirmAllChanges = () => {
    if (pendingChanges) {
      setPendingChanges(false);
      
      // Force a localStorage update to trigger the storage event for other tabs
      localStorage.setItem('achievements', JSON.stringify(achievements));
      
      // Manually trigger the storage event for the current tab
      const event = new StorageEvent('storage', {
        key: 'achievements',
        newValue: JSON.stringify(achievements)
      });
      window.dispatchEvent(event);
      
      toast.success("Todas as alterações foram confirmadas e publicadas!");
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
