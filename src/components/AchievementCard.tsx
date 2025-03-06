
import React, { useState } from 'react';
import { Achievement, rarities } from '../data/achievements';
import { Lock, Trophy, Info, X } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  
  const { title, description, rarity, image, requirements, reward, unlocked } = achievement;
  
  const rarityData = rarities.find(r => r.id === rarity);
  
  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip when clicking on image
    setIsImageZoomed(true);
  };

  const closeZoom = () => {
    setIsImageZoomed(false);
  };

  return (
    <>
      <div 
        className="card-3d h-80 w-full max-w-xs mx-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className={`relative h-full w-full rounded-2xl transition-all duration-500 transform-gpu cursor-pointer achievement-card
            ${isFlipped ? 'animate-flip rotate-y-180' : 'animate-unflip'}`}
          onClick={handleClick}
        >
          {/* Front of card */}
          <div 
            className={`absolute inset-0 rounded-2xl p-1 bg-gradient-to-br ${rarity === 'legendary' ? 'card-shine-legendary from-rarity-legendary/40 via-rarity-legendary to-rarity-legendary/40' : 
              'card-shine from-rarity-' + rarity + '/40 via-rarity-' + rarity + ' to-rarity-' + rarity + '/40'}`}
            style={{ backfaceVisibility: 'hidden' }}
          >
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
              
              {/* Card image - Add onClick handler for zoom */}
              <div 
                className="relative w-full h-28 bg-muted rounded-lg overflow-hidden mb-3 cursor-pointer achievement-image-container"
                onClick={handleImageClick}
              >
                {/* Use a key to force re-render of the image when the src changes */}
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

      {/* Image Zoom Modal */}
      {isImageZoomed && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeZoom}
        >
          <div className="relative max-w-3xl max-h-[80vh] w-full bg-black rounded-lg overflow-hidden animate-scale-up">
            <button 
              onClick={closeZoom}
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/80 transition-colors z-10"
            >
              <X size={24} />
            </button>
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-contain pixelated"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/placeholder.svg';
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AchievementCard;
