import { describe, it, expect, beforeEach } from 'vitest';
import themeReducer, { 
  setCurrentTheme, 
  setAIColors, 
  clearAIColors, 
  clearAllThemes,
  addCustomTheme, 
  addToFavorites, 
  removeFromFavorites,
  setLoading,
  setError,
  clearError,
  applyTheme
} from '../themeSlice';
import { ThemeType, GeneratedTheme } from '@/types';
import { ThemeColors } from '@/theme/themes';

describe('themeSlice', () => {
  const initialState = {
    currentTheme: 'light' as ThemeType,
    currentAIColors: null,
    customThemes: [],
    favorites: [],
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    // Reset localStorage before each test
    localStorage.clear();
  });

  describe('initial state', () => {
    it('should return initial state', () => {
      const state = themeReducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('setCurrentTheme', () => {
    it('should set current theme and clear AI colors', () => {
      const state = {
        ...initialState,
        currentAIColors: { primary: '#000000' } as ThemeColors,
      };

      const newState = themeReducer(state, setCurrentTheme('dark'));
      
      expect(newState.currentTheme).toBe('dark');
      expect(newState.currentAIColors).toBeNull();
    });
  });

  describe('setAIColors', () => {
    it('should set AI colors', () => {
      const aiColors: ThemeColors = {
        primary: '#FF0000',
        secondary: '#00FF00',
        background: '#000000',
        surface: '#111111',
        text: '#FFFFFF',
        textSecondary: '#CCCCCC',
        border: '#333333',
        shadow: '#000000',
        button: {
          number: '#222222',
          operator: '#444444',
          special: '#666666',
        },
        display: {
          background: '#000000',
          text: '#FFFFFF',
        },
      };

      const newState = themeReducer(initialState, setAIColors(aiColors));
      
      expect(newState.currentAIColors).toEqual(aiColors);
    });
  });

  describe('clearAIColors', () => {
    it('should clear AI colors', () => {
      const state = {
        ...initialState,
        currentAIColors: { primary: '#000000' } as ThemeColors,
      };

      const newState = themeReducer(state, clearAIColors());
      
      expect(newState.currentAIColors).toBeNull();
    });
  });

  describe('clearAllThemes', () => {
    it('should clear all themes and reset to initial state', () => {
      const state = {
        ...initialState,
        currentAIColors: { primary: '#000000' } as ThemeColors,
        customThemes: [{ id: '1', name: 'Test', prompt: 'test', preview: 'test' }],
        favorites: [{ id: '2', name: 'Favorite', prompt: 'fav', preview: 'fav' }],
        currentTheme: 'custom' as ThemeType,
        error: 'Some error',
      };

      const newState = themeReducer(state, clearAllThemes());
      
      expect(newState.currentAIColors).toBeNull();
      expect(newState.customThemes).toEqual([]);
      expect(newState.favorites).toEqual([]);
      expect(newState.currentTheme).toBe('light');
      expect(newState.error).toBeNull();
    });
  });

  describe('addCustomTheme', () => {
    it('should add custom theme to the list', () => {
      const customTheme: GeneratedTheme = {
        id: 'test-1',
        name: 'Test Theme',
        prompt: 'test prompt',
        preview: 'test preview',
        colors: {
          primary: '#FF0000',
          secondary: '#00FF00',
          background: '#000000',
          text: '#FFFFFF',
        },
      };

      const newState = themeReducer(initialState, addCustomTheme(customTheme));
      
      expect(newState.customThemes).toHaveLength(1);
      expect(newState.customThemes[0]).toEqual(customTheme);
    });
  });

  describe('addToFavorites', () => {
    it('should add theme to favorites if not already present', () => {
      const theme: GeneratedTheme = {
        id: 'test-1',
        name: 'Test Theme',
        prompt: 'test prompt',
        preview: 'test preview',
      };

      const newState = themeReducer(initialState, addToFavorites(theme));
      
      expect(newState.favorites).toHaveLength(1);
      expect(newState.favorites[0]).toEqual(theme);
    });

    it('should not add duplicate theme to favorites', () => {
      const theme: GeneratedTheme = {
        id: 'test-1',
        name: 'Test Theme',
        prompt: 'test prompt',
        preview: 'test preview',
      };

      const state = {
        ...initialState,
        favorites: [theme],
      };

      const newState = themeReducer(state, addToFavorites(theme));
      
      expect(newState.favorites).toHaveLength(1);
    });
  });

  describe('removeFromFavorites', () => {
    it('should remove theme from favorites', () => {
      const theme: GeneratedTheme = {
        id: 'test-1',
        name: 'Test Theme',
        prompt: 'test prompt',
        preview: 'test preview',
      };

      const state = {
        ...initialState,
        favorites: [theme],
      };

      const newState = themeReducer(state, removeFromFavorites('test-1'));
      
      expect(newState.favorites).toHaveLength(0);
    });

    it('should not remove theme if id does not exist', () => {
      const theme: GeneratedTheme = {
        id: 'test-1',
        name: 'Test Theme',
        prompt: 'test prompt',
        preview: 'test preview',
      };

      const state = {
        ...initialState,
        favorites: [theme],
      };

      const newState = themeReducer(state, removeFromFavorites('non-existent'));
      
      expect(newState.favorites).toHaveLength(1);
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      const newState = themeReducer(initialState, setLoading(true));
      
      expect(newState.isLoading).toBe(true);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const errorMessage = 'Something went wrong';
      const newState = themeReducer(initialState, setError(errorMessage));
      
      expect(newState.error).toBe(errorMessage);
    });

    it('should clear error when null is passed', () => {
      const state = {
        ...initialState,
        error: 'Previous error',
      };

      const newState = themeReducer(state, setError(null));
      
      expect(newState.error).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      const state = {
        ...initialState,
        error: 'Some error',
      };

      const newState = themeReducer(state, clearError());
      
      expect(newState.error).toBeNull();
    });
  });

  describe('applyTheme', () => {
    it('should apply theme with colors', () => {
      const theme: GeneratedTheme = {
        id: 'test-1',
        name: 'Test Theme',
        prompt: 'test prompt',
        preview: 'test preview',
        colors: {
          primary: '#FF0000',
          secondary: '#00FF00',
          background: '#000000',
          text: '#FFFFFF',
        },
      };

      const newState = themeReducer(initialState, applyTheme(theme));
      
      expect(newState.currentAIColors).toBeDefined();
      expect(newState.currentTheme).toBe('custom');
    });

    it('should handle theme without colors gracefully', () => {
      const theme: GeneratedTheme = {
        id: 'test-1',
        name: 'Test Theme',
        prompt: 'test prompt',
        preview: 'test preview',
      };

      const newState = themeReducer(initialState, applyTheme(theme));
      
      expect(newState.currentAIColors).toBeNull();
      expect(newState.currentTheme).toBe('light');
    });

    it('should not set error if convertAIColorsToTheme returns an invalid color', () => {
      const invalidTheme: GeneratedTheme = {
        id: 'test-1',
        name: 'Test Theme',
        prompt: 'test prompt',
        preview: 'test preview',
        colors: {
          primary: 'invalid-color',
          secondary: '#00FF00',
          background: '#000000',
          text: '#FFFFFF',
        },
      };
      const newState = themeReducer(initialState, applyTheme(invalidTheme));
      expect(newState.error).toBeNull();
    });
  });
}); 