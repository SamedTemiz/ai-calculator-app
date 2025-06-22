import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '@/App';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

describe('Multi-language UI integration', () => {
  const renderWithLang = (lang: 'en' | 'tr') => {
    i18n.changeLanguage(lang);
    return render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    );
  };

  const goToSettings = () => {
    // Navigation bar'da settings ikonuna tıkla
    const settingsBtn = screen.getAllByRole('button').find(btn => btn.querySelector('svg.lucide-settings'));
    if (settingsBtn) fireEvent.click(settingsBtn);
  };

  const goToAITheme = () => {
    // Navigation bar'da AI Theme ikonuna tıkla
    const aiThemeBtn = screen.getAllByRole('button').find(btn => btn.querySelector('svg.lucide-palette'));
    if (aiThemeBtn) fireEvent.click(aiThemeBtn);
  };

  it('shows all settings titles and buttons in Turkish', () => {
    renderWithLang('tr');
    goToSettings();
    expect(screen.getByText('Genel Ayarlar')).toBeInTheDocument();
    expect(screen.getByText('Veri Yönetimi')).toBeInTheDocument();
    expect(screen.getByText('Dil')).toBeInTheDocument();
    expect(screen.getByText('Dokunsal Geri Bildirim')).toBeInTheDocument();
    expect(screen.getByText('Ses Efektleri')).toBeInTheDocument();
    expect(screen.getByText('Mevcut AI Temasını Temizle')).toBeInTheDocument();
    expect(screen.getByText('Tüm Temaları Temizle')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Türkçe' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument();
  });

  it('shows all settings titles and buttons in English', () => {
    renderWithLang('en');
    goToSettings();
    expect(screen.getByText('General Settings')).toBeInTheDocument();
    expect(screen.getByText('Data Management')).toBeInTheDocument();
    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('Haptic Feedback')).toBeInTheDocument();
    expect(screen.getByText('Sound Effects')).toBeInTheDocument();
    expect(screen.getByText('Clear Current AI Theme')).toBeInTheDocument();
    expect(screen.getByText('Clear All Themes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Türkçe' })).toBeInTheDocument();
  });

  it('AI Theme screen: theme names and labels are correct in both languages', () => {
    renderWithLang('tr');
    goToAITheme();
    expect(screen.getByText('Hazır Temalar')).toBeInTheDocument();
    expect(screen.getByText('Açık')).toBeInTheDocument();
    expect(screen.getByText('Koyu')).toBeInTheDocument();
    expect(screen.getByText('Batman')).toBeInTheDocument();
    expect(screen.getByText('Galaksi')).toBeInTheDocument();
    expect(screen.getByText('Tema Seç')).toBeInTheDocument();

    renderWithLang('en');
    goToAITheme();
    expect(screen.getByText('Pre-made Themes')).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('Batman')).toBeInTheDocument();
    expect(screen.getByText('Galaxy')).toBeInTheDocument();
    expect(screen.getByText('Choose Theme')).toBeInTheDocument();
  });

  it('Language switch changes all UI text', () => {
    renderWithLang('tr');
    goToSettings();
    expect(screen.getByText('Genel Ayarlar')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'English' }));
    expect(screen.getByText('General Settings')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Türkçe' }));
    expect(screen.getByText('Genel Ayarlar')).toBeInTheDocument();
  });

  // Ekstra: Navigation ve diğer önemli alanlar için de benzer testler eklenebilir.
}); 