import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Card from './Card';
import Button from './Button';
import { Avatar, RatingBadge } from './Avatar';
import { Tag, IconTile } from './UI';
import { colors, spacing, typography, radius } from '@/theme';
import { Proposal } from '@/types';
import { formatDistance } from '@/utils/geolocation';
import { timeUtils, ratingUtils } from '@/utils';

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  pending: { color: colors.warning, label: 'Pending' },
  accepted: { color: colors.primary, label: 'Accepted' },
  rejected: { color: colors.danger, label: 'Declined' },
  expired: { color: colors.textTertiary, label: 'Expired' },
  cancelled: { color: colors.textTertiary, label: 'Cancelled' },
};

// Requests closer than this to expiring get a red, per-second countdown
const URGENT_MS = 10 * 60 * 1000;

function useNow(intervalMs: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function timeAgo(date: string, now: number) {
  const mins = Math.max(0, Math.floor((now - new Date(date).getTime()) / 60000));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export default function ProposalCard({
  proposal,
  isIncoming = true,
  accent = colors.primary,
  busy = false,
  onPress,
  onAccept,
  onDecline,
  onCancel,
}: {
  proposal: Proposal;
  isIncoming?: boolean;
  accent?: string;
  busy?: boolean;
  onPress?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  onCancel?: () => void;
}) {
  const expiresMs = new Date(proposal.expiresAt).getTime();
  const pending = proposal.status === 'pending';
  const urgent = pending && expiresMs - Date.now() < URGENT_MS;
  const now = useNow(urgent ? 1000 : 30000);
  const remaining = expiresMs - now;

  const status = STATUS_STYLES[proposal.status] || STATUS_STYLES.pending;
  const person = proposal.proposer;
  const rating = ratingUtils.best(person);
  const primaryVariant = accent === colors.primary ? 'primary' : 'secondary';

  return (
    <Card
      style={[styles.card, urgent && { backgroundColor: colors.surfaceAlt }]}
      accent={urgent ? accent : undefined}>
      <View style={styles.topRow}>
        {urgent && remaining > 0 ? (
          <Tag label={`Expires in ${formatCountdown(remaining)}`} dot color={colors.danger} />
        ) : (
          <Tag label={timeAgo(proposal.createdAt, now)} icon="clock-outline" />
        )}
        <Tag label={status.label} color={pending ? accent : status.color} icon="sword-cross" />
      </View>

      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.person}>
        <Avatar photoUrl={person.photoUrl} username={person.username || '?'} size={56} status={accent} />
        <View style={styles.personInfo}>
          <Text style={styles.name} numberOfLines={1}>
            {person.fullName || person.username || 'Challenge sent'}
          </Text>
          <View style={styles.ratingRow}>
            {rating && <RatingBadge rating={rating.rating} label={rating.label} color={accent} />}
            {person.username ? <Text style={styles.handle}>@{person.username}</Text> : null}
          </View>
        </View>
      </TouchableOpacity>

      {proposal.message ? (
        <Text style={styles.message} numberOfLines={3}>
          “{proposal.message}”
        </Text>
      ) : null}

      <View style={styles.spot}>
        <IconTile icon="map-marker-radius-outline" color={accent} size={40} />
        <View style={styles.spotInfo}>
          <Text style={styles.spotTitle} numberOfLines={1}>
            {proposal.meetingLocation?.address || 'Pinned meeting spot'}
          </Text>
          <Text style={styles.spotSub}>
            {formatDistance(proposal.distanceFromYouKm)} away
            {pending ? ` • ${timeUtils.getTimeUntilExpiry(proposal.expiresAt)} left` : ''}
          </Text>
        </View>
        {person.hasBoard && <Tag label="Has board" color={colors.textSecondary} />}
      </View>

      {pending && isIncoming && (
        <View style={styles.actions}>
          <Button
            title="Accept & Navigate"
            icon="walk"
            variant={primaryVariant}
            onPress={onAccept ?? (() => {})}
            loading={busy}
            fullWidth={false}
            style={styles.accept}
          />
          <Button
            title="Decline"
            icon="close"
            variant="dark"
            onPress={onDecline ?? (() => {})}
            disabled={busy}
            fullWidth={false}
            style={styles.decline}
          />
        </View>
      )}
      {pending && !isIncoming && (
        <View style={styles.actions}>
          <Button
            title="Cancel Request"
            icon="close-circle-outline"
            variant="dark"
            onPress={onCancel ?? (() => {})}
            loading={busy}
          />
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  person: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    ...typography.h3,
    fontSize: 19,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  handle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginLeft: 2,
  },
  message: {
    ...typography.body,
    fontStyle: 'italic',
    color: colors.textSecondary,
    marginTop: spacing.sm + 4,
  },
  spot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.sm + 2,
    marginTop: spacing.md,
  },
  spotInfo: {
    flex: 1,
    marginHorizontal: spacing.sm + 2,
  },
  spotTitle: {
    ...typography.bodyBold,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  spotSub: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  accept: {
    flex: 1.4,
    paddingHorizontal: spacing.sm,
  },
  decline: {
    flex: 1,
    marginLeft: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
  },
});
