import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '@/store/authStore';
import { useLocationStore } from '@/store/locationStore';
import { Avatar } from './Avatar';
import { colors, radius, spacing, typography } from '@/theme';

export const APP_NAME = 'ChessMatching';

export default function AppHeader({
  subtitle,
  onBack,
}: {
  subtitle: string;
  onBack?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const user = useAuthStore(s => s.user);
  const isAvailable = useLocationStore(s => s.isAvailable);

  const statusColor = isAvailable ? colors.primary : colors.textTertiary;

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.logo} hitSlop={8}>
          <Icon name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.logo}>
          <Icon name="chess-knight" size={22} color={colors.primary} />
        </View>
      )}
      <View style={styles.titleWrap}>
        <Text style={styles.title}>{APP_NAME}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('HomeStack', { screen: 'SetAvailability', initial: false })
        }
        style={[
          styles.status,
          { borderColor: statusColor + '66', backgroundColor: statusColor + '14' },
        ]}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text style={[styles.statusText, { color: statusColor }]}>
          {isAvailable ? 'Ready to play' : 'Offline'}
        </Text>
      </TouchableOpacity>

      {user && (
        <TouchableOpacity
          onPress={() => navigation.navigate('ProfileStack', { screen: 'Profile' })}
          activeOpacity={0.8}>
          <Avatar photoUrl={user.photoUrl} username={user.username} size={34} shape="circle" />
        </TouchableOpacity>
      )}
    </View>
  );
}

// Large logo + wordmark used on the auth screens
export function BrandMark() {
  return (
    <View style={styles.brand}>
      <View style={styles.brandLogo}>
        <Icon name="chess-knight" size={40} color={colors.primary} />
      </View>
      <Text style={styles.brandName}>{APP_NAME}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  brandLogo: {
    width: 76,
    height: 76,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary + '66',
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  brandName: {
    ...typography.label,
    fontSize: 13,
    letterSpacing: 3,
    color: colors.primary,
    marginTop: spacing.sm + 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary + '55',
  },
  titleWrap: {
    flex: 1,
    marginLeft: spacing.sm + 2,
  },
  title: {
    ...typography.h3,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: -1,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: spacing.sm + 2,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    ...typography.label,
    fontSize: 10,
  },
});
