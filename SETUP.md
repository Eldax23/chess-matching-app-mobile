# Chess Matching App - React Native Mobile

Complete React Native mobile app for iOS and Android. Cross-platform with TypeScript.

---

## 📁 Project Structure

```
mobile/
├── src/
│   ├── App.tsx                 # Main app component
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── services/
│   │   └── api.ts              # API client & HTTP interceptors
│   ├── store/
│   │   ├── authStore.ts        # Auth state management (Zustand)
│   │   ├── locationStore.ts    # Location & availability state
│   │   └── proposalStore.ts    # Proposals state
│   ├── navigation/
│   │   └── Navigation.tsx       # Navigation setup (React Navigation)
│   ├── screens/
│   │   ├── auth/               # Auth screens (to be created)
│   │   ├── home/               # Map & player finding screens
│   │   ├── proposals/          # Proposal request screens
│   │   ├── profile/            # User profile screens
│   │   └── settings/           # Settings screens
│   ├── components/             # Reusable UI components
│   └── utils/
│       ├── geolocation.ts      # Location utilities
│       └── index.ts            # Storage, validation, etc.
├── index.js                    # Entry point
├── app.json                    # App config
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── babel.config.js             # Babel config
├── metro.config.js             # Metro bundler config
└── .gitignore
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Xcode 14+ (for iOS)
- Android Studio (for Android)
- React Native CLI: `npm install -g react-native-cli`

### 1. Install Dependencies

```bash
cd mobile
npm install
# or
yarn install
```

### 2. iOS Setup

```bash
# Install Pods
cd ios
pod install
cd ..

# Run on simulator
npm run ios
# or
react-native run-ios --simulator="iPhone 15"
```

### 3. Android Setup

```bash
# Make sure ANDROID_HOME is set
export ANDROID_HOME=$HOME/Library/Android/sdk

# Run on emulator (make sure emulator is running)
npm run android
# or
react-native run-android
```

---

## 📦 Dependencies Overview

### Navigation
- `@react-navigation/native` - Core navigation
- `@react-navigation/native-stack` - Stack navigation
- `@react-navigation/bottom-tabs` - Tab navigation

### State Management
- `zustand` - Lightweight state management

### API & Networking
- `axios` - HTTP client with interceptors
- `signalr` - WebSocket for real-time updates

### Location & Maps
- `@react-native-community/geolocation` - GPS location
- `react-native-maps` - Map display

### Storage
- `@react-native-async-storage/async-storage` - Local storage for tokens

### UI
- `react-native-vector-icons` - Icon library
- `react-native-gesture-handler` - Gesture handling
- `react-native-reanimated` - Animations
- `react-native-safe-area-context` - Safe area handling

### Utils
- `date-fns` - Date formatting

---

## 🛠️ Development Workflow

### Start Metro Bundler (Terminal 1)
```bash
npm start
```

### Run on iOS (Terminal 2)
```bash
npm run ios
```

### Run on Android (Terminal 2)
```bash
npm run android
```

### Watch for TypeScript errors
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

---

## 🔑 Key Features Implemented

### ✅ Architecture
- **Navigation**: React Navigation with Tab + Stack structure
- **State Management**: Zustand stores for Auth, Location, Proposals
- **API**: Axios client with token refresh interceptors
- **Types**: Full TypeScript support with interfaces
- **Geolocation**: GPS with distance calculations
- **Storage**: AsyncStorage for persistent tokens

### 📋 Navigation Structure

```
Root
├── Auth Stack
│   ├── Login
│   ├── Register
│   └── ForgotPassword
└── App Tabs
    ├── Home Stack
    │   ├── Map (find nearby players)
    │   ├── User Profile
    │   └── Set Availability
    ├── Proposals Stack
    │   ├── Proposals List
    │   ├── Proposal Detail
    │   └── Record Match
    ├── Profile Stack
    │   ├── Profile
    │   ├── Edit Profile
    │   └── Match History
    └── Settings Stack
        ├── Settings
        ├── Block List
        └── About
```

---

## 🔄 State Management (Zustand)

### useAuthStore
```typescript
// Login
await useAuthStore.login({ email, password });

// Get user
const user = useAuthStore(state => state.user);

// Logout
await useAuthStore.logout();
```

### useLocationStore
```typescript
// Set availability with location
await useLocationStore.setAvailability(location, hasBoard);

// Get nearby players
const users = await useLocationStore.getNearbyUsers(radiusKm);
```

### useProposalStore
```typescript
// Create proposal
const proposalId = await useProposalStore.createProposal({
  receiverId,
  message,
  meetingLatitude,
  meetingLongitude,
});

// Get incoming
await useProposalStore.fetchIncomingProposals();

// Accept
await useProposalStore.acceptProposal(proposalId);
```

---

## 📍 API Integration

### API Client (src/services/api.ts)
- ✅ Request interceptor: Adds auth token
- ✅ Response interceptor: Handles token refresh
- ✅ All endpoints typed with TypeScript
- ✅ Error handling and logging

### Usage
```typescript
import { apiClient } from '@services/api';

// Login
const auth = await apiClient.login({
  email: 'user@example.com',
  password: 'password'
});

// Get nearby users
const users = await apiClient.getNearbyUsers(10);

