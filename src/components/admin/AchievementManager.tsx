
import React from 'react';
import { useAchievements } from '../../contexts/AchievementsContext';
import { PlusCircle } from 'lucide-react';
import { useAchievementForm } from '../../hooks/useAchievementForm';
import AchievementForm from './achievement/AchievementForm';
import AchievementList from './achievement/AchievementList';
import AchievementPreviewModal from './achievement/AchievementPreviewModal';

const AchievementManager: React.FC = () => {
  const { achievements, addAchievement, updateAchievement, deleteAchievement, updateAchievementImage } = useAchievements();
  
  const {
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
  } = useAchievementForm(addAchievement, updateAchievement);

  const handleImageChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Call the context method with the actual file
      updateAchievementImage(id, file);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-pixel">Gerenciar Conquistas</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2"
          disabled={isAdding || isEditing !== null}
        >
          <PlusCircle size={18} />
          Adicionar Nova
        </button>
      </div>
      
      {/* Add/Edit Form */}
      {(isAdding || isEditing) && (
        <AchievementForm
          achievement={newAchievement}
          isEditing={!!isEditing}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          onAchievementChange={handleNewAchievementChange}
          onImageChange={handleNewImageChange}
        />
      )}
      
      {/* Achievements List */}
      <AchievementList
        achievements={achievements}
        onEdit={handleEditAchievement}
        onDelete={deleteAchievement}
        onPreview={handlePreview}
        onImageChange={handleImageChange}
      />
      
      {/* Preview Modal */}
      <AchievementPreviewModal
        achievementId={previewMode}
        achievements={achievements}
        onClose={() => setPreviewMode(null)}
      />
    </div>
  );
};

export default AchievementManager;
