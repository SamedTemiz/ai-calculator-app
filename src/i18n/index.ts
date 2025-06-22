import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from '../locales/en/translation.json';
import trTranslation from '../locales/tr/translation.json';

i18n
  // Tarayıcı dilini algılayan eklentiyi ekle
  .use(LanguageDetector)
  // i18n'i react-i18next'e geçir
  .use(initReactI18next)
  // i18n'i başlat
  .init({
    // Çeviri kaynakları
    resources: {
      // İngilizce çeviriler buraya gelecek
      en: {
        translation: enTranslation,
      },
      // Türkçe çeviriler buraya gelecek
      tr: {
        translation: trTranslation,
      },
    },
    // Eğer bir dil bulunamazsa veya çeviri eksikse kullanılacak varsayılan dil
    fallbackLng: 'en',
    // Hata ayıklama modunu geliştirme ortamında aç
    debug: import.meta.env.DEV,

    interpolation: {
      // React zaten XSS'e karşı koruma sağladığı için escape'e gerek yok
      escapeValue: false,
    },
  });

export default i18n; 