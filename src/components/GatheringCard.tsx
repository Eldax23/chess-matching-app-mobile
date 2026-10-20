import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from './Card';
import { Avatar, RatingBadge } from './Avatar';
import { Tag } from './UI';
import { colors, spacing, typography } from '@/theme';
import { Gathering, GatheringStatus } from '@/types';
import { formatDistance } from '@/utils/geolocation';
import { ratingUtils, timeUtils } from '@/utils';

export const STATUS_LABELS: Record<GatheringStatus, { label: string; color: string }> = {
  open: { label: 'Open', color: colors.primary },
  gathered: { label: 'Gathered', color: colors.secondary },
  ended: { label: 'Ended', color: colors.textTertiary },
  cancelled: { label: 'Cancelled', color: colors.danger },
};

// "Today 18:00 – 20:00" style window
export function formatWindow(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const today = new Date().toDateString() === start.toDateString();
  const day = today ? 'Today' : timeUtils.formatDate(start);
  return `${day} ${timeUtils.formatTime(start)} – ${timeUtils.formatTime(endsAt)}`;
}

const MAX_FACES = 5;

export default function GatheringCard({
  gathering,
  onPress,
}: {
  gathering: Gathering;
  onPress?: () => void;
}) {
  const status = STATUS_LABELS[gathering.status];
  const hostRating = ratingUtils.best(gathering.host);
  const extra = gathering.memberCount - MAX_FACES;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Card style={styles.card} accent={gathering.isMember ? status.color : undefined}>
        <View style={styles.top}>
          <Avatar
            photoUrl={gathering.host.photoUrl}
            username={gathering.host.username}
            size={44}
            shape="circle"
          />
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>
              {gathering.venueName ?? `Hosted by ${gathering.host.fullName || gathering.host.username}`}
            </Text>
            <Text style={styles.sub}>{formatWindow(gathering.startsAt, gathering.endsAt)}</Text>
          </View>
          <Tag label={status.label} color={status.color} dot />
        </View>

        {gathering.note ? (
          <Text style={styles.note} numberOfLines={2}>
            {gathering.note}
          </Text>
        ) : null}

        <View style={styles.bottom}>
          <View style={styles.faces}>
            {gathering.members.slice(0, MAX_FACES).map((m, i) => (
              <View key={m.id} style={[styles.face, i > 0 && styles.faceOverlap]}>
                <Avatar photoUrl={m.photoUrl} username={m.username} size={26} shape="circle" />
              </View>
            ))}
            {extra > 0 && <Text style={styles.more}>+{extra}</Text>}
            <Text style={styles.count}>
              {gathering.memberCount} {gathering.memberCount === 1 ? 'person' : 'people'}
            </Text>
          </View>
          {hostRating && <RatingBadge label={hostRating.label} rating={hostRating.rating} />}
        </View>

        <View style={styles.metaRow}>
          <Icon
            name={gathering.isMember ? 'map-marker' : 'navigation-variant'}
            size={14}
            color={colors.textSecondary}
          />
          <Text style={styles.meta}>
            {gathering.isMember
              ? gathering.isHost
                ? "You're hosting"
                : "You're in"
              : gathering.distanceKm !== undefined
                ? `About ${formatDistance(gathering.distanceKm)} away`
                : 'Venue shared once you join'}
          </Text>
          {gathering.myPendingRequestId ? (
            <Tag label="Requested" color={colors.warning} style={styles.requested} />
          ) : null}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  top: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, marginHorizontal: spacing.md },
  title: { ...typography.h3, color: colors.textPrimary },
  sub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  note: { ...typography.body, color: colors.textPrimary, marginTop: spacing.sm },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  faces: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  face: { borderRadius: 14, borderWidth: 2, borderColor: colors.surface },
  faceOverlap: { marginLeft: -8 },
  more: { ...typography.small, color: colors.textSecondary, marginLeft: 4 },
  count: { ...typography.caption, color: colors.textSecondary, marginLeft: spacing.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  meta: { ...typography.caption, color: colors.textSecondary, marginLeft: 4, flex: 1 },
  requested: { marginLeft: spacing.sm },
});
