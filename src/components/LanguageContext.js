import React, { createContext, useState, useContext, useEffect } from 'react';

// Create language context
const LanguageContext = createContext();

// Language provider component
export const LanguageProvider = ({ children }) => {
  // Initialize language state from localStorage or default to English
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('ai-storyland-language');
    return savedLanguage || 'english';
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('ai-storyland-language', language);
    console.log('Language set to:', language);
  }, [language]);

  // Function to change language
  const changeLanguage = (newLanguage) => {
    if (newLanguage === 'english' || newLanguage === 'tamil') {
      setLanguage(newLanguage);
    } else {
      console.error('Invalid language:', newLanguage);
    }
  };

  // Context value
  const contextValue = {
    language,
    changeLanguage,
    isEnglish: language === 'english',
    isTamil: language === 'tamil'
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
