import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

export function Avatar({
  photoUrl,
  username,
  size = 48,
}: {
  photoUrl?: string;
  username: string;
  size?: number;
}) {
  const initial = username?.charAt(0)?.toUpperCase() || '?';

  if (photoUrl) {
    return (
      <Image
        source={{ uri: photoUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        { width: size, height: size, borderRadius: size / 2 },
      ]}>
      <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{initial}</Text>
    </View>
  );
}

export function RatingBadge({ label, rating }: { label: string; rating?: number }) {
  if (!rating) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeLabel}>{label}</Text>
      <Text style={styles.badgeValue}>{rating}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.borderLight,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  badgeLabel: {
    ...typography.small,
    color: colors.textSecondary,
    marginRight: 4,
  },
  badgeValue: {
    ...typography.small,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
