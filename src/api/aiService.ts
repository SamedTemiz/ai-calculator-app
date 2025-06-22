import { GeneratedTheme } from '@/types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// API Keys
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

// API Clients
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true }) : null;
const anthropic = ANTHROPIC_API_KEY ? new Anthropic({ apiKey: ANTHROPIC_API_KEY, dangerouslyAllowBrowser: true }) : null;

// API Kullanım Limitleri
const API_LIMITS = {
  GEMINI: { daily: 15, perMinute: 2 }, // Gemini ücretsiz limiti
  OPENAI: { daily: 20, perMinute: 3 }, // OpenAI ücretsiz limiti (yaklaşık)
  ANTHROPIC: { daily: 5, perMinute: 1 }, // Anthropic ücretsiz limiti
  USER: { daily: 10, perMinute: 2 } // Kullanıcı bazlı limit
};

// Kullanım takibi için interface
interface UsageTracker {
  [apiName: string]: {
    daily: { count: number; date: string };
    perMinute: { count: number; timestamp: number };
  };
}

// LocalStorage'dan kullanım verilerini yükle
const loadUsageData = (): UsageTracker => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return {};
  }
  try {
    const stored = localStorage.getItem('ai_api_usage');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('Failed to load usage data from localStorage:', error);
    return {};
  }
};

// Kullanım verilerini kaydet
const saveUsageData = (data: UsageTracker): void => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }
  try {
    localStorage.setItem('ai_api_usage', JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save usage data:', error);
  }
};

