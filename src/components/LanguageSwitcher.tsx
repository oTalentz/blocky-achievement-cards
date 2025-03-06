
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'pt-BR' ? 'en-US' : 'pt-BR');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
      aria-label="Change language"
    >
      <Globe size={16} />
      <span className="text-sm font-medium">{t('language.switch')}</span>
    </button>
  );
};

export default LanguageSwitcher;
