import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const hasDispatchedRef = useRef(false);
  
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'achievements' && e.newValue) {
        try {
          const parsedAchievements = JSON.parse(e.newValue);
          setAchievements(parsedAchievements);
          
          if (document.hasFocus() && !isInitialLoad) {
            toast.info("Conquistas atualizadas em tempo real!");
          }
        } catch (error) {
          console.error("Error parsing achievements from storage event:", error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isInitialLoad]);

  useEffect(() => {
    try {
      const savedAchievements = localStorage.getItem('achievements');
      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements));
      } else {
        setAchievements(initialAchievements);
      }
    } catch (error) {
      console.error("Error loading initial achievements:", error);
      setAchievements(initialAchievements);
    }
    
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isInitialLoad) return;
    
    try {
      if (achievements.length > 0) {
        localStorage.setItem('achievements', JSON.stringify(achievements));
        
        if (!pendingChanges && !hasDispatchedRef.current) {
          hasDispatchedRef.current = true;
          
          setTimeout(() => {
            const event = new StorageEvent('storage', {
              key: 'achievements',
              newValue: JSON.stringify(achievements)
            });
            window.dispatchEvent(event);
            hasDispatchedRef.current = false;
          }, 100);
        }
      }
    } catch (error) {
      console.error("Error saving achievements to localStorage:", error);
    }
  }, [achievements, pendingChanges, isInitialLoad]);

  const addAchievement = (achievement: Achievement) => {
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
      
      try {
        localStorage.setItem('achievements', JSON.stringify(achievements));
        
        setTimeout(() => {
          const event = new StorageEvent('storage', {
            key: 'achievements',
            newValue: JSON.stringify(achievements)
          });
          window.dispatchEvent(event);
        }, 300);
        
        toast.success("Todas as alterações foram confirmadas e publicadas!");
      } catch (error) {
        console.error("Error confirming changes:", error);
        toast.error("Erro ao confirmar alterações. Tente novamente.");
      }
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
