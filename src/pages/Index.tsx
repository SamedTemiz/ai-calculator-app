import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import AppNavigator from '@/navigation/AppNavigator';
import { ScreenType } from '@/types';

const Index: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('calculator');

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="max-w-md mx-auto backdrop-blur-sm min-h-screen relative" style={{ background: 'var(--surface-color)' }}>
        <AppNavigator currentScreen={currentScreen} />
        <Navigation 
          currentScreen={currentScreen} 
          onScreenChange={setCurrentScreen} 
        />
      </div>
    </div>
  );
};

export default Index;
