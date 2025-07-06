'use client';

import { useEffect } from 'react';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  useEffect(() => {
    const existingScript = document.getElementById('google-translate-script');

    const googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            'google_translate_element'
          );
    }

    if (!existingScript) {
      const addScript = document.createElement('script');
      addScript.id = 'google-translate-script';
      addScript.src = `//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`;
      document.body.appendChild(addScript);
      window.googleTranslateElementInit = googleTranslateElementInit;
    }
    
  }, []);

  return (
    <div className="flex items-center">
        <div id="google_translate_element" className="[&>div]:!bg-transparent [&>div>div]:!bg-transparent [&_select]:bg-transparent [&_select]:border-none [&_select]:text-muted-foreground [&_select]:p-0 [&_select]:focus:ring-0 [&_select]:font-medium" />
    </div>
  );
};

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default LanguageSwitcher;
