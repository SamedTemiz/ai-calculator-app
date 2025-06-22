import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateThemeFromPrompt, getUsageStats, ColorPalette } from '../aiService';

const mockAiResponse: ColorPalette = {
  primary: '#1E90FF',
  secondary: '#FF6347',
  background: '#1A1A1A',
  text: '#F0F0F0',
};

const mockFallbackResponse: ColorPalette = {
  primary: '#FALLBA',
  secondary: '#C0FFEE',
  background: '#000000',
  text: '#FFFFFF',
};

// Mock implementations for dependency injection
const mockApiCaller = vi.fn().mockResolvedValue(mockAiResponse);
const mockFallbackGenerator = vi.fn().mockResolvedValue(mockFallbackResponse);
const failingApiCaller = vi.fn().mockResolvedValue(null);

describe('aiService', () => {
  beforeEach(() => {
    localStorage.clear();
    mockApiCaller.mockClear();
    mockFallbackGenerator.mockClear();
    failingApiCaller.mockClear();
  });

  describe('generateThemeFromPrompt', () => {
    it('should generate a predefined theme when a match is found', async () => {
      const result = await generateThemeFromPrompt('batman', mockApiCaller, mockFallbackGenerator);
      expect(result.name.toLowerCase()).toBe('batman');
      expect(result.preview).toContain('predefined');
      expect(mockApiCaller).not.toHaveBeenCalled();
      expect(mockFallbackGenerator).not.toHaveBeenCalled();
    });

    it('should call the AI API caller for non-predefined themes', async () => {
      const result = await generateThemeFromPrompt('a new theme', mockApiCaller, mockFallbackGenerator);
      expect(mockApiCaller).toHaveBeenCalledWith('a new theme');
      expect(mockFallbackGenerator).not.toHaveBeenCalled();
      expect(result.preview).toContain('ai-generated');
      expect(result.colors).toEqual(mockAiResponse);
    });

    it('should use the fallback generator if the AI API fails', async () => {
      const result = await generateThemeFromPrompt('a theme that fails', failingApiCaller, mockFallbackGenerator);
      expect(failingApiCaller).toHaveBeenCalledWith('a theme that fails');
      expect(mockFallbackGenerator).toHaveBeenCalledWith('a theme that fails');
      expect(result.preview).toContain('algorithm-generated-fallback');
      expect(result.colors).toEqual(mockFallbackResponse);
    });
    
    it('should throw an error for invalid prompts', async () => {
      await expect(generateThemeFromPrompt('', mockApiCaller, mockFallbackGenerator)).rejects.toThrow('Invalid prompt provided');
    });
  });

  describe('getUsageStats', () => {
    const expectedDefaultStats = {
      user: { used: 0, total: 10, remaining: 10 },
      perMinute: { used: 0, limit: 2 },
      apis: {
        gemini: { used: 0, total: 15, remaining: 15 },
        openai: { used: 0, total: 20, remaining: 20 },
        anthropic: { used: 0, total: 5, remaining: 5 },
      },
    };

    it('should return default stats when localStorage is empty', () => {
      const stats = getUsageStats();
      expect(stats).toEqual(expectedDefaultStats);
    });

    it('should correctly parse and return stats from localStorage', () => {
      const today = new Date().toDateString();
      const mockUsageData = {
        'USER': { daily: { count: 3, date: today }, perMinute: { count: 1, timestamp: Date.now() } },
        'GEMINI': { daily: { count: 5, date: today }, perMinute: { count: 0, timestamp: Date.now() } },
      };
      const mockLoader = () => mockUsageData;

      const stats = getUsageStats(mockLoader);
      
      expect(stats.user).toEqual({ used: 3, total: 10, remaining: 7 });
      expect(stats.apis.gemini).toEqual({ used: 5, total: 15, remaining: 10 });
      expect(stats.apis.openai).toEqual({ used: 0, total: 20, remaining: 20 });
      expect(stats.apis.anthropic).toEqual({ used: 0, total: 5, remaining: 5 });
    });

    it('should gracefully handle corrupted data in localStorage', () => {
      const mockCorruptedLoader = () => { throw new Error("Corrupted data"); };
      const stats = getUsageStats(mockCorruptedLoader);
      expect(stats).toEqual(expectedDefaultStats);
    });

    it('should reset daily count if the date in localStorage is old', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const mockOldData = {
        'USER': { daily: { count: 8, date: yesterday.toDateString() }, perMinute: { count: 1, timestamp: 0 } },
      };
      const mockOldDataLoader = () => mockOldData;

      const stats = getUsageStats(mockOldDataLoader);
      expect(stats.user.used).toBe(0);
      expect(stats.user.remaining).toBe(10);
    });
  });
}); 