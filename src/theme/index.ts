// Theme configuration
export const colors = {
  light: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  dark: {
    primary: '#60A5FA',
    secondary: '#A78BFA',
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    border: '#374151',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
  },
  batman: {
    primary: '#FFD700',
    secondary: '#FF6B35',
    background: '#0A0A0A',
    surface: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    border: '#333333',
    success: '#00FF00',
    warning: '#FFD700',
    error: '#FF0000',
  },
  galaxy: {
    primary: '#8B5CF6',
    secondary: '#EC4899',
    background: '#0F0F23',
    surface: '#1A1A2E',
    text: '#FFFFFF',
    textSecondary: '#E0E0E0',
    border: '#2D2D44',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const;

export const borderRadius = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  glow: '0 0 20px rgba(59, 130, 246, 0.5)',
} as const;

export const typography = {
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const transitions = {
  fast: '150ms ease-in-out',
  normal: '200ms ease-in-out',
  slow: '300ms ease-in-out',
} as const; 