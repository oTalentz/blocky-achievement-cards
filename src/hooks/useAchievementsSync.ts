
import { useEffect, useRef } from 'react';
import { Achievement } from '../data/achievements';

type SyncProps = {
  achievements: Achievement[];
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
  pendingChanges: boolean;
  loadAchievements: () => void;
  isInitialLoad: boolean;
};

export const useAchievementsSync = ({ 
  achievements, 
  setAchievements,
  pendingChanges,
  loadAchievements,
  isInitialLoad
}: SyncProps) => {
  const pollingIntervalRef = useRef<number | null>(null);
  
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
  }, [isInitialLoad, pendingChanges, achievements, loadAchievements]);
  
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
  }, [setAchievements]);
};
