
import React from 'react';
import { Achievement } from '../../data/achievements';

interface AchievementCardBackProps {
  achievement: Achievement;
  onBack: (e: React.MouseEvent) => void;
}

const AchievementCardBack: React.FC<AchievementCardBackProps> = ({
  achievement,
  onBack
}) => {
  const { title, requirements, reward } = achievement;

  return (
    <div className="h-full w-full rounded-xl overflow-hidden bg-card p-4 flex flex-col achievement-card-content">
      <h3 className="font-pixel text-xl font-bold mb-3 text-center">
        {title}
      </h3>
      
      <div className="mb-4">
        <h4 className="font-pixel text-sm text-minecraft-gold mb-1">Requisitos:</h4>
        <p className="text-sm">{requirements}</p>
      </div>
      
      <div className="mb-4">
        <h4 className="font-pixel text-sm text-minecraft-emerald mb-1">Recompensa:</h4>
        <p className="text-sm">{reward}</p>
      </div>
      
      <div className="mt-auto pt-2 text-center">
        <button 
          className="minecraft-btn text-sm py-1.5 w-full bg-muted hover:bg-muted/80 transition-colors"
          onClick={onBack}
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

export default AchievementCardBack;
