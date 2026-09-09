import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Card from './Card';
import { Avatar, RatingBadge } from './Avatar';
import { colors, spacing, typography } from '@/theme';
import { NearbyUser } from '@/types';
import { formatDistance } from '@/utils/geolocation';

export default function UserCard({
  user,
  onPress,
}: {
  user: NearbyUser;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <Avatar photoUrl={user.photoUrl} username={user.username} size={48} />
          <View style={styles.info}>
            <Text style={styles.username} numberOfLines={1}>
              {user.fullName || user.username}
            </Text>
            <View style={styles.metaRow}>
              <Icon name="place" size={14} color={colors.textTertiary} />
              <Text style={styles.metaText}>{formatDistance(user.distanceKm)} away</Text>
              {user.hasBoard && (
                <>
                  <Text style={styles.metaDot}>·</Text>
                  <Icon name="grid-on" size={14} color={colors.textTertiary} />
                  <Text style={styles.metaText}>Has board</Text>
                </>
              )}
            </View>
            {(user.fideRating || user.chessComRating || user.lichessRating) && (
              <View style={styles.badgeRow}>
                <RatingBadge label="FIDE" rating={user.fideRating} />
                <RatingBadge label="Chess.com" rating={user.chessComRating} />
                <RatingBadge label="Lichess" rating={user.lichessRating} />
              </View>
            )}
          </View>
          <Icon name="chevron-right" size={22} color={colors.textTertiary} />
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  username: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    ...typography.small,
    color: colors.textTertiary,
    marginLeft: 4,
  },
  metaDot: {
    color: colors.textTertiary,
    marginHorizontal: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
});
