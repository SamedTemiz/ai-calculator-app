# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/257dbbf8-b6bd-45b2-95b4-555fd0d0de25

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/257dbbf8-b6bd-45b2-95b4-555fd0d0de25) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/257dbbf8-b6bd-45b2-95b4-555fd0d0de25) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# AI Calculator App

Modern bir hesap makinesi uygulaması ile AI destekli tema üretimi özelliği.

## Özellikler

- 🧮 Gelişmiş hesap makinesi fonksiyonları
- 🎨 AI destekli tema üretimi (3 farklı AI servisi)
- 🌙 Karanlık/Aydınlık tema desteği
- 📱 Responsive tasarım
- ⚡ Hızlı ve modern arayüz

## AI API Kurulumu

Bu uygulama 3 farklı ücretsiz AI servisini destekler. Birinin kotası dolduğunda otomatik olarak diğerine geçer.

### 1. Google Gemini API (Önerilen)
1. [Google AI Studio](https://makersuite.google.com/app/apikey) adresine gidin
2. Google hesabınızla giriş yapın
3. "Create API Key" butonuna tıklayın
4. API anahtarınızı kopyalayın
5. Ücretsiz limit: Günlük 15 request

### 2. OpenAI API
1. [OpenAI Platform](https://platform.openai.com/api-keys) adresine gidin
2. Hesabınızla giriş yapın
3. "Create new secret key" butonuna tıklayın
4. API anahtarınızı kopyalayın
5. Ücretsiz limit: $5 kredi

### 3. Anthropic Claude API
1. [Anthropic Console](https://console.anthropic.com/) adresine gidin
2. Hesabınızla giriş yapın
3. "Create Key" butonuna tıklayın
4. API anahtarınızı kopyalayın
5. Ücretsiz limit: Günlük 5 request

### Environment Variables

Proje ana dizininde `.env` dosyası oluşturun:

```env
# Google Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI API
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Anthropic Claude API
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

**Not**: En az bir API anahtarı gereklidir. Hiçbiri yoksa simülasyon modu kullanılır.

## Kurulum

```sh
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

## Kullanım

1. **Hesap Makinesi**: Ana ekranda matematik işlemleri yapın
2. **AI Tema Üretimi**: "AI Theme" sekmesine gidin ve tema açıklaması yazın
3. **Ayarlar**: Tema, ses efektleri ve diğer ayarları değiştirin

## Fallback Sistemi

AI API'leri şu sırayla denenir:
1. Google Gemini (en hızlı)
2. OpenAI GPT-3.5 (orta hız)
3. Anthropic Claude (en güvenilir)
4. Simülasyon algoritması (her zaman çalışır)

## Teknolojiler

- **Frontend**: React + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **State Management**: Redux Toolkit
- **AI Services**: Google Gemini, OpenAI, Anthropic
- **Styling**: styled-components

## Proje Yapısı

```
src/
├── api/             # AI servisleri
├── components/      # UI bileşenleri
├── screens/         # Ekranlar
├── store/           # Redux store
├── theme/           # Tema sistemi
├── types/           # TypeScript tipleri
└── utils/           # Yardımcı fonksiyonlar
```

## Lisans

MIT License
