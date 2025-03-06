
import { useState } from 'react';
import { Achievement } from '../data/achievements';
import { toast } from 'sonner';

const defaultAchievement: Achievement = {
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

export const useAchievementForm = (addAchievement: (achievement: Achievement) => void, updateAchievement: (achievement: Achievement) => void) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<string | null>(null);
  const [newAchievement, setNewAchievement] = useState<Achievement>({...defaultAchievement});

  const handleNewAchievementChange = (field: keyof Achievement, value: any) => {
    setNewAchievement(prev => ({ ...prev, [field]: value }));
  };

  const handleEditAchievement = (achievement: Achievement) => {
    setIsEditing(achievement.id);
    setNewAchievement(achievement);
  };

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For new achievements, we'll need to read the file and set it to preview in the form
      const reader = new FileReader();
      reader.onload = () => {
        handleNewAchievementChange('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = () => {
    if (isEditing) {
      updateAchievement(newAchievement);
      setIsEditing(null);
    } else {
      // Validate before saving
      if (!newAchievement.title || !newAchievement.description) {
        toast.error("Preencha os campos obrigatórios");
        return;
      }
      
      // Generate ID if empty
      if (!newAchievement.id) {
        newAchievement.id = `achievement-${Date.now()}`;
      }
      
      addAchievement(newAchievement);
      
      // Reset form for next achievement
      setNewAchievement({...defaultAchievement});
      
      setIsAdding(false);
    }
  };

  const handlePreview = (achievement: Achievement) => {
    setPreviewMode(achievement.id);
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setIsAdding(false);
    setPreviewMode(null);
  };

  return {
    isAdding,
    setIsAdding,
    isEditing,
    previewMode,
    newAchievement,
    handleNewAchievementChange,
    handleEditAchievement,
    handleNewImageChange,
    handleSaveEdit,
    handlePreview,
    handleCancelEdit,
    setPreviewMode
  };
};
