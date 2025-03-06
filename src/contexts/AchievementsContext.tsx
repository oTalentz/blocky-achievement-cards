
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
  const pollingIntervalRef = useRef<number | null>(null);
  
  // Function to load achievements from localStorage
  const loadAchievements = () => {
    try {
      const savedAchievements = localStorage.getItem('achievements');
      if (savedAchievements) {
        const parsedAchievements = JSON.parse(savedAchievements);
        // Only update if there's a difference to avoid unnecessary re-renders
        if (JSON.stringify(parsedAchievements) !== JSON.stringify(achievements)) {
          setAchievements(parsedAchievements);
        }
      }
    } catch (error) {
      console.error("Error loading achievements in polling:", error);
    }
  };
  
  // Set up polling for real-time updates
  useEffect(() => {
    // Only start polling after initial load is complete
    if (!isInitialLoad) {
      // Clear any existing interval first
      if (pollingIntervalRef.current) {
        window.clearInterval(pollingIntervalRef.current);
      }
      
      // Set new interval
      pollingIntervalRef.current = window.setInterval(() => {
        // Don't poll if there are pending changes to avoid overwriting user edits
        if (!pendingChanges) {
          loadAchievements();
        }
      }, 5000); // Poll every 5 seconds
    }
    
    return () => {
      if (pollingIntervalRef.current) {
        window.clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isInitialLoad, pendingChanges, achievements]);
  
  // Listen for storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'achievements' && e.newValue) {
        try {
          const parsedAchievements = JSON.parse(e.newValue);
          setAchievements(parsedAchievements);
          // No notifications per user request
        } catch (error) {
          console.error("Error parsing achievements from storage event:", error);
        }
      }
    };
    
    // Listen for custom achievement updated events from other windows
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.achievements) {
        try {
          const parsedAchievements = JSON.parse(customEvent.detail.achievements);
          setAchievements(parsedAchievements);
        } catch (error) {
          console.error("Error parsing achievements from custom event:", error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('achievements-updated', handleCustomEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('achievements-updated', handleCustomEvent);
    };
  }, []);

  // Initial load effect
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

  // Storage sync effect
  useEffect(() => {
    if (isInitialLoad) return;
    
    try {
      if (achievements.length > 0) {
        localStorage.setItem('achievements', JSON.stringify(achievements));
        
        // Only trigger storage event when changes are confirmed or no pending changes exist
        if (!pendingChanges && !hasDispatchedRef.current) {
          hasDispatchedRef.current = true;
          
          // Broadcast storage event to other tabs
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
        
        // Immediately broadcast updates to all tabs and windows
        const achievementsJSON = JSON.stringify(achievements);
        
        // 1. Update localStorage and dispatch storage event for same-origin tabs
        localStorage.setItem('achievements', achievementsJSON);
        
        // 2. Dispatch custom storage event to ensure all tabs receive it
        const storageEvent = new StorageEvent('storage', {
          key: 'achievements',
          newValue: achievementsJSON
        });
        window.dispatchEvent(storageEvent);
        
        // 3. Also trigger a custom event that can be caught by other windows
        const customEvent = new CustomEvent('achievements-updated', { 
          detail: { achievements: achievementsJSON }
        });
        window.dispatchEvent(customEvent);
        
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
