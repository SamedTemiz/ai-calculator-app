import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCurrentTheme } from '@/store/themeSlice';
import { ThemeType } from '@/types';
import { THEMES } from '@/constants';
import { cn } from '@/lib/utils';

const ThemeSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);

  const themeOptions = [
    { value: THEMES.LIGHT, label: 'Light', icon: '☀️' },
    { value: THEMES.DARK, label: 'Dark', icon: '🌙' },
    { value: THEMES.BATMAN, label: 'Batman', icon: '🦇' },
    { value: THEMES.GALAXY, label: 'Galaxy', icon: '🌌' },
  ];

  const handleThemeChange = (theme: ThemeType) => {
    dispatch(setCurrentTheme(theme));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
        Choose Theme
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {themeOptions.map((theme) => (
          <button
            key={theme.value}
            onClick={() => handleThemeChange(theme.value as ThemeType)}
            className={cn(
              "p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105",
              currentTheme === theme.value
                ? "border-[var(--primary-color)] shadow-lg"
                : "border-[var(--border-color)] hover:border-[var(--primary-color)]"
            )}
            style={{ background: 'var(--surface-color)' }}
          >
            <div className="text-2xl mb-2">{theme.icon}</div>
            <div className="font-medium" style={{ color: 'var(--text-color)' }}>
              {theme.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector; 