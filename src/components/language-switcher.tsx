'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/ui/dialog';
import { Card, CardContent } from '@/ui/card';
import { Globe } from 'lucide-react';

const languages = [
  { key: 'en', code: 'en', name: 'English' },
  { key: 'hi', code: 'hi', name: 'हिन्दी' },
  { key: 'gu', code: 'gu', name: 'ગુજરાતી' },
  { key: 'mr', code: 'mr', name: 'मराठी' },
  { key: 'pa', code: 'pa', name: 'ਪੰਜਾਬੀ' },
  { key: 'hinglish', code: 'hi', name: 'Hinglish (हिन्दी)' },
];

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const scriptId = 'google-translate-script';

    // Define the callback function on the window object
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,gu,mr,pa',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    // Add the script to the page if it doesn't exist
    if (!document.getElementById(scriptId)) {
      const addScript = document.createElement('script');
      addScript.id = scriptId;
      addScript.src = `//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`;
      addScript.async = true;
      document.body.appendChild(addScript);
    }
  }, []);

  const handleLanguageChange = (langCode: string) => {
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (selectElement) {
        selectElement.value = langCode;
        selectElement.dispatchEvent(new Event('change', { bubbles: true }));
    }
    setIsOpen(false);
  };

  return (
    <>
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className='h-6 w-6'>
            <Globe className="h-6 w-6" />
            <span className="sr-only">Change language</span>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Choose a Language</DialogTitle>
            <DialogDescription>
              Select your preferred language for the website.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
            {languages.map((lang) => (
              <Card
                key={lang.key}
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors group"
                onClick={() => handleLanguageChange(lang.code)}
              >
                <CardContent className="p-4 flex items-center justify-center">
                  <span className="text-base font-medium text-center">{lang.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default LanguageSwitcher;