// Create proposal
const proposal = await apiClient.createProposal({
  receiverId: userId,
  meetingLatitude: 30.0444,
  meetingLongitude: 31.2357,
});
```

---

## 📍 Geolocation Integration

### Get Current Location
```typescript
import { getCurrentLocation } from '@utils/geolocation';

const location = await getCurrentLocation();
// { latitude: 30.0444, longitude: 31.2357 }
```

### Watch Location Updates
```typescript
import { watchLocation, stopWatchingLocation } from '@utils/geolocation';

const watchId = watchLocation(
  (location) => {
    console.log('Location updated:', location);
  },
  (error) => {
    console.error('Location error:', error);
  }
);

// Later...
stopWatchingLocation(watchId);
```

### Calculate Distance
```typescript
import { calculateDistance, formatDistance } from '@utils/geolocation';

const km = calculateDistance(30.0444, 31.2357, 30.0555, 31.2500);
console.log(formatDistance(km)); // "2.3km"
```

---

## 💾 Local Storage

### Token Management
```typescript
import { tokenUtils } from '@utils/index';

// Get token
const token = await tokenUtils.getAccessToken();

// Set tokens
await tokenUtils.setTokens(accessToken, refreshToken, userId);

// Clear tokens
await tokenUtils.clearTokens();
```

### Validation
```typescript
import { validationUtils } from '@utils/index';

validationUtils.isValidEmail('user@example.com'); // true
validationUtils.isValidPassword('password123');   // true
validationUtils.isValidUsername('player42');      // true
```

---

## 🎨 UI Components (To Be Created)

Next, we'll create reusable components:
- `Button` - Custom button with loading state
- `Card` - Container card component
- `Input` - Text input with validation
- `ProposalCard` - Proposal display card
- `UserCard` - Player profile card
- `Map` - Custom map wrapper
- `Modal` - Custom modal
- `Loading` - Loading spinner

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Structure
```
__tests__/
├── services/
│   └── api.test.ts
├── store/
│   └── authStore.test.ts
└── utils/
    └── geolocation.test.ts
```

---

## 🔒 Environment Configuration

Create `.env` file (git-ignored):
```
API_BASE_URL=https://api.chess-matching-app.com
SOCKET_URL=https://api.chess-matching-app.com/hub/notifications
```

Update `src/services/api.ts`:
```typescript
import { API_BASE_URL } from '@env';

const BASE_URL = API_BASE_URL || 'https://api.chess-matching-app.com';
```

---

## 📱 iOS-Specific Setup

### Info.plist (ios/ChessMatchingApp/Info.plist)

Add location permissions:
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to find nearby chess players.</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>We need your location to find nearby chess players.</string>
```

### Podfile
Ensure these pods are installed:
```
pod 'react-native-maps'
pod 'react-native-geolocation'
pod 'react-native-async-storage'
```

---

## 🤖 Android-Specific Setup

### AndroidManifest.xml

Add permissions:
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
```

### build.gradle

```gradle
android {
    compileSdkVersion 33
    minSdkVersion 21
    targetSdkVersion 33
}
```

---

## 🚀 Next Steps

1. **Create Auth Screens**
   - LoginScreen.tsx
   - RegisterScreen.tsx
   - Password reset flow

2. **Create Home Stack Screens**
   - MapScreen.tsx (with react-native-maps)
   - UserProfileScreen.tsx
   - SetAvailabilityScreen.tsx

3. **Create Proposals Screens**
   - ProposalsListScreen.tsx
   - ProposalDetailScreen.tsx
   - RecordMatchScreen.tsx

4. **Create Profile Screens**
   - ProfileScreen.tsx
   - EditProfileScreen.tsx
   - MatchHistoryScreen.tsx

5. **Create Components**
   - Button, Card, Input, Modal, Loading, etc.

6. **WebSocket Integration**
   - Connect SignalR for real-time notifications
   - Handle incoming proposals
   - Handle availability changes

7. **Testing**
   - Unit tests for stores
   - Integration tests for API
   - Component tests

8. **Deployment**
   - Build for iOS (TestFlight)
   - Build for Android (Google Play)

---

## 📊 App Workflow

```
User Launch
    ↓
Check Token (restoreToken)
    ├─ Token Valid → Show App Tabs
    └─ Token Invalid → Show Auth
            ↓
        Login/Register
            ↓
        Set Availability
            ↓
        See Nearby Players (Map)
            ↓
        Send Proposal
            ↓
        Receive Proposals
            ↓
        Accept → Record Match
            ↓
        View Match History
```

---

## ⚙️ Build & Deploy

### iOS
```bash
# Debug build
npm run ios

# Production build (TestFlight)
cd ios
xcodebuild -workspace ChessMatchingApp.xcworkspace \
  -scheme ChessMatchingApp \
  -configuration Release
```

### Android
```bash
# Debug build
npm run android

# Production build (Google Play)
cd android
./gradlew assembleRelease
```

---

## 🐛 Troubleshooting

### Port 8081 Already in Use
```bash
lsof -i :8081
kill -9 <PID>
```

### Clear Metro Cache
```bash
npm start -- --reset-cache
```

### Rebuild Native Modules
```bash
npm install
npx react-native-link
```

### iOS Pod Issues
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

---

**Ready to build!** 🎉

Next: Create the Auth screens (Login/Register) and start building UI components!
