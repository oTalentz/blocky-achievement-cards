
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AchievementsProvider } from './contexts/AchievementsContext';
import { ImagesProvider } from './contexts/ImagesContext';
import { Toaster } from 'sonner';

import Index from './pages/Index';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';

import './App.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AchievementsProvider>
            <ImagesProvider>
              <Router>
                <Toaster position="top-right" richColors duration={2000} />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
            </ImagesProvider>
          </AchievementsProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
