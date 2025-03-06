
import React, { useState } from 'react';
import { Achievement, rarities } from '../data/achievements';
import { Lock, Trophy, Info } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const { title, description, rarity, image, requirements, reward, unlocked } = achievement;
  
  const rarityData = rarities.find(r => r.id === rarity);
  
  // Ensure the image URL is not cached by browsers
  const getImageUrl = (url: string) => {
    // Only add a cache-busting parameter if it doesn't already have one
    if (url.includes('?')) {
      return url;
    }
    return `${url}?t=${new Date().getTime()}`;
  };
  
  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="card-3d h-80 w-full max-w-xs mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`relative h-full w-full rounded-2xl transition-all duration-500 transform-gpu cursor-pointer
          ${isFlipped ? 'animate-flip rotate-y-180' : 'animate-unflip'}`}
        onClick={handleClick}
      >
        {/* Front of card */}
        <div 
          className={`absolute inset-0 rounded-2xl p-1 bg-gradient-to-br ${rarity === 'legendary' ? 'card-shine-legendary from-rarity-legendary/40 via-rarity-legendary to-rarity-legendary/40' : 
            'card-shine from-rarity-' + rarity + '/40 via-rarity-' + rarity + ' to-rarity-' + rarity + '/40'}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="h-full w-full rounded-xl overflow-hidden bg-card p-4 flex flex-col border-2 border-black">
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
            
            {/* Card image with cache busting */}
            <div className="relative w-full h-28 bg-muted rounded-lg border-2 border-black overflow-hidden mb-3">
              <img 
                src={getImageUrl(image)} 
                alt={title} 
                className={`object-cover w-full h-full pixelated 
                  ${unlocked ? '' : 'opacity-50 blur-sm grayscale'}`}
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
              <Info size={18} className={`text-accent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
            </div>
          </div>
        </div>
        
        {/* Back of card */}
        <div 
          className={`absolute inset-0 rounded-2xl p-1 bg-gradient-to-br ${rarity === 'legendary' ? 'card-shine-legendary from-rarity-legendary/40 via-rarity-legendary to-rarity-legendary/40' : 
            'card-shine from-rarity-' + rarity + '/40 via-rarity-' + rarity + ' to-rarity-' + rarity + '/40'}`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="h-full w-full rounded-xl overflow-hidden bg-card p-4 flex flex-col border-2 border-black">
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
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;
