
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pt-BR' | 'en';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, Record<string, string>>;
  t: (key: string) => string;
};

const translations = {
  'pt-BR': {
    // Header
    'categories.all': 'Todos',
    'categories.construction': 'Construção',
    'categories.redstone': 'Redstone',
    'categories.exploration': 'Exploração',
    // Hero
    'hero.title': 'Conquistas de Minecraft',
    'hero.subtitle': 'Desbloqueie, Construa, Conquiste!',
    'hero.description': 'Descubra todas as conquistas disponíveis para os construtores de Minecraft. Complete os desafios para ganhar recompensas exclusivas.',
    'hero.button': 'Explorar Conquistas',
    // Collection section
    'collection.title': 'Coleção',
    'collection.heading': 'Conquistas de Construção',
    'collection.description': 'Descubra todas as conquistas disponíveis para os construtores de Minecraft. Complete os desafios para desbloquear recompensas exclusivas.',
    // How it works section
    'howItWorks.title': 'Instruções',
    'howItWorks.heading': 'Como Funciona',
    'howItWorks.description': 'Siga estes passos simples para começar a desbloquear suas conquistas de construção.',
    'howItWorks.step1.title': 'Construa',
    'howItWorks.step1.description': 'Crie suas construções no Minecraft seguindo os requisitos das conquistas.',
    'howItWorks.step2.title': 'Compartilhe',
    'howItWorks.step2.description': 'Tire screenshots ou grave vídeos da sua construção e envie para validação.',
    'howItWorks.step3.title': 'Desbloqueie',
    'howItWorks.step3.description': 'Receba suas conquistas e recompensas exclusivas após a validação.',
    'howItWorks.button': 'Saiba Mais',
    // Login/Register
    'auth.login': 'Entrar',
    'auth.register': 'Registrar',
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.username': 'Nome de usuário',
    'auth.submit': 'Enviar',
    'auth.logout': 'Sair',
    'auth.loginSuccess': 'Login realizado com sucesso!',
    'auth.registerSuccess': 'Conta criada com sucesso!',
    // Language
    'language.switch': 'English',
  },
  'en': {
    // Header
    'categories.all': 'All',
    'categories.construction': 'Construction',
    'categories.redstone': 'Redstone',
    'categories.exploration': 'Exploration',
    // Hero
    'hero.title': 'Minecraft Achievements',
    'hero.subtitle': 'Unlock, Build, Conquer!',
    'hero.description': 'Discover all the achievements available for Minecraft builders. Complete challenges to earn exclusive rewards.',
    'hero.button': 'Explore Achievements',
    // Collection section
    'collection.title': 'Collection',
    'collection.heading': 'Building Achievements',
    'collection.description': 'Discover all the achievements available for Minecraft builders. Complete challenges to unlock exclusive rewards.',
    // How it works section
    'howItWorks.title': 'Instructions',
    'howItWorks.heading': 'How It Works',
    'howItWorks.description': 'Follow these simple steps to start unlocking your building achievements.',
    'howItWorks.step1.title': 'Build',
    'howItWorks.step1.description': 'Create your builds in Minecraft following the achievement requirements.',
    'howItWorks.step2.title': 'Share',
    'howItWorks.step2.description': 'Take screenshots or record videos of your builds and submit for validation.',
    'howItWorks.step3.title': 'Unlock',
    'howItWorks.step3.description': 'Receive your achievements and exclusive rewards after validation.',
    'howItWorks.button': 'Learn More',
    // Login/Register
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.username': 'Username',
    'auth.submit': 'Submit',
    'auth.logout': 'Logout',
    'auth.loginSuccess': 'Login successful!',
    'auth.registerSuccess': 'Account created successfully!',
    // Language
    'language.switch': 'Português',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get saved language preference or default to Portuguese
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'pt-BR';
  });

  // Update local storage when language changes
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Translation helper function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    // Update HTML lang attribute when language changes
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    language,
    setLanguage,
    translations,
    t
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
