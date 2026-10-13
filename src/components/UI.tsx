import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, radius, spacing, typography } from '@/theme';

// Small uppercase monospace pill: "5+0 BLITZ", "HAS BOARD", "ONLINE"
export function Tag({
  label,
  color = colors.textSecondary,
  icon,
  dot,
  filled,
  style,
}: {
  label: string;
  color?: string;
  icon?: string;
  dot?: boolean;
  filled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        styles.tag,
        { borderColor: color + '55', backgroundColor: filled ? color : color + '1A' },
        style,
      ]}>
      {dot && <View style={[styles.tagDot, { backgroundColor: filled ? colors.textInverse : color }]} />}
      {icon && (
        <Icon
          name={icon}
          size={12}
          color={filled ? colors.textInverse : color}
          style={styles.tagIcon}
        />
      )}
      <Text style={[styles.tagText, { color: filled ? colors.textInverse : color }]}>{label}</Text>
    </View>
  );
}

// Selectable pill used for filters (ALL / HAS BOARD / ...)
export function Chip({
  label,
  active,
  onPress,
  color = colors.primary,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  color?: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.chip,
        active && { backgroundColor: color, borderColor: color },
      ]}>
      <Text style={[styles.chipText, active && { color: colors.textInverse }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// Pill switch styled after the designs (neon track when on)
export function Toggle({
  value,
  onValueChange,
  disabled,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 160,
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [3, 23] });
  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.surfaceRaised, colors.primary],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={disabled && styles.disabled}
      hitSlop={8}>
      <Animated.View style={[styles.track, { backgroundColor }]}>
        <Animated.View
          style={[
            styles.thumb,
            { transform: [{ translateX }] },
            !value && styles.thumbOff,
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: string;
  count?: number;
}

// Rounded two-or-more-way switch ("Incoming | Sent", "List | Radar", "500M | 1KM ...")
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  mono,
  style,
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange: (v: T) => void;
  mono?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.segment, style]}>
      {options.map(opt => {
        const active = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.8}
            style={[styles.segmentItem, active && styles.segmentItemActive]}>
            {opt.icon && (
              <Icon
                name={opt.icon}
                size={16}
                color={active ? colors.textPrimary : colors.textTertiary}
                style={styles.segmentIcon}
              />
            )}
            <Text
              style={[
                mono ? styles.segmentTextMono : styles.segmentText,
                active && styles.segmentTextActive,
              ]}>
              {opt.label}
            </Text>
            {opt.count !== undefined && (
              <View style={[styles.count, active && opt.count > 0 && styles.countActive]}>
                <Text style={[styles.countText, active && opt.count > 0 && styles.countTextActive]}>
                  {opt.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Section title with a colored leading icon ("Radar & Proximity Beacon")
export function SectionHeader({
  title,
  icon,
  color = colors.primary,
  right,
  mono,
}: {
  title: string;
  icon?: string;
  color?: string;
  right?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <View style={styles.sectionHeader}>
      {icon && <Icon name={icon} size={18} color={color} style={styles.sectionIcon} />}
      <Text style={[mono ? styles.sectionTitleMono : styles.sectionTitle]}>{title}</Text>
      <View style={styles.flex} />
      {right}
    </View>
  );
}

// Square-ish icon tile used at the start of setting / gear rows
export function IconTile({
  icon,
  color = colors.primary,
  size = 44,
}: {
  icon: string;
  color?: string;
  size?: number;
}) {
  return (
    <View
      style={[
        styles.iconTile,
        { width: size, height: size, borderRadius: size * 0.3, borderColor: color + '40' },
      ]}>
      <Icon name={icon} size={size * 0.5} color={color} />
    </View>
  );
}

export function IconButton({
  icon,
  onPress,
  color = colors.textPrimary,
  size = 46,
}: {
  icon: string;
  onPress: () => void;
  color?: string;
  size?: number;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.iconButton, { width: size, height: size, borderRadius: size / 2 }]}>
      <Icon name={icon} size={size * 0.45} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  disabled: { opacity: 0.45 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  tagDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  tagIcon: { marginRight: 5 },
  tagText: { ...typography.label, fontSize: 10 },
  chip: {
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: spacing.sm,
  },
  chipText: { ...typography.label, color: colors.textSecondary },
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
  },
  thumbOff: { backgroundColor: colors.textTertiary },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 4,
  },
  segmentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.full,
  },
  segmentItemActive: { backgroundColor: colors.surfaceRaised },
  segmentIcon: { marginRight: 6 },
  segmentText: { ...typography.bodyBold, color: colors.textTertiary },
  segmentTextMono: { ...typography.label, color: colors.textTertiary },
  segmentTextActive: { color: colors.textPrimary },
  count: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
  },
  countActive: { backgroundColor: colors.primary },
  countText: { fontSize: 11, fontWeight: '800', color: colors.textSecondary },
  countTextActive: { color: colors.textInverse },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm + 2,
  },
  sectionIcon: { marginRight: spacing.sm },
  sectionTitle: { ...typography.h3, color: colors.textPrimary },
  sectionTitleMono: { ...typography.label, color: colors.textSecondary },
  iconTile: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
