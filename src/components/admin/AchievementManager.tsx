import React from 'react';
import { useAchievements } from '../../contexts/AchievementsContext';
import { Achievement } from '../../data/achievements';
import { PlusCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import AchievementForm from './achievement/AchievementForm';
import AchievementList from './achievement/AchievementList';
import AchievementPreviewModal from './achievement/AchievementPreviewModal';
import { useAchievementForm } from '../../hooks/useAchievementForm';

const AchievementManager: React.FC = () => {
  const { 
    achievements, 
    pendingChanges,
    deleteAchievement, 
    updateAchievementImage,
    confirmAllChanges
  } = useAchievements();
  
  const {
    achievement,
    isAdding,
    isEditing,
    startAddNew,
    startEdit,
    handleChange,
    handleSave,
    resetForm
  } = useAchievementForm();
  
  const [previewMode, setPreviewMode] = React.useState<string | null>(null);

  const handleImageChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      updateAchievementImage(id, imageUrl);
    }
  };

  const handlePreview = (achievement: Achievement) => {
    setPreviewMode(achievement.id);
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
            onClick={startAddNew}
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
          achievement={achievement}
          isEditing={!!isEditing}
          onCancel={resetForm}
          onSave={handleSave}
          onAchievementChange={handleChange}
        />
      )}
      
      <AchievementList
        achievements={achievements}
        onEdit={startEdit}
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
