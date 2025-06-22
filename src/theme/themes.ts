import { ThemeType } from '@/types';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  backgroundGradient: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
  button: {
    number: string;
    operator: string;
    special: string;
    numberText: string;
    operatorText: string;
    specialText: string;
  };
  display: {
    background: string;
    text: string;
  };
}

export interface AIColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export const themes: Record<Exclude<ThemeType, 'custom'>, ThemeColors> = {
  // light tema zaten iyi çalışıyor, değişiklik gerekmiyor.
  light: {
    primary: '#0077B6',
    secondary: '#ADB5BD',
    background: '#F0F2F5',
    backgroundGradient: 'linear-gradient(135deg, #FFFFFF 0%, #F0F2F5 100%)',
    surface: '#FFFFFF',
    text: '#1D2129',
    textSecondary: '#606770',
    border: '#DEE2E6',
    shadow: 'rgba(0, 0, 0, 0.08)',
    button: {
      number: '#FFFFFF',
      operator: '#0077B6',
      special: '#6C757D',
      numberText: '#1D2129',
      operatorText: '#FFFFFF',
      specialText: '#FFFFFF',
    },
    display: {
      background: 'rgba(255, 255, 255, 0.7)',
      text: '#1D2129',
    },
  },
  dark: {
    primary: '#38BDF8', // Canlı mavi vurgu rengi
    secondary: '#475569',
    background: '#0F172A',
    backgroundGradient: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
    surface: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#38BDF8', // DÜZELTME: Kenarlık için soluk bir renk yerine ana vurgu rengini kullandık.
    shadow: 'rgba(0, 0, 0, 0.25)',
    button: {
      number: '#1E293B',
      operator: '#38BDF8',
      special: '#475569',
      numberText: '#F8FAFC',
      operatorText: '#0F172A',
      specialText: '#F8FAFC',
    },
    display: {
      background: 'rgba(15, 23, 42, 0.7)',
      text: '#F8FAFC',
    },
  },
  batman: {
    primary: '#FDE047', // İkonik sarı vurgu rengi
    secondary: '#262626',
    background: '#000000',
    backgroundGradient: 'linear-gradient(135deg, #171717 0%, #000000 100%)',
    surface: '#171717',
    text: '#FFFFFF',
    textSecondary: '#A3A3A3',
    border: '#FDE047', // DÜZELTME: Kenarlık için koyu gri yerine ikonik sarı rengi kullandık.
    shadow: 'rgba(253, 224, 71, 0.1)',
    button: {
      number: '#262626',
      operator: '#FDE047',
      special: '#171717',
      numberText: '#FFFFFF',
      operatorText: '#000000',
      specialText: '#FFFFFF',
    },
    display: {
      background: 'rgba(23, 23, 23, 0.8)',
      text: '#FFFFFF',
    },
  },
  galaxy: {
    primary: '#C4B5FD', // Canlı lavanta vurgu rengi
    secondary: '#F9A8D4',
    background: '#2E1065',
    backgroundGradient: 'linear-gradient(135deg, #4C1D95 0%, #2E1065 100%)',
    surface: '#4C1D95',
    text: '#EDE9FE',
    textSecondary: '#D1D5DB',
    border: '#C4B5FD', // DÜZELTME: Kenarlık için koyu mor yerine canlı lavanta rengini kullandık.
    shadow: 'rgba(196, 181, 253, 0.15)',
    button: {
      number: '#4C1D95',
      operator: '#C4B5FD',
      special: '#F9A8D4',
      numberText: '#EDE9FE',
      operatorText: '#2E1065',
      specialText: '#2E1065',
    },
    display: {
      background: 'rgba(76, 29, 149, 0.8)',
      text: '#EDE9FE',
    },
  },
};

export const getThemeColors = (theme: ThemeType, aiColors?: ThemeColors | null): ThemeColors => {
  if (theme === 'custom' && aiColors) {
    return aiColors;
  }
  return themes[theme as Exclude<ThemeType, 'custom'>];
};

// AI renklerini tam tema formatına dönüştürme
export const convertAIColorsToTheme = (aiColors: AIColors): ThemeColors => {
  const { primary, secondary, background } = aiColors;

  const isDark = isColorDark(background);

  // Metin renklerini, arkaplanın parlaklığına göre standart temalarımız gibi belirle
  const mainText = isDark ? '#F8FAFC' : '#1F2937'; // Garantili yüksek kontrast
  const secondaryText = isDark ? '#94A3B8' : '#6B7280'; // Okunabilir ikincil metin

  // Yüzey rengi, arkaplanın hafifçe ayarlanmış bir tonu
  const surface = adjustColor(background, isDark ? 5 : -5);
  
  // Kenarlık rengi, yüzeyden de hafifçe farklı
  const border = adjustColor(surface, isDark ? 8 : -8);

  return {
    primary,
    secondary,
    background: background,
    backgroundGradient: `linear-gradient(135deg, ${background} 0%, ${adjustColor(background, isDark ? -10 : 10)} 100%)`,
    surface,
    text: mainText,
    textSecondary: secondaryText,
    border,
    shadow: isDark ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.1)',
    button: {
      number: surface,
      operator: primary,
      special: secondary,
      numberText: mainText,
      operatorText: mainText,
      specialText: mainText,
    },
    display: {
      background: adjustColor(background, isDark ? -5 : 5),
      text: mainText,
    },
  };
};

// Renk parlaklığına göre en iyi metin rengini (siyah/beyaz) seç
export const getContrastingTextColor = (backgroundColor: string): string => {
  return isColorDark(backgroundColor) ? '#FFFFFF' : '#000000';
};

// Yardımcı fonksiyonlar
const hexToRgb = (hex: string): [number, number, number] | null => {
  if (!hex || hex.length < 4) return null;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    const shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
    if (!shorthand) return null;
    return [
      parseInt(shorthand[1] + shorthand[1], 16),
      parseInt(shorthand[2] + shorthand[2], 16),
      parseInt(shorthand[3] + shorthand[3], 16),
    ];
  }
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
};

const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = rgb.map(c => {
    c /= 255.0;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const isColorDark = (color: string): boolean => {
  return getLuminance(color) < 0.5;
};

const adjustColor = (color: string, amount: number): string => {
  const rgb = hexToRgb(color);
  if (!rgb) return '#000000';
  
  const toHex = (c: number) => `0${Math.round(c).toString(16)}`.slice(-2);

  const newRgb = rgb.map(c => Math.max(0, Math.min(255, c + amount)));

  return `#${toHex(newRgb[0])}${toHex(newRgb[1])}${toHex(newRgb[2])}`;
}; 