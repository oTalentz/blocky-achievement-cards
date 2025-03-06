
import React, { useState } from 'react';
import { useAchievements } from '../../contexts/AchievementsContext';
import { Achievement } from '../../data/achievements';
import { PlusCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import AchievementForm from './achievement/AchievementForm';
import AchievementList from './achievement/AchievementList';
import AchievementPreviewModal from './achievement/AchievementPreviewModal';

const AchievementManager: React.FC = () => {
  const { 
    achievements, 
    pendingChanges,
    addAchievement, 
    updateAchievement, 
    deleteAchievement, 
    updateAchievementImage,
    confirmAllChanges
  } = useAchievements();
  
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<string | null>(null);
  
  const [newAchievement, setNewAchievement] = useState<Achievement>({
    id: '',
    title: '',
    description: '',
    rarity: 'common',
    category: 'building',
    image: '/placeholder.svg',
    requirements: '',
    reward: '',
    unlocked: false
  });

  const handleImageChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      updateAchievementImage(id, imageUrl);
    }
  };

  const handleNewAchievementChange = (field: keyof Achievement, value: any) => {
    setNewAchievement(prev => ({ ...prev, [field]: value }));
  };

  const handleEditAchievement = (achievement: Achievement) => {
    setIsEditing(achievement.id);
    setNewAchievement(achievement);
  };

  const handleSaveEdit = () => {
    if (isEditing) {
      updateAchievement(newAchievement);
      setIsEditing(null);
    } else {
      if (!newAchievement.title || !newAchievement.description) {
        toast.error("Preencha os campos obrigatórios");
        return;
      }
      
      if (!newAchievement.id) {
        newAchievement.id = `achievement-${Date.now()}`;
      }
      
      addAchievement(newAchievement);
      
      setNewAchievement({
        id: '',
        title: '',
        description: '',
        rarity: 'common',
        category: 'building',
        image: '/placeholder.svg',
        requirements: '',
        reward: '',
        unlocked: false
      });
      
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
  
  const handleConfirmAllChanges = () => {
    confirmAllChanges();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-pixel">Gerenciar Conquistas</h2>
        <div className="flex gap-3">
          {pendingChanges && (
            <button
              onClick={handleConfirmAllChanges}
              className="bg-emerald-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <CheckCircle2 size={18} />
              Confirmar Alterações
            </button>
          )}
          <button
            onClick={() => setIsAdding(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2"
            disabled={isAdding || isEditing !== null}
          >
            <PlusCircle size={18} />
            Adicionar Nova
          </button>
        </div>
      </div>
      
      {pendingChanges && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4 mb-6 flex items-center gap-3">
          <AlertTriangle size={20} className="text-amber-500" />
          <p>
            Você tem alterações pendentes que ainda não foram publicadas. 
            Clique em "Confirmar Alterações" para torná-las visíveis para todos os usuários.
          </p>
        </div>
      )}
      
      {(isAdding || isEditing) && (
        <AchievementForm
          achievement={newAchievement}
          isEditing={!!isEditing}
          onCancel={handleCancelEdit}
          onSave={handleSaveEdit}
          onAchievementChange={handleNewAchievementChange}
        />
      )}
      
      <AchievementList
        achievements={achievements}
        onEdit={handleEditAchievement}
        onDelete={deleteAchievement}
        onPreview={handlePreview}
        onImageChange={handleImageChange}
      />
      
      <AchievementPreviewModal
        previewId={previewMode}
        achievements={achievements}
        onClose={() => setPreviewMode(null)}
      />
    </div>
  );
};

export default AchievementManager;
