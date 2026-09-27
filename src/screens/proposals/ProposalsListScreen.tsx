import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Proposal, ProposalsStackParamList } from '@/types';
import { useProposalStore } from '@/store/proposalStore';
import { useLocationStore } from '@/store/locationStore';
import {
  AppHeader,
  ProposalCard,
  EmptyState,
  LoadingSpinner,
  SegmentedControl,
} from '@/components';
import { colors, spacing, typography, radius } from '@/theme';

type Props = NativeStackScreenProps<ProposalsStackParamList, 'ProposalsList'>;

type Tab = 'incoming' | 'outgoing';

const ACCENTS = [colors.primary, colors.secondary];

export default function ProposalsListScreen({ navigation }: Props) {
  const {
    incomingProposals,
    outgoingProposals,
    fetchIncomingProposals,
    fetchOutgoingProposals,
    acceptProposal,
    rejectProposal,
    cancelProposal,
    isLoading,
  } = useProposalStore();
  const isAvailable = useLocationStore(s => s.isAvailable);
  const [tab, setTab] = useState<Tab>('incoming');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    fetchIncomingProposals().catch(() => {});
    fetchOutgoingProposals().catch(() => {});
  }, [fetchIncomingProposals, fetchOutgoingProposals]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const openMaps = (p: Proposal) => {
    const { latitude, longitude } = p.meetingLocation;
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
    ).catch(() => {});
  };

  const handleAccept = async (p: Proposal) => {
    setBusyId(p.id);
    try {
      const result = await acceptProposal(p.id);
      const toRecord = () =>
        navigation.navigate('RecordMatch', {
          matchId: result?.matchId || p.id,
          opponentId: p.proposer.id,
          opponentUsername: p.proposer.username,
        });
      Alert.alert('Match on!', 'Head to the meeting spot and record the result after.', [
        { text: 'Record later', onPress: toRecord },
        {
          text: 'Navigate',
          onPress: () => {
            toRecord();
            openMaps(p);
          },
        },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to accept');
    } finally {
      setBusyId(null);
    }
  };

  const handleDecline = async (p: Proposal) => {
    setBusyId(p.id);
    try {
      await rejectProposal(p.id);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to decline');
    } finally {
      setBusyId(null);
    }
  };

  const handleCancel = async (p: Proposal) => {
    setBusyId(p.id);
    try {
      await cancelProposal(p.id);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to cancel');
    } finally {
      setBusyId(null);
    }
  };

  const data = tab === 'incoming' ? incomingProposals : outgoingProposals;
  const beaconColor = isAvailable ? colors.primary : colors.textTertiary;

  const header = (
    <View>
      <View style={styles.titleRow}>
        <View style={styles.flexFill}>
          <Text style={styles.title}>Match Requests</Text>
          <Text style={styles.subtitle}>Real-time board challenges in your sector</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.getParent()?.navigate('HomeStack', { screen: 'SetAvailability', initial: false })
          }
          style={[styles.beacon, { borderColor: beaconColor + '66' }]}>
          <Icon name={isAvailable ? 'radar' : 'broadcast-off'} size={16} color={beaconColor} />
          <Text style={[styles.beaconText, { color: isAvailable ? colors.textPrimary : beaconColor }]}>
            {isAvailable ? 'Live\nbeacon' : 'Beacon\noff'}
          </Text>
        </TouchableOpacity>
      </View>

      <SegmentedControl
        options={[
          { value: 'incoming', label: 'Incoming', count: incomingProposals.length },
          { value: 'outgoing', label: 'Sent', count: outgoingProposals.length },
        ]}
        value={tab}
        onChange={setTab}
        style={styles.tabs}
      />
    </View>
  );

  return (
    <View style={styles.flex}>
      <AppHeader subtitle="Challenges" />
      {isLoading && data.length === 0 ? (
        <>
          <View style={styles.padded}>{header}</View>
          <LoadingSpinner message="Loading requests..." />
        </>
      ) : (
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={header}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={load}
              tintColor={colors.primary}
              colors={[colors.primary]}
              progressBackgroundColor={colors.surface}
            />
          }
          renderItem={({ item, index }) => (
            <ProposalCard
              proposal={item}
              isIncoming={tab === 'incoming'}
              accent={ACCENTS[index % ACCENTS.length]}
              busy={busyId === item.id}
              onPress={() => navigation.navigate('ProposalDetail', { proposalId: item.id })}
              onAccept={() => handleAccept(item)}
              onDecline={() => handleDecline(item)}
              onCancel={() => handleCancel(item)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="mail-outline"
              title={tab === 'incoming' ? 'No challenges yet' : 'No sent challenges'}
              subtitle={
                tab === 'incoming'
                  ? 'Drop your beacon on the Radar so nearby players can challenge you.'
                  : 'Find a player on the Radar and send them a challenge.'
              }
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  flexFill: { flex: 1 },
  padded: { paddingHorizontal: spacing.md },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: { ...typography.display, color: colors.textPrimary },
  subtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  beacon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: spacing.sm,
  },
  beaconText: {
    ...typography.label,
    fontSize: 10,
    lineHeight: 12,
    marginLeft: 6,
  },
  tabs: { marginBottom: spacing.md },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
});
