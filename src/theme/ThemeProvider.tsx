import React, { useEffect, useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { getThemeColors, convertAIColorsToTheme, getContrastingTextColor } from './themes';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const currentThemeName = useAppSelector((state) => state.theme.currentTheme);
  const currentAIColors = useAppSelector((state) => state.theme.currentAIColors);

  const themeColors = useMemo(() => {
    if (currentThemeName === 'custom' && currentAIColors) {
      return convertAIColorsToTheme(currentAIColors);
    }
    return getThemeColors(currentThemeName);
  }, [currentThemeName, currentAIColors]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (themeColors) {
      // Arka plan gradyanını bir CSS değişkeni olarak ayarla
      root.style.setProperty('--background-gradient', themeColors.backgroundGradient);

      // Temel renkleri CSS değişkenleri olarak ayarla
      root.style.setProperty('--background', themeColors.background);
      root.style.setProperty('--foreground', themeColors.text);
      root.style.setProperty('--surface', themeColors.surface);
      root.style.setProperty('--text', themeColors.text);
      root.style.setProperty('--text-secondary', themeColors.textSecondary);

      // Ana renkler ve onlarla kontrast oluşturan metin renkleri
      root.style.setProperty('--primary', themeColors.primary);
      root.style.setProperty('--primary-foreground', getContrastingTextColor(themeColors.primary));

      root.style.setProperty('--secondary', themeColors.secondary);
      root.style.setProperty('--secondary-foreground', getContrastingTextColor(themeColors.secondary));
      
      // Card, Popover gibi yüzeyler için renkler
      root.style.setProperty('--card', themeColors.surface);
      root.style.setProperty('--card-foreground', themeColors.text);

      // Popover
      root.style.setProperty('--popover', themeColors.surface);
      root.style.setProperty('--popover-foreground', themeColors.text);
      
      // Muted (sessiz) renkler, genellikle ikincil metinler veya sınırlar için
      root.style.setProperty('--muted', themeColors.textSecondary);
      root.style.setProperty('--muted-foreground', themeColors.textSecondary); // Genellikle aynıdır

      // Vurgu renkleri
      root.style.setProperty('--accent', themeColors.secondary);
      root.style.setProperty('--accent-foreground', getContrastingTextColor(themeColors.secondary));
      
      // Yıkıcı eylemler için renkler (örn: silme butonu)
      // Bu renkleri temanızda tanımlayabilir veya sabit bırakabilirsiniz.
      const destructiveColor = '#EF4444'; // Genellikle kırmızı
      root.style.setProperty('--destructive', destructiveColor);
      root.style.setProperty('--destructive-foreground', getContrastingTextColor(destructiveColor));

      // Diğer UI elementleri
      root.style.setProperty('--border', themeColors.border);
      root.style.setProperty('--input', themeColors.border); // Input kenarlığı
      root.style.setProperty('--ring', themeColors.primary); // Odaklanma halkası
      root.style.setProperty('--shadow', themeColors.shadow); // Gölgeler
      
      // Yuvarlaklık
      root.style.setProperty('--radius', '0.5rem');
      
      // =================================================================
      // Hesap Makinesi Özel Değişkenleri (Geri Eklendi)
      // =================================================================
      root.style.setProperty('--button-number', themeColors.button.number);
      root.style.setProperty('--button-number-text', themeColors.button.numberText);
      root.style.setProperty('--button-operator', themeColors.button.operator);
      root.style.setProperty('--button-operator-text', themeColors.button.operatorText);
      root.style.setProperty('--button-special', themeColors.button.special);
      root.style.setProperty('--button-special-text', themeColors.button.specialText);
      root.style.setProperty('--display-background', themeColors.display.background);
      root.style.setProperty('--display-text', themeColors.display.text);
    }
  }, [themeColors]);
  
  // body'e sınıf ekleyerek karanlık/açık tema geçişi
  useEffect(() => {
    const body = document.body;
    body.classList.remove('light', 'dark');
    if (currentThemeName === 'dark' || currentThemeName === 'batman' || currentThemeName === 'galaxy') {
      body.classList.add('dark');
    } else {
      body.classList.add('light');
    }
  }, [currentThemeName]);


  return <>{children}</>;
}; 