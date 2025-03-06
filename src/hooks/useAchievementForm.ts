
import { useState } from 'react';
import { Achievement } from '../data/achievements';
import { toast } from 'sonner';
import { useAchievements } from '../contexts/AchievementsContext';

const initialAchievement: Achievement = {
  id: '',
  title: '',
  description: '',
  rarity: 'common',
  category: 'building',
  image: '/placeholder.svg',
  requirements: '',
  reward: '',
  unlocked: false
};

export const useAchievementForm = () => {
  const { addAchievement, updateAchievement } = useAchievements();
  const [achievement, setAchievement] = useState<Achievement>({...initialAchievement});
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  const resetForm = () => {
    setAchievement({...initialAchievement});
    setIsAdding(false);
    setIsEditing(null);
  };
  
  const startAddNew = () => {
    resetForm();
    setIsAdding(true);
  };
  
  const startEdit = (achievementToEdit: Achievement) => {
    setAchievement(achievementToEdit);
    setIsEditing(achievementToEdit.id);
    setIsAdding(false);
  };
  
  const handleChange = (field: keyof Achievement, value: any) => {
    setAchievement(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = () => {
    if (!achievement.title || !achievement.description) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    
    if (isEditing) {
      updateAchievement(achievement);
    } else {
      if (!achievement.id) {
        achievement.id = `achievement-${Date.now()}`;
      }
      addAchievement(achievement);
    }
    
    resetForm();
  };
  
  return {
    achievement,
    isAdding,
    isEditing,
    startAddNew,
    startEdit,
    handleChange,
    handleSave,
    resetForm
  };
};
