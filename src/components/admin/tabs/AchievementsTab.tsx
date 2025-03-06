
import React from 'react';
import { Trophy } from 'lucide-react';
import AchievementManager from '../AchievementManager';

const AchievementsTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-pixel mb-6 flex items-center gap-2">
        <Trophy className="h-6 w-6" />
        Conquistas
      </h2>
      
      <AchievementManager />
    </div>
  );
};

export default AchievementsTab;
