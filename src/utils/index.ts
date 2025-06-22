// Utility functions
import { CalculatorState, UnitFormat } from '@/types';

/**
 * Format number based on unit format
 */
export const formatNumber = (value: number, format: UnitFormat): string => {
  switch (format) {
    case 'scientific':
      return value.toExponential(6);
    case 'engineering':
      return value.toExponential(3);
    default:
      return value.toString();
  }
};

/**
 * Validate calculator input
 */
export const validateCalculatorInput = (input: string): boolean => {
  // Prevent multiple decimal points
  if (input.includes('.') && input.split('.').length > 2) {
    return false;
  }
  
  // Prevent leading zeros (except for decimal numbers)
  if (input.length > 1 && input[0] === '0' && input[1] !== '.') {
    return false;
  }
  
  return true;
};

/**
 * Calculate result based on operation
 */
export const calculateResult = (
  firstValue: string,
  secondValue: string,
  operation: string
): number => {
  const prev = parseFloat(firstValue);
  const current = parseFloat(secondValue);

  if (isNaN(prev) || isNaN(current)) {
    return 0;
  }

  switch (operation) {
    case '+':
      return prev + current;
    case '-':
      return prev - current;
    case '×':
      return prev * current;
    case '÷':
      return current !== 0 ? prev / current : 0;
    default:
      return current;
  }
};

/**
 * Handle backspace operation
 */
export const handleBackspace = (display: string): string => {
  if (display.length === 1) {
    return '0';
  }
  return display.slice(0, -1);
};

/**
 * Handle decimal input
 */
export const handleDecimalInput = (display: string): string => {
  if (display.includes('.')) {
    return display; // Already has decimal
  }
  return display + '.';
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Check if device supports haptic feedback
 */
export const supportsHaptics = (): boolean => {
  return 'vibrate' in navigator;
};

/**
 * Trigger haptic feedback
 */
export const triggerHapticFeedback = (pattern: number | number[] = 50): void => {
  if (supportsHaptics()) {
    navigator.vibrate(pattern);
  }
};

/**
 * Play sound effect (placeholder for future implementation)
 */
export const playSoundEffect = (type: 'click' | 'success' | 'error'): void => {
  // TODO: Implement sound effects
  console.log(`Playing sound: ${type}`);
};

/**
 * Save to localStorage with error handling
 */
export const saveToStorage = (key: string, value: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

/**
 * Load from localStorage with error handling
 */
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
}; 