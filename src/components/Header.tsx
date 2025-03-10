import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, LogOut, User, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { categories } from '../data/achievements';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import UserProfilePanel from './UserProfilePanel';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

type HeaderProps = {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
};

const Header: React.FC<HeaderProps> = ({ activeCategory, setActiveCategory }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

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
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-minecraft-dirt rounded-sm flex items-center justify-center border-2 border-black">
              <div className="w-8 h-8 bg-minecraft-grass rounded-sm border border-black"></div>
            </div>
            <h1 className="text-2xl font-bold font-pixel tracking-wider">
              <span className="text-minecraft-gold">MC</span> Conquistas
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {/* Minimized Categories */}
          <div className="relative mr-4">
            <button
              onClick={() => setCategoriesExpanded(!categoriesExpanded)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md hover:bg-muted transition-colors font-medium"
            >
              {t(`categories.${activeCategory}`)}
              {categoriesExpanded ? 
                <ChevronUp size={16} className="ml-1" /> : 
                <ChevronDown size={16} className="ml-1" />
              }
            </button>
            
            {categoriesExpanded && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-card rounded-md shadow-lg py-1 z-10 border border-border">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setCategoriesExpanded(false);
                    }}
                    className={`flex w-full items-center px-4 py-2 text-sm hover:bg-muted text-left
                      ${activeCategory === category.id ? 'bg-primary/10 font-medium text-primary' : ''}`}
                  >
                    {t(`categories.${category.id}`)}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <ThemeToggle />
          <LanguageSwitcher />

          {isAuthenticated ? (
            <UserProfilePanel />
          ) : (
            <Link 
              to="/auth" 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
            >
              <LogIn size={16} />
              <span className="text-sm font-medium">{t('auth.login')}</span>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          
          {isAuthenticated ? (
            <UserProfilePanel />
          ) : (
            <Link 
              to="/auth" 
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
              aria-label="Login"
            >
              <LogIn size={20} />
            </Link>
          )}
          
          <button 
            className="text-primary p-1.5" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-t border-border p-4 shadow-lg animate-scale-up">
          <nav className="flex flex-col space-y-2">
            <button
              className="flex items-center justify-between w-full px-4 py-3 rounded-md bg-muted/50"
              onClick={() => setCategoriesExpanded(!categoriesExpanded)}
            >
              <span className="font-medium">{t(`categories.${activeCategory}`)}</span>
              {categoriesExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {categoriesExpanded && (
              <div className="pl-2 space-y-1 border-l-2 border-muted ml-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setCategoriesExpanded(false);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-4 py-2 w-full text-left rounded-md ${
                      activeCategory === category.id ? 'text-primary font-medium' : ''
                    }`}
                  >
                    {t(`categories.${category.id}`)}
                  </button>
                ))}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
