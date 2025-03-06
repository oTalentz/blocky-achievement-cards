
import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import Header from '../components/Header';
import CardGrid from '../components/CardGrid';
import Footer from '../components/Footer';
import { achievements } from '../data/achievements';
import { useLanguage } from '../contexts/LanguageContext';

const Index: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />
      
      <HeroSection />
      
      <main className="flex-grow" id="achievements-content">
        <section className="container mx-auto px-6 py-16">
          <div className="mb-12 text-center">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              {t('collection.title')}
            </span>
            <h2 className="text-4xl font-bold font-pixel tracking-wider mb-4">
              {t('collection.heading')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('collection.description')}
            </p>
          </div>
          
          <CardGrid 
            achievements={achievements} 
            activeCategory={activeCategory} 
          />
        </section>
        
        <section className="container mx-auto px-6 py-16 border-t border-border">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
              {t('howItWorks.title')}
            </span>
            <h2 className="text-4xl font-bold font-pixel tracking-wider mb-4">
              {t('howItWorks.heading')}
            </h2>
            <p className="text-muted-foreground mb-12">
              {t('howItWorks.description')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="w-16 h-16 rounded-full bg-minecraft-gold/10 text-minecraft-gold flex items-center justify-center mx-auto mb-4">
                  <span className="font-pixel text-2xl">1</span>
                </div>
                <h3 className="font-pixel text-xl mb-2">{t('howItWorks.step1.title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('howItWorks.step1.description')}
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="w-16 h-16 rounded-full bg-minecraft-diamond/10 text-minecraft-diamond flex items-center justify-center mx-auto mb-4">
                  <span className="font-pixel text-2xl">2</span>
                </div>
                <h3 className="font-pixel text-xl mb-2">{t('howItWorks.step2.title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('howItWorks.step2.description')}
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="w-16 h-16 rounded-full bg-minecraft-emerald/10 text-minecraft-emerald flex items-center justify-center mx-auto mb-4">
                  <span className="font-pixel text-2xl">3</span>
                </div>
                <h3 className="font-pixel text-xl mb-2">{t('howItWorks.step3.title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('howItWorks.step3.description')}
                </p>
              </div>
            </div>
            
            <button className="minecraft-btn text-lg py-3 px-8 bg-minecraft-grass text-white mt-12">
              {t('howItWorks.button')}
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
