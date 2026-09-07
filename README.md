# ♟️ Chess Matching App - Mobile

Cross-platform React Native mobile app for finding and playing chess with nearby players.

**iOS + Android** | **TypeScript** | **React Navigation** | **Zustand** | **Geolocation**

---

## 🎯 Features

- 📍 **Find Nearby Players** - Interactive map showing available chess players nearby
- 🎮 **Send Match Proposals** - Challenge players with specific meeting locations
- 📬 **Proposal Management** - Accept, reject, or cancel match proposals
- 👤 **Player Profiles** - View stats, ratings, and match history
- 📊 **Match Recording** - Log games with outcomes and notes
- 🚫 **Block Players** - Block unwanted players
- 🔐 **Secure Auth** - JWT tokens with automatic refresh
- 🌍 **Multi-language Ready** - Set up for localization

---

## 📋 Requirements

- **Node.js** 18+
- **Xcode** 14+ (iOS)
- **Android Studio** (Android)
- **React Native CLI**

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. iOS
```bash
npm run ios
```

### 3. Android
```bash
npm run android
```

### 4. Development Server
```bash
npm start
```

---

## 📁 Project Structure

```
src/
├── App.tsx                    # Root component
├── types/index.ts             # TypeScript interfaces
├── services/api.ts            # API client
├── store/                     # Zustand stores
│   ├── authStore.ts          # Authentication
│   ├── locationStore.ts      # Location & availability
│   └── proposalStore.ts      # Proposals
├── navigation/Navigation.tsx   # React Navigation setup
├── screens/                   # App screens
├── components/                # Reusable UI components
└── utils/                     # Utilities
```

---

## 🔑 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Navigation** | React Navigation |
| **State** | Zustand |
| **API** | Axios with interceptors |
| **Location** | React Native Geolocation |
| **Maps** | React Native Maps |
| **Storage** | AsyncStorage |
| **UI** | React Native |
| **Type Safety** | TypeScript |

---

## 🛠️ Available Commands

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Type checking
npm run typecheck

# Linting
npm run lint

# Testing
npm test
```

---

## 🔄 App Flow

### Authentication
```
Login/Register → JWT Tokens → Auto Refresh
```

### Finding Players
```
Set Availability → See Nearby Players → Send Proposal
```

### Match Flow
```
Send Proposal → Wait for Accept → Record Match → View History
```

---

## 🌍 API Integration

API Base: `https://api.chess-matching-app.com`

### Key Endpoints
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/availability/nearby` - Get nearby players
- `POST /api/v1/proposals` - Create proposal
- `GET /api/v1/proposals/incoming` - Get incoming proposals
- `POST /api/v1/proposals/{id}/accept` - Accept proposal

---

## 📍 Geolocation Features

- Get current location
- Watch location updates
- Calculate distances
- Check if within radius

```typescript
import { getCurrentLocation, calculateDistance } from '@utils/geolocation';

const location = await getCurrentLocation();
const distance = calculateDistance(lat1, lon1, lat2, lon2);
```

---

## 💾 State Management

### Example: Using Auth Store
```typescript
import { useAuthStore } from '@store/authStore';

const MyComponent = () => {
  const { user, login, logout } = useAuthStore();
  
  const handleLogin = async () => {
    await login({ email: 'user@example.com', password: 'pass' });
  };
  
  return (
    <>
      {user && <Text>{user.username}</Text>}
      <Button onPress={handleLogin}>Login</Button>
    </>
  );
};
```

---

## 🔐 Environment Setup

Create `.env` file:
```
API_BASE_URL=https://api.chess-matching-app.com
SOCKET_URL=https://api.chess-matching-app.com/hub/notifications
```

---

## 📱 iOS Setup

### Permissions (Info.plist)
Location permissions are required. Add to `ios/ChessMatchingApp/Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to find nearby chess players.</string>
```

---

## 🤖 Android Setup

### Permissions (AndroidManifest.xml)
Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
```

---

## 🧪 Testing

```bash
npm test
```

---

## 🐛 Troubleshooting

### Metro Server Port Conflict
```bash
# Kill process on port 8081
lsof -i :8081 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Clear Cache
```bash
npm start -- --reset-cache
```

### Rebuild
```bash
npm install
# iOS
cd ios && pod install && cd ..
# Android (no extra steps)
```

---

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Detailed setup guide
- [React Navigation Docs](https://reactnavigation.org/)
- [React Native Docs](https://reactnative.dev/)
- [Zustand Docs](https://github.com/pmndrs/zustand)

---

## 📈 Next Steps

1. **Authentication Screens** - Build Login/Register UI
2. **Map Screen** - Integrate react-native-maps
3. **Proposal Cards** - Create proposal display components
4. **WebSocket** - Add real-time notifications
5. **Notifications** - Push notifications integration
6. **Testing** - Unit and integration tests
7. **Deployment** - TestFlight & Google Play

---

## 📄 License

MIT

---

## 👤 Author

Zaki  
Backend: .NET 8 · Mobile: React Native

---

**Let's build the future of chess! ♟️**
