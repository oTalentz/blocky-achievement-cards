
import React from 'react';
import { Achievement, rarities } from '../../data/achievements';
import { Lock, Trophy, Info } from 'lucide-react';

interface AchievementCardFrontProps {
  achievement: Achievement;
  isHovered: boolean;
  onImageClick: (e: React.MouseEvent) => void;
  onInfoClick: (e: React.MouseEvent) => void;
}

const AchievementCardFront: React.FC<AchievementCardFrontProps> = ({
  achievement,
  isHovered,
  onImageClick,
  onInfoClick
}) => {
  const { title, description, rarity, image, unlocked } = achievement;
  const rarityData = rarities.find(r => r.id === rarity);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden bg-card p-4 flex flex-col achievement-card-content">
      {/* Card header */}
      <div className="flex justify-between items-start mb-2">
        <span className={`text-xs font-medium px-2 py-1 rounded ${rarityData?.color} text-white`}>
          {rarityData?.name}
        </span>
        {!unlocked && (
          <div className="text-muted-foreground">
            <Lock size={18} />
          </div>
        )}
      </div>
      
      {/* Card image */}
      <div 
        className="relative w-full h-28 bg-muted rounded-lg overflow-hidden mb-3 cursor-pointer achievement-image-container"
        onClick={onImageClick}
      >
        <img 
          key={`${image}-${Date.now()}`}
          src={image} 
          alt={title} 
          className={`object-cover w-full h-full pixelated 
            ${unlocked ? '' : 'opacity-50 blur-sm grayscale'}`}
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite fallback loop
            target.src = '/placeholder.svg';
          }}
        />
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="text-white/70" size={32} />
          </div>
        )}
      </div>
      
      {/* Card content */}
      <h3 className="font-pixel text-xl font-bold mb-1">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground line-clamp-3">
        {description}
      </p>
      
      {/* Info */}
      <div className="mt-auto pt-2 flex justify-between items-center">
        {unlocked ? (
          <span className="flex items-center text-minecraft-gold font-medium">
            <Trophy size={16} className="mr-1" />
            Desbloqueado
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">
            Clique para detalhes
          </span>
        )}
        <Info 
          size={18} 
          className={`text-accent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} hover:text-primary cursor-pointer`} 
          onClick={onInfoClick}
        />
      </div>
    </div>
  );
};

export default AchievementCardFront;
