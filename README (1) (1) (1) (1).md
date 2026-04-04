# AI Super Helper 2026

A modern Android app with multiple AI-powered tools including chat assistant, resume builder, caption generator, homework helper, business name generator, and farming tips.

## Features

1. **AI Chat Assistant** - ChatGPT-like conversational AI
2. **Resume Builder** - Create professional resumes
3. **Instagram Caption Generator** - Generate captions in different styles
4. **Homework Helper** - Get help with assignments
5. **Business Name Generator** - Create unique business names
6. **Farming Tips** - Agricultural guidance for crops

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Update the `.env` file with your Supabase credentials:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Optional: Add OpenAI API Key

To enable advanced AI features, add your OpenAI API key as a Supabase Edge Function secret:

The app works without OpenAI API key using fallback responses. For better AI responses, you can configure the OpenAI API key in your Supabase dashboard under Edge Functions secrets with the name `OPENAI_API_KEY`.

### 4. AdMob Integration

To add real ads, follow these steps:

#### Install AdMob Package

```bash
npx expo install react-native-google-mobile-ads
```

#### Configure AdMob

1. Create an AdMob account at https://admob.google.com
2. Create an app in AdMob dashboard
3. Get your Ad Unit IDs for:
   - Banner Ads
   - Interstitial Ads

#### Update app.json

Add the AdMob configuration:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy",
          "iosAppId": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
        }
      ]
    ]
  }
}
```

#### Replace Ad Placeholders

Replace the ad banner placeholders in the following files:
- `app/(tabs)/index.tsx`
- `app/(tabs)/chat.tsx`
- `app/(tabs)/tools.tsx`
- `app/resume.tsx`
- `app/caption.tsx`
- `app/homework.tsx`
- `app/business.tsx`
- `app/farming.tsx`

Example implementation:

```typescript
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// Replace the placeholder with:
<BannerAd
  unitId={TestIds.BANNER} // Use your actual Ad Unit ID in production
  size={BannerAdSize.BANNER}
/>
```

For interstitial ads, modify `hooks/useAdCounter.ts` to show real ads.

### 5. Run the App

```bash
npm run dev
```

Then:
- Press `w` for web
- Press `a` for Android (requires Android Studio)
- Press `i` for iOS (requires Xcode on macOS)

## Project Structure

```
app/
├── (tabs)/           # Tab navigation screens
│   ├── index.tsx     # Home screen
│   ├── chat.tsx      # AI Chat
│   └── tools.tsx     # Tools list
├── resume.tsx        # Resume Builder
├── caption.tsx       # Caption Generator
├── homework.tsx      # Homework Helper
├── business.tsx      # Business Name Generator
├── farming.tsx       # Farming Tips
└── ai-helper+api.ts  # API route

supabase/functions/
└── ai-helper/        # Edge function for AI processing

hooks/
├── useFrameworkReady.ts  # Framework initialization
└── useAdCounter.ts       # Ad display logic
```

## Design Features

- Modern dark gradient theme
- Smooth animations and transitions
- Mobile-optimized responsive design
- Clean card-based UI
- Color-coded features with unique gradients
- Professional icons using Lucide React Native

## Tech Stack

- **Framework**: Expo (React Native)
- **Navigation**: Expo Router
- **Backend**: Supabase Edge Functions
- **AI**: OpenAI GPT-3.5 (optional)
- **Styling**: React Native StyleSheet
- **Icons**: Lucide React Native
- **Monetization**: Google AdMob (to be configured)

## Building for Production

### Android APK

```bash
npm run build:web
eas build --platform android
```

### iOS

```bash
eas build --platform ios
```

Note: You'll need an Expo account and EAS CLI configured.

## License

MIT
