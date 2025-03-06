
import { Achievement } from '../data/achievements';
import { toast } from "sonner";

export const achievementOperations = {
  addAchievement: (
    achievement: Achievement,
    setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>,
    setPendingChanges: (value: boolean) => void
  ) => {
    if (!achievement.id || achievement.id === '') {
      achievement.id = `achievement-${Date.now()}`;
    }
    
    setAchievements(prev => [...prev, achievement]);
    setPendingChanges(true);
    toast.success("Conquista adicionada! Lembre-se de confirmar as alterações.");
  },

  updateAchievement: (
    achievement: Achievement,
    setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>,
    setPendingChanges: (value: boolean) => void
  ) => {
    setAchievements(prev => 
      prev.map(a => a.id === achievement.id ? achievement : a)
    );
    setPendingChanges(true);
    toast.success("Conquista atualizada! Lembre-se de confirmar as alterações.");
  },

  deleteAchievement: (
    id: string,
    setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>,
    setPendingChanges: (value: boolean) => void
  ) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
    setPendingChanges(true);
    toast.success("Conquista removida! Lembre-se de confirmar as alterações.");
  },

  updateAchievementImage: (
    id: string,
    imageUrl: string,
    setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>,
    setPendingChanges: (value: boolean) => void
  ) => {
    setAchievements(prev => 
      prev.map(a => a.id === id ? { ...a, image: imageUrl } : a)
    );
    setPendingChanges(true);
    toast.success("Imagem atualizada! Lembre-se de confirmar as alterações.");
  },
  
  confirmAllChanges: (
    achievements: Achievement[],
    setPendingChanges: (value: boolean) => void
  ) => {
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
