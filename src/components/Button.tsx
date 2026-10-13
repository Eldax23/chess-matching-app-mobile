import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, radius, spacing, typography, shadow } from '@/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'dark';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const TEXT_COLOR: Record<Variant, string> = {
  primary: colors.textInverse,
  secondary: colors.textInverse,
  danger: '#FFFFFF',
  outline: colors.primary,
  ghost: colors.primary,
  dark: colors.textPrimary,
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const textColor = TEXT_COLOR[variant];
  const glow =
    variant === 'primary'
      ? shadow.glow(colors.primary)
      : variant === 'secondary'
      ? shadow.glow(colors.secondary)
      : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        styles[`size_${size}`],
        styles[`variant_${variant}`],
        !isDisabled && glow,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon && (
            <Icon
              name={icon}
              size={size === 'lg' ? 22 : size === 'sm' ? 16 : 19}
              color={textColor}
              style={styles.icon}
            />
          )}
          <Text style={[styles.text, styles[`text_${size}`], { color: textColor }]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.45,
  },
  icon: {
    marginRight: spacing.sm,
  },
  size_sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  size_md: {
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
  },
  size_lg: {
    paddingVertical: 18,
    paddingHorizontal: spacing.xl,
  },
  variant_primary: {
    backgroundColor: colors.primary,
  },
  variant_secondary: {
    backgroundColor: colors.secondary,
  },
  variant_danger: {
    backgroundColor: colors.danger,
  },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  variant_ghost: {
    backgroundColor: 'transparent',
  },
  variant_dark: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    ...typography.bodyBold,
    fontWeight: '800',
  },
  text_sm: {
    fontSize: 13,
  },
  text_md: {
    fontSize: 15,
  },
  text_lg: {
    fontSize: 17,
  },
});
