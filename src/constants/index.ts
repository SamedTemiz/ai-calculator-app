// App-wide constants
export const ROUTES = {
  HOME: '/',
  CALCULATOR: '/calculator',
  SETTINGS: '/settings',
  AI_THEME: '/ai-theme',
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  BATMAN: 'batman',
  GALAXY: 'galaxy',
} as const;

export const UNIT_FORMATS = {
  DECIMAL: 'decimal',
  SCIENTIFIC: 'scientific',
  ENGINEERING: 'engineering',
} as const;

export const CALCULATOR_OPERATIONS = {
  ADD: '+',
  SUBTRACT: '-',
  MULTIPLY: '×',
  DIVIDE: '÷',
  EQUALS: '=',
} as const;

export const CALCULATOR_SPECIAL_KEYS = {
  CLEAR: 'C',
  CLEAR_ENTRY: 'CE',
  BACKSPACE: '⌫',
  DECIMAL: '.',
} as const;

export const EXAMPLE_PROMPTS = [
  { label: 'Neon Cyberpunk', prompt: 'Neon Cyberpunk' },
  { label: 'Ocean Sunset', prompt: 'Ocean Sunset' },
  { label: 'Forest Night', prompt: 'Forest Night' },
  { label: 'Galaxy Purple', prompt: 'Galaxy Purple' },
  { label: 'Retro Gaming', prompt: 'Retro Gaming' },
  { label: 'Minimal White', prompt: 'Minimal White' },
  { label: 'Dark Tech', prompt: 'Dark Tech' },
  { label: 'Warm Coffee', prompt: 'Warm Coffee' },
];

export const NAVIGATION_ITEMS = [
  { id: 'calculator' as const, icon: 'Calculator', label: 'Calculator' },
  { id: 'settings' as const, icon: 'Settings', label: 'Settings' },
  { id: 'ai-theme' as const, icon: 'Palette', label: 'AI Theme' },
] as const; 