
import React, { useState, useEffect } from 'react';
import AchievementCard from './AchievementCard';
import { Achievement } from '../data/achievements';
import { Filter, Search } from 'lucide-react';

interface CardGridProps {
  achievements: Achievement[];
  activeCategory: string;
}

const CardGrid: React.FC<CardGridProps> = ({ achievements, activeCategory }) => {
  const [filteredAchievements, setFilteredAchievements] = useState<Achievement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUnlocked, setShowUnlocked] = useState(true);
  const [showLocked, setShowLocked] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    // Filter achievements based on active category and search term
    let filtered = achievements;
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(achievement => achievement.category === activeCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(achievement => 
        achievement.title.toLowerCase().includes(term) || 
        achievement.description.toLowerCase().includes(term)
      );
    }
    
    // Filter by unlock status
    if (!showUnlocked) {
      filtered = filtered.filter(achievement => !achievement.unlocked);
    }
    
    if (!showLocked) {
      filtered = filtered.filter(achievement => achievement.unlocked);
    }
    
    setFilteredAchievements(filtered);
  }, [achievements, activeCategory, searchTerm, showUnlocked, showLocked]);

  return (
    <div className="pt-12 pb-16">
      {/* Search and filter controls */}
      <div className="mb-8 relative">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-muted-foreground" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-3 w-full rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="Buscar conquistas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background md:bg-transparent hover:bg-background transition-colors"
          >
            <Filter size={18} className="text-muted-foreground" />
            <span className={isFiltersOpen ? "text-primary" : ""}>Filtros</span>
          </button>
        </div>
        
        {/* Filter options */}
        {isFiltersOpen && (
          <div className="mt-4 p-4 bg-card rounded-lg shadow-lg border border-border animate-scale-up">
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showUnlocked}
                  onChange={() => setShowUnlocked(!showUnlocked)}
                  className="rounded border-border text-primary focus:ring-primary/20"
                />
                <span>Mostrar desbloqueados</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLocked}
                  onChange={() => setShowLocked(!showLocked)}
                  className="rounded border-border text-primary focus:ring-primary/20"
                />
                <span>Mostrar bloqueados</span>
              </label>
            </div>
          </div>
        )}
      </div>
      
      {/* Achievement cards grid */}
      {filteredAchievements.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAchievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className="transition-all duration-500 animate-scale-up" 
              style={{ animationDelay: `${Math.random() * 0.5}s` }}
            >
              <AchievementCard achievement={achievement} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-block mb-4 p-3 rounded-full bg-muted">
            <Filter size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">Nenhuma conquista encontrada</h3>
          <p className="text-muted-foreground">
            Tente mudar os filtros ou buscar por outro termo.
          </p>
        </div>
      )}
    </div>
  );
};

export default CardGrid;
