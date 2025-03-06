import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pt-BR' | 'en-US';

type TranslationSet = {
  [key: string]: string;
};

type TranslationsType = {
  [key in Language]: TranslationSet;
};

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

// Translations
const translations: TranslationsType = {
  'pt-BR': {
    'app.title': 'Minecraft Construtor',
    'app.subtitle': 'Guia de construção e inspiração',
    'nav.home': 'Início',
    'nav.achievements': 'Conquistas',
    'nav.categories': 'Categorias',
    'nav.login': 'Entrar',
    'nav.logout': 'Sair',
    'nav.admin': 'Admin',
    'hero.title': 'Transforme seu mundo Minecraft',
    'hero.subtitle': 'Desbloqueie conquistas, descubra designs incríveis e aprimore suas habilidades de construção',
    'hero.cta': 'Explorar Agora',
    'achievements.title': 'Conquistas de Construção',
    'achievements.subtitle': 'Desbloqueie conquistas à medida que constrói e se torna um mestre construtor',
    'achievements.unlock': 'Desbloqueie esta conquista',
    'admin.dashboard': 'Painel de Administração',
    'admin.achievements': 'Conquistas',
    'admin.images': 'Imagens',
    'admin.categories': 'Categorias',
    'admin.settings': 'Configurações',
    'admin.uploadImages': 'Carregar Imagens',
    'admin.upload': 'Carregar',
    'admin.uploading': 'Carregando...',
    'admin.dragImages': 'Arraste imagens para cá ou clique para selecionar',
    'admin.supportedFormats': 'JPEG, PNG, GIF (Máximo 5MB)',
    'admin.imageLibrary': 'Biblioteca de Imagens',
    'admin.noImages': 'Sem imagens',
    'admin.confirmDelete': 'Tem certeza que deseja excluir esta imagem?',
    'admin.onlyImages': 'Apenas imagens são permitidas',
    'admin.id': 'ID',
    'admin.name': 'Nome',
    'admin.color': 'Cor',
    'admin.language': 'Idioma',
    'admin.theme': 'Tema',
    'admin.darkMode': 'Modo Escuro',
    'auth.login': 'Entrar',
    'auth.register': 'Registrar',
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.confirmPassword': 'Confirmar Senha',
    'auth.submit': 'Enviar',
    'auth.alreadyAccount': 'Já tem uma conta? Entrar',
    'auth.noAccount': 'Não tem uma conta? Registrar',
    'error.404': 'Página não encontrada',
    'error.goHome': 'Voltar ao Início',
  },
  'en-US': {
    'app.title': 'Minecraft Builder',
    'app.subtitle': 'Building guide and inspiration',
    'nav.home': 'Home',
    'nav.achievements': 'Achievements',
    'nav.categories': 'Categories',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.admin': 'Admin',
    'hero.title': 'Transform your Minecraft world',
    'hero.subtitle': 'Unlock achievements, discover amazing designs, and improve your building skills',
    'hero.cta': 'Explore Now',
    'achievements.title': 'Building Achievements',
    'achievements.subtitle': 'Unlock achievements as you build and become a master builder',
    'achievements.unlock': 'Unlock this achievement',
    'admin.dashboard': 'Admin Dashboard',
    'admin.achievements': 'Achievements',
    'admin.images': 'Images',
    'admin.categories': 'Categories',
    'admin.settings': 'Settings',
    'admin.uploadImages': 'Upload Images',
    'admin.upload': 'Upload',
    'admin.uploading': 'Uploading...',
    'admin.dragImages': 'Drag images here or click to select',
    'admin.supportedFormats': 'JPEG, PNG, GIF (Max 5MB)',
    'admin.imageLibrary': 'Image Library',
    'admin.noImages': 'No images',
    'admin.confirmDelete': 'Are you sure you want to delete this image?',
    'admin.onlyImages': 'Only images are allowed',
    'admin.id': 'ID',
    'admin.name': 'Name',
    'admin.color': 'Color',
    'admin.language': 'Language',
    'admin.theme': 'Theme',
    'admin.darkMode': 'Dark Mode',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.submit': 'Submit',
    'auth.alreadyAccount': 'Already have an account? Login',
    'auth.noAccount': 'Don\'t have an account? Register',
    'error.404': 'Page Not Found',
    'error.goHome': 'Go Home',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt-BR');

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'pt-BR' || savedLanguage === 'en-US')) {
      setLanguage(savedLanguage as Language);
    }
  }, []);

  useEffect(() => {
    // Save language to localStorage
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
