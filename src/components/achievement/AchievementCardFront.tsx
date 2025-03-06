
import React, { useState } from 'react';
import { Achievement, rarities } from '../../data/achievements';
import { Lock, Trophy, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

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
  const [showTooltip, setShowTooltip] = useState(false);
  const { title, description, rarity, image, unlocked } = achievement;
  const rarityData = rarities.find(r => r.id === rarity);

  // Special effects class based on rarity
  const getRarityEffectClass = () => {
    switch(rarity) {
      case 'epic':
        return 'achievement-epic';
      case 'rare':
        return 'achievement-rare';
      default:
        return '';
    }
  };

  return (
    <div className={`h-full w-full rounded-xl overflow-hidden bg-card p-4 flex flex-col achievement-card-content ${getRarityEffectClass()}`}>
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
        <div className="relative">
          <button 
            className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white hover:bg-accent/80 transition-colors cursor-pointer"
            onClick={onInfoClick}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            aria-label="Ver mais informações"
          >
            <Info size={18} />
          </button>
          
          {/* Custom Tooltip */}
          {showTooltip && (
            <div 
              className={cn(
                "absolute -top-24 right-0 w-48 p-2 bg-popover text-popover-foreground text-sm rounded-md shadow-md border z-50 animate-fade-in",
                "before:content-[''] before:absolute before:bottom-[-5px] before:right-3 before:w-0 before:h-0",
                "before:border-l-[6px] before:border-l-transparent",
                "before:border-r-[6px] before:border-r-transparent",
                "before:border-t-[6px] before:border-t-popover"
              )}
            >
              <div className="text-center mb-1">
                <span className="font-pixel text-xs">{rarityData?.name}</span>
              </div>
              <div className="text-left mb-1">
                <p className="text-xs font-medium">Categoria: {achievement.category}</p>
              </div>
              {achievement.requirements && (
                <div className="text-left">
                  <p className="text-xs text-minecraft-gold truncate">Requisito: {achievement.requirements}</p>
                </div>
              )}
              <div className="text-right mt-1">
                <span className="text-xs italic">Clique para mais detalhes</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementCardFront;
