import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addCustomTheme, setLoading, setError, clearError, setAIColors, addToFavorites, applyTheme } from '@/store/themeSlice';
import { generateThemeFromPrompt, getUsageStats, GeneratedTheme } from '@/api/aiService';
import { convertAIColorsToTheme, getThemeColors } from '@/theme/themes';
import { EXAMPLE_PROMPTS } from '@/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from 'react-i18next';
import AIInputBox from '@/components/AIInputBox';
import ThemeSelector from '@/components/ThemeSelector';
import { 
  Sparkles, 
  Palette, 
  Cpu, 
  Heart, 
  CheckCircle, 
  Loader2,
  Zap,
  Star,
  BarChart3,
  AlertCircle,
  Trash2
} from 'lucide-react';
import Navigation from '@/components/Navigation';

const AIThemeScreen = () => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTheme, setGeneratedTheme] = useState<GeneratedTheme | null>(null);
  const [usageStats, setUsageStats] = useState(getUsageStats());
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.theme.favorites);
  const currentTheme = useAppSelector(state => state.theme.currentTheme);
  const currentAIColors = useAppSelector(state => state.theme.currentAIColors);
  const themeColors = getThemeColors(currentTheme, currentAIColors);

  // Kullanım istatistiklerini güncelle
  useEffect(() => {
    const updateStats = () => setUsageStats(getUsageStats());
    updateStats();
    
    // Her 30 saniyede bir güncelle
    const interval = setInterval(updateStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Hata',
        description: 'Lütfen bir tema açıklaması girin',
        variant: 'destructive',
      });
      return;
    }

    // Kullanım limitini kontrol et
    if (usageStats.user.remaining <= 0) {
      toast({
        title: 'Limit Aşıldı',
        description: 'Günlük kullanım limitiniz doldu. Yarın tekrar deneyin.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const theme = await generateThemeFromPrompt(prompt.trim());
      setGeneratedTheme(theme);
      
      // İstatistikleri güncelle
      setUsageStats(getUsageStats());
      
      // Temayı otomatik olarak uygula
      dispatch(applyTheme(theme));
      
      toast({
        title: 'Başarılı!',
        description: `${theme.name} teması oluşturuldu ve uygulandı`,
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Tema oluşturulurken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePromptClick = (example: string) => {
    setPrompt(example);
  };

  const handleSaveToFavorites = () => {
    if (generatedTheme) {
      const isAlreadyFavorite = favorites.some(fav => fav.id === generatedTheme.id);
      
      if (isAlreadyFavorite) {
        toast({
          title: 'Zaten Favorilerde',
          description: 'Bu tema zaten favorilerinizde',
        });
        return;
      }

      dispatch(addToFavorites(generatedTheme));
      toast({
        title: 'Favorilere Eklendi',
        description: `${generatedTheme.name} teması favorilere eklendi`,
      });
    }
  };

  const handleRemoveFavorite = (themeId: string) => {
    dispatch({ type: 'theme/removeFromFavorites', payload: themeId });
  };

  const handleApplyFavorite = (theme: GeneratedTheme) => {
    dispatch(applyTheme(theme));
    toast({
      title: 'Tema Uygulandı',
      description: `${theme.name} teması uygulandı`,
    });
  };

  const getThemeTypeIcon = (type: string) => {
    switch (type) {
      case 'predefined':
        return <Star className="w-4 h-4" />;
      case 'ai-generated':
        return <Sparkles className="w-4 h-4" />;
      case 'algorithm-generated':
        return <Cpu className="w-4 h-4" />;
      default:
        return <Palette className="w-4 h-4" />;
    }
  };

  const getThemeTypeLabel = (type: string) => {
    switch (type) {
      case 'predefined':
        return t('aitheme.theme_type_predefined');
      case 'ai-generated':
        return t('aitheme.theme_type_ai_generated');
      case 'algorithm-generated':
        return t('aitheme.theme_type_algorithm_generated');
      default:
        return t('aitheme.theme_type_custom');
    }
  };

  const getThemeTypeColor = (type: string) => {
    switch (type) {
      case 'predefined':
        return 'bg-yellow-500';
      case 'ai-generated':
        return 'bg-purple-500';
      case 'algorithm-generated':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="h-screen bg-background-gradient text-foreground flex flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">{t('aitheme.ai_generator_title')}</h1>
          </div>
        </div>
      </div>
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-[calc(88px+env(safe-area-inset-bottom))]"> {/* Match CalculatorScreen bottom spacing */}
        {/* 1. AI Theme Generator */}
        <Card>
          <CardHeader>
            <CardTitle>{t('aitheme.ai_generator_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <AIInputBox 
              onSubmit={handleGenerate} 
              value={prompt}
              onValueChange={setPrompt}
            />
          </CardContent>
        </Card>
        {/* 2. Example Prompts */}
        <Card>
          <CardHeader>
            <CardTitle>{t('aitheme.example_prompts_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((example) => (
                <Button
                  key={example.prompt}
                  variant="ghost"
                  className="bg-surface hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                  onClick={() => handlePromptClick(example.prompt)}
                >
                  {t(`prompts.${example.prompt.toLowerCase().replace(/\s/g, '_')}`, example.label)}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span>{t('aitheme.example_prompts_note')}</span>
            </p>
          </CardContent>
        </Card>
        {/* 3. Favoriye Alınmış Temalar (Favorites) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" /> {t('aitheme.favorites')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {favorites.length > 0 ? (
              favorites.map((theme) => (
                <div key={theme.id} className="flex items-center justify-between p-2 bg-surface rounded-lg">
                  <span className="font-medium">{theme.name}</span>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => handleApplyFavorite(theme)}>
                      <Palette className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleRemoveFavorite(theme.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">{t('aitheme.no_favorites')}</p>
            )}
          </CardContent>
        </Card>
        {/* 4. Pre-made Themes */}
        <Card>
          <CardHeader>
            <CardTitle>{t('aitheme.premade_themes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ThemeSelector />
          </CardContent>
        </Card>
        {/* 5. Kullanım İstatistikleri */}
        {usageStats && usageStats.user && usageStats.perMinute && (
          <div className="p-4 bg-surface rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-foreground">{t('aitheme.usage_stats')}</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-foreground">{t('aitheme.daily_limit')}</span>
                  <span className="text-sm text-muted-foreground">{usageStats.user.used} / {usageStats.user.total}</span>
                </div>
                <Progress value={(usageStats.user.used / usageStats.user.total) * 100} />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-foreground">{t('aitheme.minute_limit')}</span>
                  <span className="text-sm text-muted-foreground">{usageStats.perMinute.used} / {usageStats.perMinute.limit}</span>
                </div>
                <Progress value={(usageStats.perMinute.used / usageStats.perMinute.limit) * 100} color={themeColors.secondary} />
              </div>
            </div>
          </div>
        )}
        {/* Oluşturulan Tema Kartı (AI ile üretilen) */}
        {generatedTheme && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  {t('aitheme.generated_theme_title')}
                </CardTitle>
                <Badge 
                  variant="secondary" 
                  className={`flex items-center gap-1 ${getThemeTypeColor(generatedTheme.preview.split(':')[0] as any)}`}
                >
                  {getThemeTypeIcon(generatedTheme.preview.split(':')[0] as any)}
                  {getThemeTypeLabel(generatedTheme.preview.split(':')[0] as any)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t('aitheme.primary')}</label>
                  <div 
                    className="h-12 rounded-lg border-2 border-border"
                    style={{ backgroundColor: generatedTheme.colors.primary }}
                  />
                  <p className="text-xs text-muted-foreground">{generatedTheme.colors.primary}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t('aitheme.secondary')}</label>
                  <div 
                    className="h-12 rounded-lg border-2 border-border"
                    style={{ backgroundColor: generatedTheme.colors.secondary }}
                  />
                  <p className="text-xs text-muted-foreground">{generatedTheme.colors.secondary}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t('aitheme.background')}</label>
                  <div 
                    className="h-12 rounded-lg border-2 border-border"
                    style={{ backgroundColor: generatedTheme.colors.background }}
                  />
                  <p className="text-xs text-muted-foreground">{generatedTheme.colors.background}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t('aitheme.text')}</label>
                  <div 
                    className="h-12 rounded-lg border-2 border-border flex items-center justify-center"
                    style={{ backgroundColor: generatedTheme.colors.background }}
                  >
                    <span style={{ color: generatedTheme.colors.text }} className="text-sm font-medium">
                      {t('aitheme.sample_text')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{generatedTheme.colors.text}</p>
                </div>
              </div>
              <Separator />
              <div className="flex gap-2">
                <Button 
                  onClick={handleSaveToFavorites} 
                  variant="outline"
                  className="flex-1"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  {t('aitheme.add_to_favorites')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      {/* Fixed Bottom Navigation */}
      <Navigation currentScreen="ai-theme" onScreenChange={() => {}} />
    </div>
  );
};

export default AIThemeScreen;
