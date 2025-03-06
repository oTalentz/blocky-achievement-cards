
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { categories } from '../data/achievements';

type HeaderProps = {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
};

const Header: React.FC<HeaderProps> = ({ activeCategory, setActiveCategory }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 
        ${scrolled ? 'bg-background/95 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-minecraft-dirt rounded-sm flex items-center justify-center border-2 border-black">
            <div className="w-8 h-8 bg-minecraft-grass rounded-sm border border-black"></div>
          </div>
          <h1 className="text-2xl font-bold font-pixel tracking-wider">
            <span className="text-minecraft-gold">MC</span> Conquistas
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-md transition-all duration-200 font-medium 
                ${activeCategory === category.id 
                  ? 'bg-primary text-white shadow-lg scale-105' 
                  : 'hover:bg-muted'}`}
            >
              {category.name}
            </button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-primary" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-t border-border p-4 shadow-lg animate-scale-up">
          <nav className="flex flex-col space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-3 rounded-md transition-all duration-200 font-medium text-left
                  ${activeCategory === category.id 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-muted'}`}
              >
                {category.name}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
