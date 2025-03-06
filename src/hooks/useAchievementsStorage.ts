
import { useState, useEffect, useRef } from 'react';
import { Achievement, achievements as initialAchievements } from '../data/achievements';

export const useAchievementsStorage = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [pendingChanges, setPendingChanges] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const hasDispatchedRef = useRef(false);
  
  // Load achievements from localStorage
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

  return {
    achievements,
    setAchievements,
    pendingChanges,
    setPendingChanges,
    isInitialLoad,
    loadAchievements
  };
};
