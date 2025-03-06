
import React from 'react';
import { Achievement, categories, rarities } from '../../../data/achievements';
import { Save, X, ImageIcon } from 'lucide-react';

interface AchievementFormProps {
  achievement: Achievement;
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onAchievementChange: (field: keyof Achievement, value: any) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AchievementForm: React.FC<AchievementFormProps> = ({
  achievement,
  isEditing,
  onSave,
  onCancel,
  onAchievementChange,
  onImageChange
}) => {
  return (
    <div className="mb-8 bg-muted/30 rounded-lg p-6 border border-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {isEditing ? "Editar Conquista" : "Adicionar Nova Conquista"}
        </h3>
        <button onClick={onCancel} className="text-muted-foreground hover:text-destructive">
          <X size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              type="text"
              value={achievement.title}
              onChange={(e) => onAchievementChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md"
              placeholder="Título da conquista"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              value={achievement.description}
              onChange={(e) => onAchievementChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md resize-none"
              rows={3}
              placeholder="Descrição da conquista"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Categoria</label>
              <select
                value={achievement.category}
                onChange={(e) => onAchievementChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md"
              >
                {categories.filter(cat => cat.id !== 'all').map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Raridade</label>
              <select
                value={achievement.rarity}
                onChange={(e) => onAchievementChange('rarity', e.target.value as any)}
                className="w-full px-3 py-2 border border-border rounded-md"
              >
                {rarities.map(rarity => (
                  <option key={rarity.id} value={rarity.id}>
                    {rarity.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Requisitos</label>
            <textarea
              value={achievement.requirements}
              onChange={(e) => onAchievementChange('requirements', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md resize-none"
              rows={2}
              placeholder="O que é necessário para desbloquear"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Recompensa</label>
            <textarea
              value={achievement.reward}
              onChange={(e) => onAchievementChange('reward', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md resize-none"
              rows={2}
              placeholder="O que o jogador ganha ao desbloquear"
            />
          </div>
          
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={achievement.unlocked || false}
                onChange={(e) => onAchievementChange('unlocked', e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary/20"
              />
              <span>Desbloqueada</span>
            </label>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Imagem</label>
            <div className="border border-border rounded-md overflow-hidden">
              <div className="aspect-square bg-muted relative overflow-hidden">
                <img 
                  src={achievement.image}
                  alt={achievement.title || "Nova conquista"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>
              <div className="p-3">
                <label className="flex items-center justify-center gap-2 cursor-pointer bg-muted hover:bg-muted/80 transition-colors text-sm font-medium py-2 px-4 rounded-md w-full">
                  <ImageIcon size={16} />
                  <span>Alterar imagem</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={onImageChange}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 mt-4">
        <button 
          onClick={onCancel}
          className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
        >
          Cancelar
        </button>
        <button 
          onClick={onSave}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Save size={18} />
          Salvar
        </button>
      </div>
    </div>
  );
};

export default AchievementForm;
