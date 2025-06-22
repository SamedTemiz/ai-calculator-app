import React from 'react';
import { Calculator, Settings, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavigationProps } from '@/types';
import { NAVIGATION_ITEMS } from '@/constants';
import { triggerHapticFeedback, playSoundEffect } from '@/utils';
import { useTranslation } from 'react-i18next';

const Navigation: React.FC<NavigationProps> = ({ currentScreen, onScreenChange }) => {
  const { t } = useTranslation();
  const iconMap = {
    Calculator,
    Settings,
    Palette,
  };

  const handleScreenChange = (screen: typeof currentScreen) => {
    triggerHapticFeedback();
    playSoundEffect('click');
    onScreenChange(screen);
  };

  const navItems = [
    { id: 'calculator', label: t('navigation.calculator'), icon: 'Calculator' },
    { id: 'ai-theme', label: t('navigation.ai_theme'), icon: 'Palette' },
    { id: 'settings', label: t('navigation.settings'), icon: 'Settings' },
  ] as const;

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 backdrop-blur-md border-t px-4 py-2 z-50"
      style={{ 
        background: 'var(--surface-color)',
        borderColor: 'var(--border-color)'
      }}
    >
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map(({ id, icon, label }) => {
          const IconComponent = iconMap[icon];
          
          return (
            <button
              key={id}
              onClick={() => handleScreenChange(id)}
              className={cn(
                "flex flex-col items-center p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
                currentScreen === id 
                  ? "ring-2 ring-offset-2" 
                  : "hover:bg-[var(--button-number)]/50"
              )}
              style={{
                color: currentScreen === id ? 'var(--primary-color)' : 'var(--text-secondary)',
                background: currentScreen === id ? 'var(--primary-color)' + '20' : 'transparent',
                borderColor: currentScreen === id ? 'var(--primary-color)' : 'transparent',
              }}
              aria-label={`Navigate to ${label}`}
              aria-current={currentScreen === id ? 'page' : undefined}
              type="button"
            >
              <IconComponent size={24} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
