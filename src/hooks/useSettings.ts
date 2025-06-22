import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  toggleHaptics, 
  toggleSoundEffects, 
  setLanguage,
  selectSettings 
} from '@/store/settingsSlice';
import { 
  clearAIColors, 
  clearAllThemes, 
  removeFromFavorites, 
  applyTheme,
  setCurrentTheme
} from '@/store/themeSlice';
import { GeneratedTheme, ThemeType } from '@/types';

export const useSettings = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);
  const themeState = useAppSelector((state) => state.theme);

  const handleToggleHaptics = () => {
    dispatch(toggleHaptics());
  };

  const handleToggleSoundEffects = () => {
    dispatch(toggleSoundEffects());
  };

  const handleSetLanguage = (lang: 'en' | 'tr') => {
    dispatch(setLanguage(lang));
  };

  const handleSetCurrentTheme = (theme: ThemeType) => {
    dispatch(setCurrentTheme(theme));
  };

  const handleClearAITheme = () => {
    dispatch(clearAIColors());
  };

  const handleClearAllThemes = () => {
    dispatch(clearAllThemes());
  };

  const handleRemoveFavorite = (themeId: string) => {
    dispatch(removeFromFavorites(themeId));
  };

  const handleApplyFavorite = (theme: GeneratedTheme) => {
    dispatch(applyTheme(theme));
  };

  return {
    haptics: settings.haptics,
    soundEffects: settings.soundEffects,
    language: settings.language,
    favorites: themeState.favorites,
    currentTheme: themeState.currentTheme,
    handleToggleHaptics,
    handleToggleSoundEffects,
    handleSetLanguage,
    handleSetCurrentTheme,
    handleClearAITheme,
    handleClearAllThemes,
    handleRemoveFavorite,
    handleApplyFavorite,
  };
}; 