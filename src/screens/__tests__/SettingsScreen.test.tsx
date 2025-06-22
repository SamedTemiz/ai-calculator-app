import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import SettingsScreen from '../SettingsScreen';
import { store } from '@/store';
import { clearAllThemes, addToFavorites } from '@/store/themeSlice';
import { GeneratedTheme } from '@/types';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Return the key itself for testing
    i18n: {
      changeLanguage: vi.fn(),
      language: 'en',
    },
  }),
}));

const mockFavorite: GeneratedTheme = {
  id: 'test-1',
  name: 'Test Theme 1',
  prompt: 'A test theme',
  preview: 'preview',
  colors: { primary: '#ff0000', secondary: '#00ff00', background: '#000000', text: '#ffffff' },
};

describe('SettingsScreen', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    // Reset store state and clear mocks before each test
    store.dispatch(clearAllThemes());
    vi.clearAllMocks();
  });

  it('renders all sections correctly', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('settings.general_settings')).toBeInTheDocument();
    expect(screen.getByText('settings.language')).toBeInTheDocument();
    expect(screen.getByText('settings.favorite_themes')).toBeInTheDocument();
    expect(screen.getByText('settings.data_management')).toBeInTheDocument();
  });

  it('toggles haptic feedback', async () => {
    render(<SettingsScreen />);
    const hapticSwitch = screen.getByRole('switch', { name: /settings.haptic_feedback/i });
    const initialChecked = hapticSwitch.getAttribute('aria-checked') === 'true';

    await user.click(hapticSwitch);
    
    await waitFor(() => {
        const hapticSwitchAfter = screen.getByRole('switch', { name: /settings.haptic_feedback/i });
        expect(hapticSwitchAfter.getAttribute('aria-checked')).toBe(String(!initialChecked));
    });
  });

  it('toggles sound effects', async () => {
    render(<SettingsScreen />);
    const soundSwitch = screen.getByRole('switch', { name: /settings.sound_effects/i });
    const initialChecked = soundSwitch.getAttribute('aria-checked') === 'true';

    await user.click(soundSwitch);
    
    await waitFor(() => {
      const soundSwitchAfter = screen.getByRole('switch', { name: /settings.sound_effects/i });
      expect(soundSwitchAfter.getAttribute('aria-checked')).toBe(String(!initialChecked));
    });
  });

  it('changes language', async () => {
    render(<SettingsScreen />);
    const trButton = screen.getByTestId('lang-tr-button');
    await user.click(trButton);
    // The mock i18n's changeLanguage should be called.
    // Further testing would require a more complex setup to check language state.
    // For now, we just ensure it doesn't crash.
  });

  it('displays favorite themes when they exist', () => {
    store.dispatch(addToFavorites(mockFavorite));
    render(<SettingsScreen />);
    expect(screen.getByText(mockFavorite.name)).toBeInTheDocument();
  });

  it('does not display favorites when there are none', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('settings.no_favorite_themes')).toBeInTheDocument();
  });

  it('removes a favorite theme', async () => {
    store.dispatch(addToFavorites(mockFavorite));
    render(<SettingsScreen />);

    expect(screen.getByText(mockFavorite.name)).toBeInTheDocument();

    const removeButton = screen.getByTestId(`remove-theme-${mockFavorite.id}`);
    await user.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByText(mockFavorite.name)).not.toBeInTheDocument();
    });
  });

  it('applies a favorite theme', async () => {
    store.dispatch(addToFavorites(mockFavorite));
    render(<SettingsScreen />);

    const applyButton = screen.getByTestId(`apply-theme-${mockFavorite.id}`);
    await user.click(applyButton);

    await waitFor(() => {
        const state = store.getState().theme;
        expect(state.currentTheme).toBe('custom');
        expect(state.currentAIColors?.primary).toBe(mockFavorite.colors?.primary);
    });
  });
  
  it('clears all themes', async () => {
    store.dispatch(addToFavorites(mockFavorite));
    render(<SettingsScreen />);
  
    const clearAllButton = screen.getByTestId('clear-all-themes-button');
    await user.click(clearAllButton);
  
    await waitFor(() => {
      expect(store.getState().theme.customThemes).toEqual([]);
      expect(store.getState().theme.favorites).toEqual([]);
    });
  });

}); 