// Kullanım limitini kontrol et
const checkUsageLimit = (apiName: string): { allowed: boolean; reason?: string } => {
  try {
    const usage = loadUsageData();
    const today = new Date().toDateString();
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;

    // API'ye özel limit kontrolü
    const apiLimit = API_LIMITS[apiName as keyof typeof API_LIMITS];
    if (!apiLimit) {
      return { allowed: false, reason: 'Unknown API' };
    }

    // Günlük limit kontrolü
    if (!usage[apiName] || usage[apiName].daily.date !== today) {
      // Yeni gün, sayacı sıfırla
      usage[apiName] = {
        daily: { count: 0, date: today },
        perMinute: { count: 0, timestamp: now }
      };
    } else if (usage[apiName].daily.count >= apiLimit.daily) {
      return { allowed: false, reason: `Daily limit exceeded for ${apiName} (${apiLimit.daily} requests)` };
    }

    // Dakikalık limit kontrolü
    if (usage[apiName].perMinute.timestamp < oneMinuteAgo) {
      // Yeni dakika, sayacı sıfırla
      usage[apiName].perMinute = { count: 0, timestamp: now };
    } else if (usage[apiName].perMinute.count >= apiLimit.perMinute) {
      return { allowed: false, reason: `Rate limit exceeded for ${apiName} (${apiLimit.perMinute} requests/minute)` };
    }

    // Kullanıcı bazlı limit kontrolü
    const userUsage = usage['USER'] || { daily: { count: 0, date: today }, perMinute: { count: 0, timestamp: now } };
    
    if (userUsage.daily.date !== today) {
      userUsage.daily = { count: 0, date: today };
    } else if (userUsage.daily.count >= API_LIMITS.USER.daily) {
      return { allowed: false, reason: `Daily user limit exceeded (${API_LIMITS.USER.daily} requests)` };
    }

    if (userUsage.perMinute.timestamp < oneMinuteAgo) {
      userUsage.perMinute = { count: 0, timestamp: now };
    } else if (userUsage.perMinute.count >= API_LIMITS.USER.perMinute) {
      return { allowed: false, reason: `User rate limit exceeded (${API_LIMITS.USER.perMinute} requests/minute)` };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Error checking usage limit:', error);
    return { allowed: false, reason: 'Error checking usage limits' };
  }
};

// Kullanım sayacını artır
const incrementUsage = (apiName: string): void => {
  try {
    const usage = loadUsageData();
    const today = new Date().toDateString();
    const now = Date.now();

    // API kullanımını artır
    if (!usage[apiName]) {
      usage[apiName] = {
        daily: { count: 0, date: today },
        perMinute: { count: 0, timestamp: now }
      };
    }

    usage[apiName].daily.count++;
    usage[apiName].perMinute.count++;

    // Kullanıcı kullanımını artır
    if (!usage['USER']) {
      usage['USER'] = {
        daily: { count: 0, date: today },
        perMinute: { count: 0, timestamp: now }
      };
    }

    usage['USER'].daily.count++;
    usage['USER'].perMinute.count++;

    saveUsageData(usage);
  } catch (error) {
    console.error('Error incrementing usage:', error);
  }
};

// Kullanım istatistiklerini al
export const getUsageStats = (
  // Dependency injection for testability
  usageDataLoader: () => UsageTracker = loadUsageData
) => {
  const defaultStats = {
    user: { used: 0, total: API_LIMITS.USER.daily, remaining: API_LIMITS.USER.daily },
    perMinute: { used: 0, limit: API_LIMITS.USER.perMinute },
    apis: {
      gemini: { used: 0, total: API_LIMITS.GEMINI.daily, remaining: API_LIMITS.GEMINI.daily },
      openai: { used: 0, total: API_LIMITS.OPENAI.daily, remaining: API_LIMITS.OPENAI.daily },
      anthropic: { used: 0, total: API_LIMITS.ANTHROPIC.daily, remaining: API_LIMITS.ANTHROPIC.daily },
    },
  };

  try {
    const usage = usageDataLoader();
    const today = new Date().toDateString();

    const calculateStats = (apiName: keyof typeof API_LIMITS, apiUsage: UsageTracker[string] | undefined) => {
      if (apiUsage && apiUsage.daily && apiUsage.daily.date === today) {
        const used = apiUsage.daily.count || 0;
        const total = API_LIMITS[apiName].daily;
        return {
          used: used,
          total: total,
          remaining: Math.max(0, total - used),
        };
      }
      const total = API_LIMITS[apiName].daily;
      return { used: 0, total: total, remaining: total };
    };

    const userApiUsage = usage['USER'];
    const userDailyStats = calculateStats('USER', userApiUsage);

    const perMinuteUsage = (userApiUsage && userApiUsage.perMinute && userApiUsage.perMinute.timestamp > Date.now() - 60000)
      ? userApiUsage.perMinute.count
      : 0;

    return {
      user: userDailyStats,
      perMinute: {
        used: perMinuteUsage,
        limit: API_LIMITS.USER.perMinute,
      },
      apis: {
        gemini: calculateStats('GEMINI', usage['GEMINI']),
        openai: calculateStats('OPENAI', usage['OPENAI']),
        anthropic: calculateStats('ANTHROPIC', usage['ANTHROPIC']),
      },
    };
  } catch (error) {
    console.error('Error getting usage stats:', error);
    return defaultStats;
  }
};

export interface ColorPalette {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export const generateThemeFromPrompt = async (
  prompt: string,
  // Dependecy Injection for testability
  aiApiCaller: (p: string) => Promise<ColorPalette | null> = callMultipleAIAPIs,
  fallbackGenerator: (p: string) => Promise<ColorPalette> = simulateAIGeneration
): Promise<GeneratedTheme> => {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Invalid prompt provided');
  }

  const capitalizedPrompt = prompt.charAt(0).toUpperCase() + prompt.slice(1);

  // Önce hazır tema kontrolü yap
  const predefinedColors = checkPredefinedThemes(prompt);
  if (predefinedColors) {
    return createThemeFromColors(capitalizedPrompt, predefinedColors, 'predefined');
  }

  try {
    const aiColors = await aiApiCaller(prompt);
    if (aiColors) {
      return createThemeFromColors(capitalizedPrompt, aiColors, 'ai-generated');
    }
  } catch (error) {
    console.warn('AI API caller failed, falling back to simulation.', error);
  }
  
  // Fallback to algorithm
  const fallbackColors = await fallbackGenerator(prompt);
  return createThemeFromColors(capitalizedPrompt, fallbackColors, 'algorithm-generated-fallback');
};

export const callMultipleAIAPIs = async (prompt: string): Promise<ColorPalette | null> => {
  const systemPrompt = `You are an expert UI/UX designer. Your task is to generate a color palette for a UI theme based on a user's prompt. Provide four colors: a primary color, a secondary color, a background color, and a text color. The colors should be visually appealing, harmonious, and have good contrast for readability. Respond ONLY with a valid JSON object containing the keys "primary", "secondary", "background", and "text", with their corresponding HEX color codes. Do not add any extra text, explanations, or markdown.`;

  const userPrompt = `Generate a UI theme for: "${prompt}". Respond with JSON:`;
  
  const providers: { name: AIServiceName; fn: (sp: string, up: string) => Promise<ColorPalette | null> }[] = [
    { name: 'GEMINI', fn: callGeminiAPI },
    { name: 'OPENAI', fn: callOpenAIAPI },
    { name: 'ANTHROPIC', fn: callAnthropicAPI }
  ];

  for (const api of providers) {
    try {
      // Kullanım limitini kontrol et
      const limitCheck = checkUsageLimit(api.name);
      if (!limitCheck.allowed) {
        console.warn(`❌ ${api.name} API limit exceeded:`, limitCheck.reason);
        continue; // Sonraki API'yi dene
      }

      console.log(`Trying ${api.name} API...`);
      const result = await api.fn(systemPrompt, userPrompt);
      if (result) {
        console.log(`✅ ${api.name} API successful!`);
        incrementUsage(api.name); // Başarılı kullanımı kaydet
        return result;
      }
    } catch (error: any) {
      console.warn(`❌ ${api.name} API failed:`, error?.message || error);
      continue; // Sonraki API'yi dene
    }
  }

  console.error('All AI APIs failed or exceeded limits');
  return null;
};

const callGeminiAPI = async (systemPrompt: string, userPrompt: string): Promise<ColorPalette | null> => {
  if (!genAI) return null;

  const modelOptions = [
    "gemini-1.5-flash", // En hızlı ve güvenilir
    "gemini-1.5-pro",
    "gemini-pro"
  ];

  for (const modelName of modelOptions) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const generatedText = response.text();
      
      if (!generatedText) {
        console.warn(`Gemini model ${modelName} returned empty response`);
        continue;
      }

      const colors = parseAIResponse(generatedText);
      if (colors) return colors;
    } catch (error: any) {
      console.warn(`Gemini model ${modelName} failed:`, error?.message || error);
      continue;
    }
  }
  return null;
};

