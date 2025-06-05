# Splash Screen Implementation

This PWA now includes a comprehensive splash screen implementation that works on both iOS and Android devices.

## Features

### ✅ What's Implemented

1. **React Splash Screen Component** (`components/SplashScreen.tsx`)
   - Modern gradient background (blue to dark slate)
   - Animated logo with backdrop blur effect
   - App name and tagline with proper typography
   - Loading animation with bouncing dots
   - Smooth fade transitions
   - Auto-dismisses after 2 seconds

2. **iOS Native Splash Screen Support**
   - Apple touch startup images for various device sizes
   - Proper meta tags in `app/layout.tsx`
   - SVG-based splash screen image (`public/splash-screen.svg`)
   - Supports iPhone SE, iPhone 11, iPhone 12/13/14 series

3. **Session Management** (`hooks/useSplashScreen.ts`)
   - Shows splash screen only once per browser session
   - Uses sessionStorage to track splash screen display
   - Manual dismiss functionality available

4. **PWA Integration**
   - Updated manifest.json with proper theme colors
   - Safe area inset support for modern devices
   - Optimized for standalone app mode

## File Structure

```
├── components/
│   ├── SplashScreen.tsx           # Main splash screen component
│   └── SplashScreenProvider.tsx   # Provider wrapper component
├── hooks/
│   └── useSplashScreen.ts         # Splash screen state management
├── public/
│   └── splash-screen.svg          # SVG splash screen (universal)
└── app/
    ├── layout.tsx                 # Updated with iOS meta tags
    └── manifest.ts                # PWA manifest configuration
```

## How It Works

### React Component Flow
1. `SplashScreenProvider` wraps the main app content
2. `useSplashScreen` hook manages visibility state
3. `SplashScreen` component renders with animations
4. Auto-dismisses after 2 seconds or manual trigger

### iOS Native Splash
- iOS Safari uses `apple-touch-startup-image` meta tags
- Different images for different device dimensions
- Falls back to SVG for maximum compatibility

### Android/Chrome
- Uses the React component splash screen
- Respects PWA manifest theme colors
- Works in both browser and installed app modes

## Customization

### Timing
```typescript
// In useSplashScreen.ts, change the timeout:
const timer = setTimeout(() => {
  // Change 2500 to desired milliseconds
}, 2500);
```

### Colors & Styling
```typescript
// In SplashScreen.tsx, update the gradient:
className="bg-gradient-to-b from-blue-700 to-slate-900"
```

### Content
- Update text in `SplashScreen.tsx`
- Replace logo in `/public/icon-192x192.png`
- Modify SVG in `/public/splash-screen.svg`

## Testing

### Desktop Browser
1. Open DevTools
2. Toggle device simulation (mobile view)
3. Refresh page - splash should appear
4. Refresh again - splash should not appear (session storage)
5. Open in incognito - splash appears again

### iOS Safari
1. Add to Home Screen
2. Launch from home screen
3. Native splash screen should appear briefly
4. Then React splash screen takes over

### Android Chrome
1. Install PWA via banner or menu
2. Launch installed app
3. React splash screen should appear

## Why SVG Instead of PNG?

### ✅ Advantages of SVG Splash Screens

1. **Universal Compatibility**: One file works for all device sizes and resolutions
2. **Lightweight**: Much smaller file size compared to multiple PNG files
3. **Scalable**: Perfect quality at any screen size or pixel density
4. **Easy to Maintain**: Single file to update instead of multiple PNG variants
5. **Modern Standard**: SVG is well-supported across all modern browsers and iOS Safari

### 🚫 No PNG Files Needed

Previously, PWAs required multiple PNG files for different iOS device sizes:
- `splash-640x1136.png` (iPhone SE)
- `splash-750x1334.png` (iPhone 8)
- `splash-1242x2208.png` (iPhone 8 Plus)
- And many more...

With SVG, we need only **one file** that adapts to all screen sizes automatically.

## Performance Notes

- Images are optimized and use `priority` loading
- SVG splash screen is lightweight and scalable
- Component only renders when needed
- Session storage prevents unnecessary re-renders

## Browser Support

- ✅ iOS Safari 11.3+
- ✅ Chrome 67+ (Android)
- ✅ Firefox 58+
- ✅ Samsung Internet 7.2+

