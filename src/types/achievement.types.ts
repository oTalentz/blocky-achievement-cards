
import { Achievement } from '../data/achievements';

export type AchievementsContextType = {
  achievements: Achievement[];
  pendingChanges: boolean;
  addAchievement: (achievement: Achievement) => void;
  updateAchievement: (achievement: Achievement) => void;
  deleteAchievement: (id: string) => void;
  updateAchievementImage: (id: string, imageUrl: string) => void;
  confirmAllChanges: () => void;
  hasPendingChanges: () => boolean;
};