const callOpenAIAPI = async (systemPrompt: string, userPrompt: string): Promise<ColorPalette | null> => {
  if (!openai) return null;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Ücretsiz tier için
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    const generatedText = response.choices[0]?.message?.content;
    if (!generatedText) {
      console.warn('OpenAI API returned empty response');
      return null;
    }

    return parseAIResponse(generatedText);
  } catch (error: any) {
    console.warn('OpenAI API failed:', error?.message || error);
    return null;
  }
};

const callAnthropicAPI = async (systemPrompt: string, userPrompt: string): Promise<ColorPalette | null> => {
  if (!anthropic) return null;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307", // En hızlı ve ücretsiz
      max_tokens: 100,
      messages: [
        { role: "user", content: `${systemPrompt}\n\n${userPrompt}` }
      ],
    });

    const generatedText = response.content[0];
    if (!generatedText || generatedText.type !== 'text') {
      console.warn('Anthropic API returned invalid response');
      return null;
    }

    return parseAIResponse(generatedText.text);
  } catch (error: any) {
    console.warn('Anthropic API failed:', error?.message || error);
    return null;
  }
};

const parseAIResponse = (generatedText: string): ColorPalette | null => {
  try {
    if (!generatedText || typeof generatedText !== 'string') {
      console.error('Invalid generated text provided to parseAIResponse');
      return null;
    }

    // AI'dan gelen metinden JSON'ı ayıkla
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No valid JSON object found in the AI response.');
      return null;
    }

    const jsonString = jsonMatch[0];
    const parsedColors = JSON.parse(jsonString) as Partial<ColorPalette>;

    // Renklerin geçerli HEX kodları olup olmadığını kontrol et
    if (
      parsedColors.primary && /^#[0-9A-F]{6}$/i.test(parsedColors.primary) &&
      parsedColors.secondary && /^#[0-9A-F]{6}$/i.test(parsedColors.secondary) &&
      parsedColors.background && /^#[0-9A-F]{6}$/i.test(parsedColors.background) &&
      parsedColors.text && /^#[0-9A-F]{6}$/i.test(parsedColors.text)
    ) {
      return parsedColors as ColorPalette;
    } else {
      console.error('Parsed JSON does not match the expected ColorPalette structure or contains invalid HEX codes.');
      return null;
    }
  } catch (error: any) {
    console.error('Error parsing AI response:', error?.message || error);
    return null;
  }
};

const createThemeFromColors = (prompt: string, colors: ColorPalette, type: string): GeneratedTheme => {
  return {
    id: `custom-${Date.now()}`,
    name: prompt.charAt(0).toUpperCase() + prompt.slice(1),
    prompt,
    preview: `${type} theme: ${prompt}`,
    colors,
  };
};

