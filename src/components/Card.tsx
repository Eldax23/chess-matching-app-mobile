import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, radius, spacing, shadow } from '@/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  elevated?: boolean;
  // Tints the border with an accent color (e.g. highlighted challenge cards)
  accent?: string;
}

export default function Card({
  children,
  style,
  padded = true,
  elevated = true,
  accent,
}: CardProps) {
  return (
    <View
      style={[
        styles.card,
        padded && styles.padded,
        elevated && shadow.sm,
        accent ? { borderColor: accent + '55' } : null,
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  padded: {
    padding: spacing.md,
  },
});
