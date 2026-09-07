# Mobile App - Quick Reference

## 🚀 Getting Started (1 min)

```bash
cd mobile
npm install
npm start          # Terminal 1
npm run ios        # Terminal 2 (or npm run android)
```

---

## 📍 Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Root component |
| `src/types/index.ts` | All TypeScript interfaces |
| `src/services/api.ts` | API client with interceptors |
| `src/store/authStore.ts` | Auth state management |
| `src/store/locationStore.ts` | Location state |
| `src/store/proposalStore.ts` | Proposals state |
| `src/navigation/Navigation.tsx` | Navigation setup |
| `src/utils/geolocation.ts` | Location utilities |
| `src/utils/index.ts` | Helpers (tokens, validation) |

---

## 🛠️ Common Tasks

### Add a New Screen
```bash
# Create screen file
touch src/screens/section/NewScreen.tsx

# Add to navigation
# Edit src/navigation/Navigation.tsx
```

### Add a New Component
```bash
# Create component
touch src/components/NewComponent.tsx

# Import and use
import NewComponent from '@components/NewComponent';
```

### Add a New Store
```typescript
// src/store/newStore.ts
import { create } from 'zustand';

export const useNewStore = create((set) => ({
  // state
  value: null,
  // actions
  setValue: (v) => set({ value: v }),
}));
```

### Call API
```typescript
import { apiClient } from '@services/api';

const user = await apiClient.getMyProfile();
```

### Use Auth Store
```typescript
import { useAuthStore } from '@store/authStore';

const { user, login, logout } = useAuthStore();
```

### Get Location
```typescript
import { getCurrentLocation } from '@utils/geolocation';

const location = await getCurrentLocation();
```

---

## 🧠 Navigation Structure

### Root Stack
- **Auth Stack** (when not logged in)
  - Login
  - Register
- **App Tabs** (when logged in)
  - **Home Stack** → Map, User Profile, Set Availability
  - **Proposals Stack** → List, Detail, Record Match
  - **Profile Stack** → Profile, Edit, History
  - **Settings Stack** → Settings, Block List, About

### Navigate Programmatically
```typescript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();
navigation.navigate('Auth', { screen: 'Login' });
navigation.navigate('App', { screen: 'HomeStack', params: { screen: 'Map' } });
```

---

## 🔐 Authentication Flow

### Login
```typescript
import { useAuthStore } from '@store/authStore';

const { login } = useAuthStore();
await login({ email: 'user@example.com', password: 'password' });
```

### Check if Logged In
```typescript
const { user } = useAuthStore();
if (user) {
  // User is logged in
}
```

### Logout
```typescript
const { logout } = useAuthStore();
await logout();
```

### Restore Token on App Start
```typescript
useEffect(() => {
  useAuthStore.getState().restoreToken();
}, []);
```

---

## 📍 Location Flow

### Set Availability
```typescript
import { useLocationStore } from '@store/locationStore';

const { setAvailability } = useLocationStore();
await setAvailability(
  { latitude: 30.0444, longitude: 31.2357 },
  true,  // hasBoard
  4      // expiresInHours
);
```

### Get Nearby Users
```typescript
const { getNearbyUsers } = useLocationStore();
const users = await getNearbyUsers(10); // 10 km radius
```

### Calculate Distance
```typescript
import { calculateDistance, formatDistance } from '@utils/geolocation';

const km = calculateDistance(lat1, lon1, lat2, lon2);
console.log(formatDistance(km)); // "2.5km"
```

---

## 📬 Proposals Flow

### Create Proposal
```typescript
import { useProposalStore } from '@store/proposalStore';

const { createProposal } = useProposalStore();
const proposalId = await createProposal({
  receiverId: 'user-id',
  message: 'Wanna play?',
  meetingLatitude: 30.0444,
  meetingLongitude: 31.2357,
});
```

### Get Incoming Proposals
```typescript
const { fetchIncomingProposals, incomingProposals } = useProposalStore();
await fetchIncomingProposals();
console.log(incomingProposals);
```

### Accept Proposal
```typescript
const { acceptProposal } = useProposalStore();
await acceptProposal(proposalId);
```

### Reject Proposal
```typescript
const { rejectProposal } = useProposalStore();
await rejectProposal(proposalId, 'Not available');
```

---

## 🧪 Testing Workflow

### Start
```bash
npm start
```

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Reset Everything
```bash
npm start -- --reset-cache
```

---

## 🐛 Debug Tips

### Check Console
```typescript
console.log('Debug:', value);
console.error('Error:', error);
```

### React DevTools
```bash
npm install -D @react-native/debugger
```

### Check Network
In `src/services/api.ts`, network requests are logged automatically.

### Check State
```typescript
import { useAuthStore } from '@store/authStore';

// In component
const state = useAuthStore();
console.log('Auth state:', state);
```

---

## 📦 Adding Dependencies

```bash
npm install package-name

# For React Native packages, may need linking
cd ios && pod install && cd ..
```

---

## 🔑 Environment Variables

Create `.env`:
```
API_BASE_URL=https://api.chess-matching-app.com
```

Use:
```typescript
import { API_BASE_URL } from '@env';
```

---

## 🎯 File Naming Convention

- **Screens**: `ScreenNameScreen.tsx`
- **Components**: `ComponentName.tsx`
- **Stores**: `featureStore.ts`
- **Services**: `serviceName.ts`
- **Utils**: `utilName.ts`
- **Types**: `index.ts` (all in one file)

---

## ⚡ Performance Tips

1. Use `React.memo` for expensive components
2. Use `useCallback` for memoized callbacks
3. Use `useMemo` for expensive calculations
4. Avoid inline function definitions
5. Use FlatList for long lists
6. Lazy load screens with React.lazy()

---

## 🚀 Build for Release

### iOS
```bash
cd ios
xcodebuild -workspace ChessMatchingApp.xcworkspace \
  -scheme ChessMatchingApp -configuration Release
cd ..
```

### Android
```bash
cd android
./gradlew assembleRelease
cd ..
```

---

## 📚 Common Patterns

### Screen with Navigation
```typescript
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@types/index';

type Props = NativeStackScreenProps<HomeStackParamList, 'Map'>;

export default function MapScreen({ navigation, route }: Props) {
  return (
    <View>
      {/* Content */}
    </View>
  );
}
```

### Component with Store
```typescript
import { useAuthStore } from '@store/authStore';

export default function MyComponent() {
  const { user, logout } = useAuthStore();
  
  return (
    <View>
      <Text>{user?.username}</Text>
      <Button onPress={logout}>Logout</Button>
    </View>
  );
}
```

### API Call in Effect
```typescript
import { useEffect } from 'react';
import { useProposalStore } from '@store/proposalStore';

export default function ProposalsScreen() {
  const { fetchIncomingProposals, incomingProposals } = useProposalStore();

  useEffect(() => {
    fetchIncomingProposals();
  }, []);

  return (
    <FlatList
      data={incomingProposals}
      renderItem={({ item }) => <ProposalCard proposal={item} />}
    />
  );
}
```

---

## 🎓 Learn More

- [React Native Docs](https://reactnative.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Happy coding! 🎉**