const checkPredefinedThemes = (prompt: string): ColorPalette | null => {
  if (!prompt || typeof prompt !== 'string') {
    return null;
  }

  const colorMap: Record<string, ColorPalette> = {
    cyberpunk: {
      primary: '#00FFFF', // Cyan
      secondary: '#FF00FF', // Magenta
      background: '#0A0A0A', // Çok Koyu Gri
      text: '#F0F0F0', // Daha parlak beyaz
    },
    light: {
      // Bu tema zaten iyi görünüyor, ancak daha belirgin sınırlar için
      // primary rengi biraz daha canlı hale getirebiliriz.
      primary: '#4285F4',    // Canlı Mavi (Google Mavisi gibi)
      secondary: '#F1F5F9',  // Çok Açık Gri (Kart arka planı)
      background: '#FFFFFF', // Beyaz
      text: '#020817',       // Neredeyse Siyah
    },
    dark: {
      // Sorun: Sınırlar görünmüyor.
      // Çözüm: Sınırlar için açık ve belirgin bir renk kullanmak.
      primary: '#94A3B8',    // Açık Gri/Mavi (Belirgin sınırlar için)
      secondary: '#1E293B',  // Koyu Kurşun Rengi (Kart arka planı)
      background: '#020817', // Çok Koyu Mavi/Siyah
      text: '#F1F5F9',       // Açık Gri (Beyaza yakın)
    },
    batman: {
      // Sorun: Sınırlar görünmüyor. Batman temasının sarı vurgusu eksik.
      // Çözüm: primary olarak ikonik sarıyı kullanmak.
      primary: '#FEE440',    // Batman Sarısı (Canlı ve belirgin)
      secondary: '#272727',  // Koyu Gri (Kart arka planı)
      background: '#1A1A1A', // Çok Koyu Gri/Siyah
      text: '#F5F5F5',       // Beyaza Yakın
    },
    galaxy: {
      // Sorun: Sınırlar ve arka plan renkleri birbirine çok yakın.
      // Çözüm: Canlı, neon bir mor/pembe vurgu rengi kullanmak.
      primary: '#C084FC',    // Canlı Lavanta/Mor (Vurgu rengi)
      secondary: '#3B0764',  // Koyu Mor (Kart arka planı)
      background: '#1D0037', // Çok Koyu Galaksi Moru
      text: '#F3E8FF',       // Çok Açık Lavanta (Beyaza yakın)
    },
    ocean: {
      primary: '#0EA5E9', // Açık Mavi
      secondary: '#06B6D4', // Turkuaz
      background: '#020817', // Daha Koyu Mavi (Default Dark BG)
      text: '#F0F8FF', // Alice Blue - Neredeyse Beyaz
    },
    sunset: {
      primary: '#F97316', // Turuncu
      secondary: '#EC4899', // Pembe
      background: '#4A1D0A', // Çok Koyu Kahverengi
      text: '#FFFBEB', // Krem Rengi
    },
    forest: {
      primary: '#16A34A', // Yeşil
      secondary: '#059669', // Koyu Nane Yeşili
      background: '#0A2A12', // Çok Koyu Orman Yeşili
      text: '#F0FFF0', // Honeydew - Neredeyse Beyaz
    },
    neon: {
      primary: '#39FF14', // Neon Yeşil
      secondary: '#F59E0B', // Turuncu
      background: '#000000', // Saf Siyah
      text: '#FFFFFF', // Beyaz
    },
    minimal: {
      primary: '#6B7280', // Gri
      secondary: '#9CA3AF', // Açık Gri
      background: '#F9FAFB', // Çok Açık Gri
      text: '#111827', // Koyu Mavi-Gri
    },
    retro: {
      primary: '#D9534F', // Daha Koyu Kırmızı (Kontrast için)
      secondary: '#4ECDC4', // Turkuaz
      background: '#1A242F', // Daha Koyu Mavi-Gri
      text: '#ECF0F1', // Açık Gri (Beyaza Yakın)
    },
    vintage: {
      primary: '#D4A574', // Ten Rengi
      secondary: '#8B4513', // Kahverengi
      background: '#FDF6E3', // Daha Açık Bej
      text: '#3A3B3C', // Koyu Gri (Kontrast için)
    },
    ironman: {
      primary: '#B83227', // Koyu Kırmızı (Daha iyi kontrast)
      secondary: '#FFD700', // Altın Sarısı
      background: '#000000', // Saf Siyah
      // Butonlarda okunabilirlik için text rengi siyah (#000) olabilir,
      // ancak genel metin için açık renk daha mantıklı.
      // Bu yüzden arka planla kontrastı koruduk.
      text: '#FFFFFF', // Saf Beyaz
    },
    spiderman: {
      primary: '#FF0000', // Kırmızı
      secondary: '#0066CC', // Mavi
      background: '#000000', // Saf Siyah
      text: '#FFFFFF', // Beyaz
    },
    'default light': {
      primary: '#0F172A',
      secondary: '#F1F5F9',
      background: '#FFFFFF',
      text: '#020817',
    },
    'default dark': {
      primary: '#F8FAFC',
      secondary: '#1E293B',
      background: '#020817',
      text: '#F8FAFC',
    },
    superman: {
      primary: '#0066CC', // Mavi
      secondary: '#FF0000', // Kırmızı
      background: '#000000', // Saf Siyah
      text: '#FFFFFF', // Beyaz
    },
  };

  // Sadece tam eşleşme kontrolü - daha katı kontrol
  const promptLower = prompt.toLowerCase().trim();
  
  // Önceden tanımlanmış temalar arasında tam eşleşme ara
  if (colorMap[promptLower]) {
    return colorMap[promptLower];
  }

  // Çok kelimeli prompt'lar için (eğer eşleşme bulunamazsa) API'ye yönlendir
  if (promptLower.includes(' ')) {
    return null;
  }

  return null;
};

