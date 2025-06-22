import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import themeReducer from './themeSlice';
import settingsReducer from './settingsSlice';

const themePersistConfig = {
  key: 'theme',
  storage,
  whitelist: ['favorites', 'customThemes'], // Sadece favorites ve customThemes'i kaydet
};

const settingsPersistConfig = {
  key: 'settings',
  storage,
  whitelist: ['haptics', 'soundEffects', 'unitFormat', 'decimalSeparator'], // Settings'leri kaydet
};

export const store = configureStore({
  reducer: {
    theme: persistReducer(themePersistConfig, themeReducer),
    settings: persistReducer(settingsPersistConfig, settingsReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 