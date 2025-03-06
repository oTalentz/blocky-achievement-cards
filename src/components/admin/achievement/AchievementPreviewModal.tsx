
import React from 'react';
import { Achievement, categories, rarities } from '../../../data/achievements';
import { X } from 'lucide-react';

interface AchievementPreviewModalProps {
  previewId: string | null;
  achievements: Achievement[];
  onClose: () => void;
}

const AchievementPreviewModal: React.FC<AchievementPreviewModalProps> = ({
  previewId,
  achievements,
  onClose
}) => {
  if (!previewId) return null;
  
  const achievement = achievements.find(a => a.id === previewId);
  if (!achievement) return null;
  
  const rarityData = rarities.find(r => r.id === achievement.rarity);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 p-4">
      <div className="bg-card rounded-lg max-w-md w-full overflow-hidden relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1 rounded-full bg-background/80 z-10 hover:bg-destructive/20 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div>
          <div className={`h-40 relative bg-gradient-to-br ${rarityData?.color}`}>
            <img 
              src={achievement.image} 
              alt={achievement.title}
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-white text-3xl font-pixel drop-shadow-md">{achievement.title}</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs font-medium px-2 py-1 rounded ${rarityData?.color} text-white`}>
                  {rarityData?.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {categories.find(c => c.id === achievement.category)?.name}
                </span>
              </div>
              <p className="text-sm">{achievement.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-pixel text-sm text-minecraft-gold mb-1">Requisitos:</h4>
                <p className="text-xs text-muted-foreground">{achievement.requirements}</p>
              </div>
              
              <div>
                <h4 className="font-pixel text-sm text-minecraft-emerald mb-1">Recompensa:</h4>
                <p className="text-xs text-muted-foreground">{achievement.reward}</p>
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <button 
                onClick={onClose}
                className="minecraft-btn text-sm py-1.5 px-6 bg-muted hover:bg-muted/80 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementPreviewModal;