const simulateAIGeneration = async (prompt: string): Promise<ColorPalette> => {
  // AI simülasyonu - gerçek API olmadan akıllı renk üretimi
  await new Promise(resolve => setTimeout(resolve, 1000)); // Loading simülasyonu
  
  const promptLower = prompt.toLowerCase();
  
  // Prompt analizi
  const isDark = promptLower.includes('dark') || promptLower.includes('night') || promptLower.includes('black');
  const isBright = promptLower.includes('bright') || promptLower.includes('light') || promptLower.includes('white');
  const isWarm = promptLower.includes('warm') || promptLower.includes('sunset') || promptLower.includes('fire');
  const isCool = promptLower.includes('cool') || promptLower.includes('ocean') || promptLower.includes('ice');
  const isVibrant = promptLower.includes('vibrant') || promptLower.includes('neon') || promptLower.includes('electric');
  const isMuted = promptLower.includes('muted') || promptLower.includes('soft') || promptLower.includes('pastel');

  // Hash-based renk üretimi
  const hash = prompt.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);

  const baseHue = Math.abs(hash) % 360;
  
  // Akıllı renk seçimi - hazır temalar gibi uyumlu
  let primaryHue = baseHue;
  let secondaryHue = (baseHue + 180) % 360; // Tamamlayıcı
  let backgroundHue = (baseHue + 90) % 360; // Triadic

  // Prompt'a göre renk ayarlaması
  if (isWarm) {
    primaryHue = (baseHue + 30) % 360; // Daha sıcak tonlar
    secondaryHue = (baseHue + 60) % 360;
  } else if (isCool) {
    primaryHue = (baseHue + 200) % 360; // Daha soğuk tonlar
    secondaryHue = (baseHue + 240) % 360;
  }

  // Hazır temalar gibi kontrast ayarları
  const primarySat = isVibrant ? 80 : isMuted ? 40 : 70;
  const secondarySat = isVibrant ? 85 : isMuted ? 35 : 65;
  
  // Background ve text için kontrast garantisi
  let bgLight, textLight, bgSat, textSat;
  
  if (isDark) {
    // Koyu tema - hazır temalar gibi
    bgLight = 10; // Çok koyu arka plan
    textLight = 90; // Çok açık metin
    bgSat = 30;
    textSat = 70;
  } else if (isBright) {
    // Açık tema
    bgLight = 95; // Çok açık arka plan
    textLight = 20; // Koyu metin
    bgSat = 20;
    textSat = 70;
  } else {
    // Orta tema
    bgLight = 90;
    textLight = 25;
    bgSat = 25;
    textSat = 70;
  }

  // Primary ve secondary için optimal lightness
  const primaryLight = isDark ? 50 : 45; // Orta ton
  const secondaryLight = isDark ? 55 : 50; // Biraz daha açık

  return {
    primary: `hsl(${primaryHue}, ${primarySat}%, ${primaryLight}%)`,
    secondary: `hsl(${secondaryHue}, ${secondarySat}%, ${secondaryLight}%)`,
    background: `hsl(${backgroundHue}, ${bgSat}%, ${bgLight}%)`,
    text: `hsl(${primaryHue}, ${textSat}%, ${textLight}%)`,
  };
}; 