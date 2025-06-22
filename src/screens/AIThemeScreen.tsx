import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addCustomTheme, setLoading, setError, clearError, setAIColors, addToFavorites, applyTheme } from '@/store/themeSlice';
import { generateThemeFromPrompt, getUsageStats, GeneratedTheme } from '@/api/aiService';
import { convertAIColorsToTheme } from '@/theme/themes';
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
  AlertCircle
} from 'lucide-react';

const AIThemeScreen = () => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTheme, setGeneratedTheme] = useState<GeneratedTheme | null>(null);
  const [usageStats, setUsageStats] = useState(getUsageStats());
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.theme.favorites);

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
        return 'Hazır Tema';
      case 'ai-generated':
        return 'AI Üretimi';
      case 'algorithm-generated':
        return 'Algoritma Üretimi';
      default:
        return 'Özel Tema';
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
    <div className="min-h-screen bg-background-gradient text-foreground">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">AI Tema Üretici</h1>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="p-4 space-y-6 pb-20">
        {/* Pre-made Themes */}
        <Card>
          <CardHeader>
            <CardTitle>{t('aitheme.premade_themes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ThemeSelector />
          </CardContent>
        </Card>

        {/* AI Theme Generation */}
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

        {generatedTheme && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Oluşturulan Tema
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
                  <label className="text-sm font-medium text-foreground">Primary</label>
                  <div 
                    className="h-12 rounded-lg border-2 border-border"
                    style={{ backgroundColor: generatedTheme.colors.primary }}
                  />
                  <p className="text-xs text-muted-foreground">{generatedTheme.colors.primary}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Secondary</label>
                  <div 
                    className="h-12 rounded-lg border-2 border-border"
                    style={{ backgroundColor: generatedTheme.colors.secondary }}
                  />
                  <p className="text-xs text-muted-foreground">{generatedTheme.colors.secondary}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Background</label>
                  <div 
                    className="h-12 rounded-lg border-2 border-border"
                    style={{ backgroundColor: generatedTheme.colors.background }}
                  />
                  <p className="text-xs text-muted-foreground">{generatedTheme.colors.background}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Text</label>
                  <div 
                    className="h-12 rounded-lg border-2 border-border flex items-center justify-center"
                    style={{ backgroundColor: generatedTheme.colors.background }}
                  >
                    <span style={{ color: generatedTheme.colors.text }} className="text-sm font-medium">
                      Örnek Metin
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
                  Favorilere Ekle
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Example Prompts */}
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

        {/* Usage Stats */}
        {usageStats && usageStats.user && usageStats.perMinute && (
          <div className="p-4 bg-surface rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-foreground">Kullanım İstatistikleri</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-foreground">Günlük Limit</span>
                  <span className="text-sm text-muted-foreground">{usageStats.user.used} / {usageStats.user.total}</span>
                </div>
                <Progress value={(usageStats.user.used / usageStats.user.total) * 100} />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-foreground">Dakika Limiti</span>
                  <span className="text-sm text-muted-foreground">{usageStats.perMinute.used} / {usageStats.perMinute.limit}</span>
                </div>
                <Progress value={(usageStats.perMinute.used / usageStats.perMinute.limit) * 100} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIThemeScreen;
