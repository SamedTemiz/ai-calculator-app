import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeType, GeneratedTheme } from '@/types';
import { ThemeColors, convertAIColorsToTheme } from '@/theme/themes';

export interface ThemeState {
  currentTheme: ThemeType;
  currentAIColors: ThemeColors | null;
  customThemes: GeneratedTheme[];
  favorites: GeneratedTheme[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ThemeState = {
  currentTheme: 'light',
  currentAIColors: null,
  customThemes: [],
  favorites: [],
  isLoading: false,
  error: null,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setCurrentTheme: (state, action: PayloadAction<ThemeType>) => {
      state.currentTheme = action.payload;
      state.currentAIColors = null; // AI temasını temizle
    },
    setAIColors: (state, action: PayloadAction<ThemeColors>) => {
      state.currentAIColors = action.payload;
    },
    clearAIColors: (state) => {
      state.currentAIColors = null;
    },
    clearAllThemes: (state) => {
      // Tüm temaları güvenli bir şekilde temizle
      state.currentAIColors = null;
      state.customThemes = [];
      state.favorites = [];
      state.currentTheme = 'light'; // Varsayılan temaya dön
      state.error = null;
    },
    addCustomTheme: (state, action: PayloadAction<GeneratedTheme>) => {
      state.customThemes.push(action.payload);
    },
    addToFavorites: (state, action: PayloadAction<GeneratedTheme>) => {
      const existingIndex = state.favorites.findIndex(
        theme => theme.id === action.payload.id
      );
      if (existingIndex === -1) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(
        theme => theme.id !== action.payload
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    applyTheme: (state, action: PayloadAction<GeneratedTheme>) => {
      try {
        // AI temasını uygula
        if (action.payload.colors) {
          const fullTheme = convertAIColorsToTheme(action.payload.colors);
          state.currentAIColors = fullTheme;
          // Hazır temayı temizle
          state.currentTheme = 'custom';
        }
      } catch (error) {
        state.error = 'Tema uygulanırken hata oluştu';
        console.error('Theme application error:', error);
      }
    },
  },
});

export const {
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
  applyTheme,
} = themeSlice.actions;

export default themeSlice.reducer; 