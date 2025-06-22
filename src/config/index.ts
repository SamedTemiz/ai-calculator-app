// App configuration
export const APP_CONFIG = {
  name: 'AI Calculator App',
  version: '1.0.0',
  description: 'A modern calculator with AI-powered theme generation',
  author: 'AI Calculator Team',
  repository: 'https://github.com/your-username/ai-calculator-app',
} as const;

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  retries: 3,
} as const;

export const STORAGE_KEYS = {
  SETTINGS: 'calculator-settings',
  THEMES: 'ai-generated-themes',
  HISTORY: 'calculator-history',
} as const;

export const FEATURE_FLAGS = {
  AI_THEME_GENERATION: true,
  HAPTIC_FEEDBACK: true,
  SOUND_EFFECTS: false,
  THEME_PERSISTENCE: true,
  CALCULATOR_HISTORY: false,
} as const;

export const UI_CONFIG = {
  maxDisplayLength: 12,
  animationDuration: 200,
  hapticPattern: 50,
  soundVolume: 0.5,
} as const; 