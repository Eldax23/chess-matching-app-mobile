import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ProposalsStackParamList } from '@/types';
import { useProposalStore } from '@/store/proposalStore';
import { Avatar, RatingBadge, Button, Card } from '@/components';
import { colors, spacing, typography, radius } from '@/theme';
import { formatDistance } from '@/utils/geolocation';
import { timeUtils } from '@/utils';

type Props = NativeStackScreenProps<ProposalsStackParamList, 'ProposalDetail'>;

export default function ProposalDetailScreen({ route, navigation }: Props) {
  const { proposalId } = route.params;
  const { incomingProposals, outgoingProposals, acceptProposal, rejectProposal, cancelProposal } =
    useProposalStore();
  const [busy, setBusy] = useState(false);

  const { proposal, isIncoming } = useMemo(() => {
    const incoming = incomingProposals.find(p => p.id === proposalId);
    if (incoming) return { proposal: incoming, isIncoming: true };
    const outgoing = outgoingProposals.find(p => p.id === proposalId);
    return { proposal: outgoing, isIncoming: false };
  }, [proposalId, incomingProposals, outgoingProposals]);

  if (!proposal) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>This request is no longer available.</Text>
      </View>
    );
  }

  const handleAccept = async () => {
    setBusy(true);
    try {
      const result = await acceptProposal(proposal.id);
      Alert.alert(
        'Match accepted!',
        'Head to the meeting spot and record the result after.',
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('RecordMatch', {
                matchId: result?.matchId || proposal.id,
                opponentId: proposal.proposer.id,
                opponentUsername: proposal.proposer.username,
              }),
          },
        ],
      );
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to accept');
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    setBusy(true);
    try {
      await rejectProposal(proposal.id);
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to decline');
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = async () => {
    setBusy(true);
    try {
      await cancelProposal(proposal.id);
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to cancel');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Avatar
          photoUrl={proposal.proposer.photoUrl}
          username={proposal.proposer.username}
          size={72}
        />
        <Text style={styles.name}>{proposal.proposer.fullName || proposal.proposer.username}</Text>
        <Text style={styles.username}>@{proposal.proposer.username}</Text>
      </View>

      {(proposal.proposer.fideRating ||
        proposal.proposer.chessComRating ||
        proposal.proposer.lichessRating) && (
        <View style={styles.badgeRow}>
          <RatingBadge label="FIDE" rating={proposal.proposer.fideRating} />
          <RatingBadge label="Chess.com" rating={proposal.proposer.chessComRating} />
          <RatingBadge label="Lichess" rating={proposal.proposer.lichessRating} />
        </View>
      )}

      {proposal.message ? (
        <Card style={styles.section}>
          <Text style={styles.sectionLabel}>Message</Text>
          <Text style={styles.message}>{proposal.message}</Text>
        </Card>
      ) : null}

      <Card style={styles.section}>
        <View style={styles.row}>
          <Icon name="place" size={20} color={colors.textSecondary} />
          <View style={styles.rowText}>
            <Text style={styles.sectionLabel}>Meeting spot</Text>
            <Text style={styles.rowValue}>
              {formatDistance(proposal.distanceFromYouKm)} from you
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <Icon name="schedule" size={20} color={colors.textSecondary} />
          <View style={styles.rowText}>
            <Text style={styles.sectionLabel}>Expires</Text>
            <Text style={styles.rowValue}>
              {timeUtils.getTimeUntilExpiry(proposal.expiresAt)} left
            </Text>
          </View>
        </View>
      </Card>

      <View style={styles.actions}>
        {proposal.status !== 'pending' ? (
          <View style={styles.statusNote}>
            <Text style={styles.statusNoteText}>
              This request is {proposal.status}.
            </Text>
          </View>
        ) : isIncoming ? (
          <>
            <Button title="Accept" onPress={handleAccept} loading={busy} />
            <Button
              title="Decline"
              variant="outline"
              onPress={handleReject}
              loading={busy}
              style={styles.secondaryButton}
            />
          </>
        ) : (
          <Button
            title="Cancel Request"
            variant="danger"
            onPress={handleCancel}
            loading={busy}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  notFound: { ...typography.body, color: colors.textSecondary },
  container: { padding: spacing.lg, paddingBottom: spacing.xl },
  header: { alignItems: 'center', marginBottom: spacing.md },
  name: { ...typography.h2, color: colors.textPrimary, marginTop: spacing.md },
  username: { ...typography.body, color: colors.textSecondary, marginTop: 2 },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  section: { marginBottom: spacing.md },
  sectionLabel: { ...typography.caption, color: colors.textSecondary },
  message: { ...typography.body, color: colors.textPrimary, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  rowText: { marginLeft: spacing.sm },
  rowValue: { ...typography.bodyBold, color: colors.textPrimary },
  actions: { marginTop: spacing.md },
  secondaryButton: { marginTop: spacing.sm },
  statusNote: {
    backgroundColor: colors.borderLight,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  statusNoteText: { ...typography.body, color: colors.textSecondary },
});
