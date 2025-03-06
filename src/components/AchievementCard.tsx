
import React, { useState } from 'react';
import { Achievement, rarities } from '../data/achievements';
import AchievementCardFront from './achievement/AchievementCardFront';
import AchievementCardBack from './achievement/AchievementCardBack';
import ImageZoomModal from './achievement/ImageZoomModal';
import AchievementInfoModal from './achievement/AchievementInfoModal';

interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  
  const { rarity } = achievement;
  
  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip when clicking on image
    setIsImageZoomed(true);
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip when clicking on info
    setIsInfoModalOpen(true);
  };
  
  const handleBackButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
  };

  // Get the card background gradient class based on rarity
  const getCardGradientClass = () => {
    if (rarity === 'legendary') {
      return 'card-shine-legendary from-rarity-legendary/40 via-rarity-legendary to-rarity-legendary/40';
    } else if (rarity === 'epic') {
      return 'card-shine-epic from-rarity-epic/40 via-rarity-epic to-rarity-epic/40';
    } else if (rarity === 'rare') {
      return 'card-shine-rare from-rarity-rare/40 via-rarity-rare to-rarity-rare/40';
    } else if (rarity === 'uncommon') {
      return 'card-shine-uncommon from-rarity-uncommon/40 via-rarity-uncommon to-rarity-uncommon/40';
    } else {
      return 'card-shine from-rarity-' + rarity + '/40 via-rarity-' + rarity + ' to-rarity-' + rarity + '/40';
    }
  };

  return (
    <>
      <div 
        className="card-3d h-80 w-full max-w-xs mx-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className={`relative h-full w-full rounded-2xl transition-all duration-700 transform-gpu cursor-pointer achievement-card
            ${isFlipped ? 'animate-flip-slow rotate-y-180' : 'animate-unflip-slow'}`}
          onClick={handleClick}
        >
          {/* Front of card */}
          <div 
            className={`absolute inset-0 rounded-2xl p-1 bg-gradient-to-br ${getCardGradientClass()}`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <AchievementCardFront 
              achievement={achievement}
              isHovered={isHovered}
              onImageClick={handleImageClick}
              onInfoClick={handleInfoClick}
            />
          </div>
          
          {/* Back of card */}
          <div 
            className={`absolute inset-0 rounded-2xl p-1 bg-gradient-to-br ${getCardGradientClass()}`}
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <AchievementCardBack 
              achievement={achievement}
              onBack={handleBackButtonClick}
            />
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      <ImageZoomModal
        image={achievement.image}
        title={achievement.title}
        isOpen={isImageZoomed}
        onClose={() => setIsImageZoomed(false)}
      />

      {/* Info Modal */}
      <AchievementInfoModal
        achievement={achievement}
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </>
  );
};

export default AchievementCard;
