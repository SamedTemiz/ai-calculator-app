import React from 'react';
import { ScreenType } from '@/types';
import CalculatorScreen from '@/screens/CalculatorScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import AIThemeScreen from '@/screens/AIThemeScreen';

interface AppNavigatorProps {
  currentScreen: ScreenType;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({ currentScreen }) => {
  const renderScreen = () => {
    switch (currentScreen) {
      case 'calculator':
        return <CalculatorScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'ai-theme':
        return <AIThemeScreen />;
      default:
        return <CalculatorScreen />;
    }
  };

  return <>{renderScreen()}</>;
};

export default AppNavigator; 