
import React from 'react';
import { ChevronDown, Trophy } from 'lucide-react';

const HeroSection: React.FC = () => {
  const scrollToContent = () => {
    const contentElement = document.getElementById('achievements-content');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated blocks background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/5 w-20 h-20 bg-minecraft-dirt rounded-lg animate-float opacity-30 delay-100 border-4 border-black" style={{ animationDelay: '0.1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-minecraft-stone rounded-lg animate-float opacity-30 delay-300 border-4 border-black" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-minecraft-wood rounded-lg animate-float opacity-30 delay-200 border-4 border-black" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-2/3 right-1/3 w-14 h-14 bg-minecraft-grass rounded-lg animate-float opacity-30 delay-400 border-4 border-black" style={{ animationDelay: '0.7s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-20 h-20 bg-minecraft-gold rounded-lg animate-float opacity-30 delay-500 border-4 border-black" style={{ animationDelay: '0.9s' }}></div>
        <div className="absolute top-1/2 right-1/5 w-16 h-16 bg-minecraft-diamond rounded-lg animate-float opacity-30 delay-700 border-4 border-black" style={{ animationDelay: '1.1s' }}></div>
      </div>
      
      <div className="container relative px-6 py-12 mx-auto text-center z-10">
        <div 
          className="inline-block mb-6 p-4 rounded-2xl bg-gradient-to-br from-minecraft-gold/30 via-minecraft-gold to-minecraft-gold/30 card-shine"
        >
          <Trophy size={60} className="text-white" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-4 font-pixel tracking-wider">
          <span className="text-minecraft-gold">Conquistas</span> de <span className="text-minecraft-diamond">Construção</span>
        </h1>
        
        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-foreground/80">
          Desbloqueie conquistas especiais com suas construções no Minecraft e mostre suas habilidades como construtor!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="minecraft-btn text-lg py-3 px-8 bg-minecraft-gold text-black">
            Ver Conquistas
          </button>
          <button className="minecraft-btn text-lg py-3 px-8 bg-minecraft-stone text-white">
            Como Funciona
          </button>
        </div>
        
        <button 
          onClick={scrollToContent}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-pulse-soft flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="mb-2 text-sm">Explorar</span>
          <ChevronDown size={24} />
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
