// App-wide types
export type ScreenType = 'calculator' | 'settings' | 'ai-theme';

export type ThemeType = 'light' | 'dark' | 'batman' | 'galaxy' | 'custom';

export type UnitFormat = 'decimal' | 'scientific' | 'engineering';

export interface CalculatorState {
  display: string;
  previousValue: string | null;
  operation: string | null;
  waitingForNewValue: boolean;
}

export interface AppSettings {
  haptics: boolean;
  soundEffects: boolean;
  unitFormat: UnitFormat;
  currentTheme: ThemeType;
}

export interface GeneratedTheme {
  id: string;
  name: string;
  prompt: string;
  preview: string;
  colors?: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}

export interface CalcKeyProps {
  value: string;
  onClick: () => void;
  className?: string;
  variant?: 'number' | 'operator' | 'special';
  size?: 'normal' | 'wide';
}

export interface ThemeButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  isActive?: boolean;
}

export interface AIInputBoxProps {
  onSubmit: (prompt: string) => void;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface NavigationProps {
  currentScreen: ScreenType;
  onScreenChange: (screen: ScreenType) => void;
}