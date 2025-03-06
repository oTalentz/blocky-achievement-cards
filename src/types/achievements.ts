
import { Achievement as BaseAchievement } from '../data/achievements';

// Extended Achievement type with additional properties
export interface Achievement extends BaseAchievement {}

// Supabase Achievement Row type (matches database schema)
export interface AchievementRow {
  id: string;
  title: string;
  description: string | null;
  requirements: string | null;
  reward: string | null;
  category: string;
  rarity: string;
  image_path: string | null;
  unlocked: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// Achievement context type
export interface AchievementsContextType {
  achievements: Achievement[];
  addAchievement: (achievement: Achievement) => Promise<void>;
  updateAchievement: (achievement: Achievement) => Promise<void>;
  deleteAchievement: (id: string) => Promise<void>;
  updateAchievementImage: (id: string, imageFile: File) => Promise<void>;
}
