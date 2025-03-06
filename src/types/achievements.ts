
import { Achievement } from '../data/achievements';

export type AchievementsContextType = {
  achievements: Achievement[];
  addAchievement: (achievement: Achievement) => Promise<void>;
  updateAchievement: (achievement: Achievement) => Promise<void>;
  deleteAchievement: (id: string) => Promise<void>;
  updateAchievementImage: (id: string, imageFile: File) => Promise<void>;
};
