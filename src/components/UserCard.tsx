import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from './Card';
import { Avatar, RatingBadge } from './Avatar';
import { Tag, IconButton } from './UI';
import { colors, spacing, typography } from '@/theme';
import { NearbyUser } from '@/types';
import { formatDistance } from '@/utils/geolocation';
import { ratingUtils } from '@/utils';

export default function UserCard({
  user,
  onPress,
  accent = colors.primary,
}: {
  user: NearbyUser;
  onPress?: () => void;
  accent?: string;
}) {
  const rating = ratingUtils.best(user);

  return (
    <Card style={styles.card} padded={false}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.top}>
        <Avatar
          photoUrl={user.photoUrl}
          username={user.username}
          size={56}
          status={accent}
          shape="circle"
        />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {user.fullName || user.username}
            </Text>
            {!rating && <Tag label="Unrated" color={accent} />}
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
        {user.linkedAccounts?.map(account => (
          <Tag
            key={account.platform}
            label={account.platform === 'lichess' ? 'Lichess' : 'Chess.com'}
            icon={account.verified ? 'check-decagram' : 'link-variant'}
            style={styles.tag}
          />
        ))}
      </View>

      {user.bio ? (
        <View style={styles.footer}>
          <Text style={styles.bio} numberOfLines={2}>
            {user.bio}
          </Text>
          <IconButton icon="account-outline" onPress={onPress ?? (() => {})} />
        </View>
      ) : null}
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
  bio: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    marginRight: spacing.sm,
  },
});
