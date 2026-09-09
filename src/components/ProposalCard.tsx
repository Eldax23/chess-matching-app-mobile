import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Card from './Card';
import { Avatar } from './Avatar';
import { colors, spacing, typography, radius } from '@/theme';
import { Proposal } from '@/types';
import { formatDistance } from '@/utils/geolocation';
import { timeUtils } from '@/utils';

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: colors.warningLight, text: '#92400E', label: 'Pending' },
  accepted: { bg: colors.secondaryLight, text: '#065F46', label: 'Accepted' },
  rejected: { bg: colors.dangerLight, text: '#991B1B', label: 'Declined' },
  expired: { bg: colors.borderLight, text: colors.textSecondary, label: 'Expired' },
  cancelled: { bg: colors.borderLight, text: colors.textSecondary, label: 'Cancelled' },
};

export default function ProposalCard({
  proposal,
  onPress,
}: {
  proposal: Proposal;
  onPress?: () => void;
}) {
  const statusStyle = STATUS_STYLES[proposal.status] || STATUS_STYLES.pending;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <Avatar
            photoUrl={proposal.proposer.photoUrl}
            username={proposal.proposer.username}
            size={44}
          />
          <View style={styles.info}>
            <View style={styles.headerRow}>
              <Text style={styles.username} numberOfLines={1}>
                {proposal.proposer.fullName || proposal.proposer.username}
              </Text>
              <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                <Text style={[styles.statusText, { color: statusStyle.text }]}>
                  {statusStyle.label}
                </Text>
              </View>
            </View>
            {proposal.message ? (
              <Text style={styles.message} numberOfLines={2}>
                {proposal.message}
              </Text>
            ) : null}
            <View style={styles.metaRow}>
              <Icon name="place" size={14} color={colors.textTertiary} />
              <Text style={styles.metaText}>
                {formatDistance(proposal.distanceFromYouKm)} away
              </Text>
              <Text style={styles.metaDot}>·</Text>
              <Icon name="schedule" size={14} color={colors.textTertiary} />
              <Text style={styles.metaText}>
                {timeUtils.getTimeUntilExpiry(proposal.expiresAt)}
              </Text>
            </View>
          </View>
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
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  username: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  statusPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  statusText: {
    ...typography.small,
    fontWeight: '700',
  },
  message: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
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
});
