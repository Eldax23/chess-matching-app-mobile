import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from './Card';
import Button from './Button';
import { Avatar, RatingBadge } from './Avatar';
import { Tag, IconButton } from './UI';
import { colors, spacing, typography } from '@/theme';
import { NearbyUser } from '@/types';
import { formatDistance } from '@/utils/geolocation';
import { ratingUtils } from '@/utils';

export default function UserCard({
  user,
  onPress,
  onChallenge,
  accent = colors.primary,
}: {
  user: NearbyUser;
  onPress?: () => void;
  onChallenge?: () => void;
  accent?: string;
}) {
  const rating = ratingUtils.best(user);
  const stats = user.stats;
  const games = stats?.totalMatchesPlayed ?? 0;

  return (
    <Card style={styles.card} padded={false}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.top}>
        <Avatar photoUrl={user.photoUrl} username={user.username} size={56} status={accent} />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {user.fullName || user.username}
            </Text>
            {games > 0 && stats ? (
              <Tag label={`${stats.winRate}% win`} color={accent} />
            ) : (
              <Tag label="New" color={accent} />
            )}
          </View>
          {rating && (
            <View style={styles.ratingRow}>
              <RatingBadge rating={rating.rating} color={accent} />
              <Text style={styles.ratingSource}>{rating.label}</Text>
            </View>
          )}
          <View style={styles.metaRow}>
            <Icon name="navigation-variant" size={14} color={colors.textSecondary} />
            <Text style={styles.distance}>{formatDistance(user.distanceKm)} away</Text>
            <Text style={styles.username} numberOfLines={1}>
              {' '}• @{user.username}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.tags}>
        {user.hasBoard && (
          <Tag label="Has board" icon="checkerboard" color={colors.primary} filled={accent === colors.primary} style={styles.tag} />
        )}
        {user.fideRating ? <Tag label="FIDE rated" icon="trophy-outline" style={styles.tag} /> : null}
        {games > 0 && <Tag label={`${games} OTB games`} icon="chart-line" style={styles.tag} />}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerLabel}>OTB record</Text>
          <Text style={[styles.footerValue, { color: games > 0 ? colors.textPrimary : accent }]}>
            {games > 0 && stats
              ? `${stats.totalWins}W · ${stats.totalLosses}L · ${stats.totalDraws}D`
              : 'Fresh challenger'}
          </Text>
        </View>
        <IconButton icon="account-outline" onPress={onPress ?? (() => {})} />
        <Button
          title="Challenge"
          icon="sword-cross"
          variant={accent === colors.primary ? 'primary' : 'secondary'}
          fullWidth={false}
          onPress={onChallenge ?? onPress ?? (() => {})}
          style={styles.challenge}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  top: {
    flexDirection: 'row',
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    ...typography.h3,
    fontSize: 19,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingSource: {
    ...typography.small,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  distance: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 4,
  },
  username: {
    ...typography.caption,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  tag: {
    marginRight: spacing.sm,
    marginTop: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    padding: spacing.md,
  },
  footerInfo: {
    flex: 1,
  },
  footerLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  footerValue: {
    ...typography.label,
    fontSize: 13,
    textTransform: 'none',
    letterSpacing: 0,
    marginTop: 2,
  },
  challenge: {
    marginLeft: spacing.sm + 2,
  },
});
