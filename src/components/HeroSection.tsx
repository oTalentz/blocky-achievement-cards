
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-minecraft-emerald/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-minecraft-gold/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-6 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-pixel tracking-wider mb-6 animate-float">
          {t('hero.title')}
        </h1>
        
        <p className="text-xl md:text-3xl text-primary font-pixel mb-8">
          {t('hero.subtitle')}
        </p>
        
        <p className="text-lg text-muted-foreground max-w-3xl mb-10">
          {t('hero.description')}
        </p>
        
        <a 
          href="#achievements-content" 
          className="minecraft-btn text-xl py-3 px-8 bg-minecraft-grass text-white"
        >
          {t('hero.button')}
        </a>
        
        {/* Floating Minecraft blocks */}
        <div className="grid grid-cols-3 gap-8 md:gap-12 mt-16 w-full max-w-3xl">
          <div className="flex flex-col items-center animate-float" style={{ animationDelay: '0s' }}>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-minecraft-dirt border-2 border-black rounded-sm mb-4"></div>
          </div>
          
          <div className="flex flex-col items-center animate-float" style={{ animationDelay: '0.5s' }}>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-minecraft-gold border-2 border-black rounded-sm mb-4"></div>
          </div>
          
          <div className="flex flex-col items-center animate-float" style={{ animationDelay: '1s' }}>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-minecraft-diamond border-2 border-black rounded-sm mb-4"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
