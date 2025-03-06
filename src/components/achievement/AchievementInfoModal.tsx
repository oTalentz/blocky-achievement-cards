
import React from 'react';
import { X, Trophy, Lock, Info } from 'lucide-react';
import { Achievement, rarities, categories } from '../../data/achievements';
import { useToast } from "../../hooks/use-toast";

interface AchievementInfoModalProps {
  achievement: Achievement;
  isOpen: boolean;
  onClose: () => void;
}

const AchievementInfoModal: React.FC<AchievementInfoModalProps> = ({
  achievement,
  isOpen,
  onClose
}) => {
  const { toast } = useToast();
  
  if (!isOpen) return null;
  
  const { title, description, rarity, category, requirements, reward, unlocked } = achievement;
  const rarityData = rarities.find(r => r.id === rarity);
  const categoryData = categories.find(c => c.id === category);

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative max-w-md w-full bg-card rounded-xl overflow-hidden animate-scale-up achievement-card-content border-2 border-black"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="p-5">
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 bg-muted text-foreground p-1 rounded-full hover:bg-muted/80 transition-colors z-10"
          >
            <X size={20} />
          </button>
          
          <h3 className="font-pixel text-2xl font-bold mb-4 text-center">
            Informações da Conquista
          </h3>
          
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg achievement-image-container">
              <h4 className="font-pixel text-sm mb-1">Título:</h4>
              <p className="font-medium">{title}</p>
            </div>
            
            <div className="bg-muted p-3 rounded-lg achievement-image-container">
              <h4 className="font-pixel text-sm mb-1">Descrição:</h4>
              <p className="text-sm">{description}</p>
            </div>
            
            <div className="bg-muted p-3 rounded-lg achievement-image-container">
              <h4 className="font-pixel text-sm mb-1">Categoria:</h4>
              <p className="font-medium">
                {categoryData?.name || category}
              </p>
            </div>
            
            <div className="bg-muted p-3 rounded-lg achievement-image-container">
              <h4 className="font-pixel text-sm mb-1">Raridade:</h4>
              <p className="font-medium">
                <span className={`inline-block px-2 py-1 rounded ${rarityData?.color} text-white text-xs`}>
                  {rarityData?.name}
                </span>
              </p>
            </div>
            
            {requirements && (
              <div className="bg-muted p-3 rounded-lg achievement-image-container">
                <h4 className="font-pixel text-sm mb-1 text-minecraft-gold">Requisitos:</h4>
                <p className="text-sm">{requirements}</p>
              </div>
            )}
            
            {reward && (
              <div className="bg-muted p-3 rounded-lg achievement-image-container">
                <h4 className="font-pixel text-sm mb-1 text-minecraft-emerald">Recompensa:</h4>
                <p className="text-sm">{reward}</p>
              </div>
            )}
            
            <div className="bg-muted p-3 rounded-lg achievement-image-container">
              <h4 className="font-pixel text-sm mb-1">Status:</h4>
              <p className="font-medium">
                {unlocked ? (
                  <span className="flex items-center text-minecraft-gold">
                    <Trophy size={16} className="mr-1" />
                    Desbloqueado
                  </span>
                ) : (
                  <span className="flex items-center text-muted-foreground">
                    <Lock size={16} className="mr-1" />
                    Bloqueado
                  </span>
                )}
              </p>
            </div>
            
            <div className="pt-4">
              <button 
                className="minecraft-btn py-2 w-full bg-primary text-white hover:bg-primary/90 transition-colors"
                onClick={() => {
                  toast({
                    title: "Conquista visualizada",
                    description: `Você viu detalhes sobre "${title}"`,
                  });
                  onClose();
                }}
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementInfoModal;
