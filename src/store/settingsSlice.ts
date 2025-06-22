import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { UnitFormat } from '@/types';

export interface SettingsState {
  haptics: boolean;
  soundEffects: boolean;
  unitFormat: UnitFormat;
  decimalSeparator: string;
  showHistory: boolean;
  language: 'en' | 'tr';
}

const initialState: SettingsState = {
  haptics: true,
  soundEffects: true,
  unitFormat: 'decimal',
  decimalSeparator: '.',
  showHistory: false,
  language: 'en',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleHaptics: (state) => {
      state.haptics = !state.haptics;
    },
    toggleSoundEffects: (state) => {
      state.soundEffects = !state.soundEffects;
    },
    setUnitFormat: (state, action: PayloadAction<UnitFormat>) => {
      state.unitFormat = action.payload;
    },
    setDecimalSeparator: (state, action: PayloadAction<string>) => {
      state.decimalSeparator = action.payload;
    },
    toggleShowHistory: (state) => {
      state.showHistory = !state.showHistory;
    },
    setLanguage: (state, action: PayloadAction<'en' | 'tr'>) => {
      state.language = action.payload;
    },
  },
});

export const {
  toggleHaptics,
  toggleSoundEffects,
  setUnitFormat,
  setDecimalSeparator,
  toggleShowHistory,
  setLanguage,
} = settingsSlice.actions;

export const selectSettings = (state: RootState) => state.settings;

export default settingsSlice.reducer; 