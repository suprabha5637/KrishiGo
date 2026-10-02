import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳' },
];

interface LanguageContextType {
  currentLanguage: LanguageOption;
  supportedLanguages: LanguageOption[];
  isTranslating: boolean;
  setLanguage: (langCode: string) => Promise<void>;
  translateText: (text: string, targetLang?: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper to set cookie for all subdomains and paths
const setGoogleTransCookie = (val: string) => {
  const host = window.location.hostname;
  document.cookie = `googtrans=${val}; path=/;`;
  document.cookie = `googtrans=${val}; domain=${host}; path=/;`;
  // Also handle localhost without domain
  if (host.includes('.')) {
    const parts = host.split('.');
    if (parts.length > 1) {
      const rootDomain = parts.slice(-2).join('.');
      document.cookie = `googtrans=${val}; domain=.${rootDomain}; path=/;`;
    }
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(() => {
    try {
      const saved = localStorage.getItem('krishigo_selected_language');
      if (saved) {
        const found = SUPPORTED_LANGUAGES.find((l) => l.code === saved || l.name.toLowerCase() === saved.toLowerCase());
        if (found) return found;
      }
      // Check existing cookie
      const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
      if (match && match[1]) {
        const found = SUPPORTED_LANGUAGES.find((l) => l.code === match[1]);
        if (found) return found;
      }
    } catch {
      // fallback
    }
    return SUPPORTED_LANGUAGES[0]; // English
  });

  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // Function to apply language across the entire webapp via Google Website Translator API
  const applyGoogleTranslate = useCallback((langCode: string) => {
    const targetVal = langCode === 'en' ? '/en/en' : `/en/${langCode}`;
    setGoogleTransCookie(targetVal);

    // 1. Attempt to trigger Google's native combo dropdown
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      // If the Google Translate combo is not ready yet, wait briefly and try once more
      setTimeout(() => {
        const retrySelect = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
        if (retrySelect) {
          retrySelect.value = langCode;
          retrySelect.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
          // As a clean fallback for instant full-page translation
          window.location.reload();
        }
      }, 300);
    }
  }, []);

  // Main setLanguage function called by UI
  const setLanguage = async (langCode: string) => {
    setIsTranslating(true);
    const target = SUPPORTED_LANGUAGES.find((l) => l.code === langCode || l.name.toLowerCase() === langCode.toLowerCase());
    if (!target) {
      setIsTranslating(false);
      return;
    }

    try {
      setCurrentLanguage(target);
      localStorage.setItem('krishigo_selected_language', target.code);
      applyGoogleTranslate(target.code);
    } catch (e) {
      console.error('Error changing language:', e);
    } finally {
      setTimeout(() => setIsTranslating(false), 500);
    }
  };

  // On client-side route transitions, ensure translation remains active
  useEffect(() => {
    if (currentLanguage.code !== 'en') {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (select && select.value !== currentLanguage.code) {
        select.value = currentLanguage.code;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }, [location.pathname, currentLanguage.code]);

  // Translate specific dynamic text on demand via backend Google Translate API
  const translateText = async (text: string, targetLang?: string): Promise<string> => {
    const target = targetLang || currentLanguage.code;
    if (target === 'en' || !text.trim()) return text;

    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/translate/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          target_lang: target,
          source_lang: 'auto',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.translated_text || text;
      }
    } catch (e) {
      console.warn('Backend translation failed, returning original text:', e);
    }
    return text;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        isTranslating,
        setLanguage,
        translateText,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
