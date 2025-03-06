
import { useEffect } from 'react';
import { Achievement } from '../data/achievements';
import { toast } from 'sonner';

interface UseAchievementsSyncProps {
  achievements: Achievement[];
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
  pendingChanges: boolean;
  loadAchievements: () => void;
  isInitialLoad: boolean;
}

export const useAchievementsSync = ({
  achievements,
  setAchievements,
  pendingChanges,
  loadAchievements,
  isInitialLoad
}: UseAchievementsSyncProps) => {
  // Listen for changes in localStorage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'achievements' && e.newValue && !pendingChanges && !isInitialLoad) {
        try {
          const updatedAchievements = JSON.parse(e.newValue);
          setAchievements(updatedAchievements);
          toast.info("Conquistas atualizadas em tempo real!");
        } catch (error) {
          console.error("Error parsing updated achievements:", error);
        }
      }
    };

    // Custom event handler for cross-window synchronization
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.achievements && !pendingChanges && !isInitialLoad) {
        try {
          const achievementsData = JSON.parse(customEvent.detail.achievements);
          
          // If the event specifies forceImageRefresh, update image URLs with new timestamps
          if (customEvent.detail.forceImageRefresh) {
            const refreshedAchievements = achievementsData.map((achievement: Achievement) => {
              if (achievement.image) {
                // For blob URLs, update the timestamp
                if (achievement.image.startsWith('blob:')) {
                  const baseUrl = achievement.image.split('?')[0];
                  return {
                    ...achievement,
                    image: `${baseUrl}?t=${Date.now()}`
                  };
                }
              }
              return achievement;
            });
            setAchievements(refreshedAchievements);
          } else {
            setAchievements(achievementsData);
          }
          
          toast.info("Conquistas atualizadas em tempo real!");
        } catch (error) {
          console.error("Error handling custom achievement event:", error);
        }
      }
    };

    // Set up polling mechanism to refresh data periodically (silent)
    const intervalId = setInterval(() => {
      if (!pendingChanges && !isInitialLoad) {
        loadAchievements();
      }
    }, 5000);

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('achievements-updated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('achievements-updated', handleCustomEvent);
      clearInterval(intervalId);
    };
  }, [pendingChanges, isInitialLoad, setAchievements, loadAchievements]);
};
