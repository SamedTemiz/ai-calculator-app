import React from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heart, Languages, Trash2, Palette } from 'lucide-react';
import { GeneratedTheme } from '@/types';

const SettingsScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const {
    haptics,
    soundEffects,
    favorites,
    handleToggleHaptics,
    handleToggleSoundEffects,
    handleSetLanguage,
    handleClearAITheme,
    handleClearAllThemes,
    handleRemoveFavorite,
    handleApplyFavorite,
  } = useSettings();

  const handleLanguageChange = (lang: 'en' | 'tr') => {
    i18n.changeLanguage(lang);
    handleSetLanguage(lang);
  };
  
  const handleApplyFavoriteTheme = (theme: GeneratedTheme) => {
    handleApplyFavorite(theme);
    // Optional: Add toast feedback here
  };

  return (
    <div className="min-h-screen bg-background-gradient text-foreground p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.general_settings')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="haptics-switch" className="font-medium">
              {t('settings.haptic_feedback')}
            </label>
            <Switch
              id="haptics-switch"
              checked={haptics}
              onCheckedChange={handleToggleHaptics}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <label htmlFor="sound-switch" className="font-medium">
              {t('settings.sound_effects')}
            </label>
            <Switch
              id="sound-switch"
              checked={soundEffects}
              onCheckedChange={handleToggleSoundEffects}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5" /> {t('settings.language')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button
            variant={i18n.language === 'en' ? 'default' : 'outline'}
            onClick={() => handleLanguageChange('en')}
            className="flex-1"
            data-testid="lang-en-button"
          >
            English
          </Button>
          <Button
            variant={i18n.language === 'tr' ? 'default' : 'outline'}
            onClick={() => handleLanguageChange('tr')}
            className="flex-1"
            data-testid="lang-tr-button"
          >
            Türkçe
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" /> {t('settings.favorite_themes')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {favorites.length > 0 ? (
            favorites.map((theme) => (
              <div key={theme.id} className="flex items-center justify-between p-2 bg-surface rounded-lg">
                <span className="font-medium">{theme.name}</span>
                <div className="flex gap-2">
                   <Button size="icon" variant="ghost" onClick={() => handleApplyFavoriteTheme(theme)} data-testid={`apply-theme-${theme.id}`}>
                    <Palette className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleRemoveFavorite(theme.id)} data-testid={`remove-theme-${theme.id}`}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">{t('settings.no_favorite_themes')}</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.data_management')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="destructive" onClick={handleClearAITheme} className="w-full" data-testid="clear-ai-theme-button">
            {t('settings.clear_ai_theme')}
          </Button>
          <Button variant="destructive" onClick={handleClearAllThemes} className="w-full" data-testid="clear-all-themes-button">
            {t('settings.clear_all_themes')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsScreen;
