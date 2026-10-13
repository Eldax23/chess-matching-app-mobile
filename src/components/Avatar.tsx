import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

export function Avatar({
  photoUrl,
  username,
  size = 48,
  shape = 'rounded',
  status,
}: {
  photoUrl?: string;
  username: string;
  size?: number;
  shape?: 'rounded' | 'circle';
  // Color of the presence dot in the bottom-right corner; omitted = no dot
  status?: string;
}) {
  const initial = username?.charAt(0)?.toUpperCase() || '?';
  const borderRadius = shape === 'circle' ? size / 2 : Math.round(size * 0.26);
  const dotSize = Math.max(10, Math.round(size * 0.26));

  return (
    <View style={{ width: size, height: size }}>
      {photoUrl ? (
        <Image
          source={{ uri: photoUrl }}
          style={[styles.frame, { width: size, height: size, borderRadius }]}
        />
      ) : (
        <View style={[styles.frame, styles.placeholder, { width: size, height: size, borderRadius }]}>
          <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{initial}</Text>
        </View>
      )}
      {status && (
        <View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: status,
              right: -dotSize * 0.2,
              bottom: -dotSize * 0.2,
            },
          ]}
        />
      )}
    </View>
  );
}

export function RatingBadge({
  label,
  rating,
  color = colors.secondary,
}: {
  label?: string;
  rating?: number;
  color?: string;
}) {
  if (!rating) return null;
  return (
    <View style={[styles.badge, { borderColor: color + '55', backgroundColor: color + '1A' }]}>
      {label ? <Text style={styles.badgeLabel}>{label}</Text> : null}
      <Text style={[styles.badgeValue, { color }]}>{rating}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  placeholder: {
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: colors.primary,
    fontWeight: '800',
  },
  dot: {
    position: 'absolute',
    borderWidth: 2.5,
    borderColor: colors.surface,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  badgeLabel: {
    ...typography.label,
    fontSize: 10,
    color: colors.textSecondary,
    marginRight: 5,
  },
  badgeValue: {
    ...typography.label,
    fontSize: 12,
  },
});
