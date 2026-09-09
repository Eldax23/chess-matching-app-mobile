import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { ProposalsStackParamList } from '@/types';
import { useProposalStore } from '@/store/proposalStore';
import { ProposalCard, EmptyState, LoadingSpinner } from '@/components';
import { colors, spacing, typography, radius, shadow } from '@/theme';

type Props = NativeStackScreenProps<ProposalsStackParamList, 'ProposalsList'>;

type Tab = 'incoming' | 'outgoing';

export default function ProposalsListScreen({ navigation }: Props) {
  const {
    incomingProposals,
    outgoingProposals,
    fetchIncomingProposals,
    fetchOutgoingProposals,
    isLoading,
  } = useProposalStore();
  const [tab, setTab] = useState<Tab>('incoming');

  const load = useCallback(() => {
    fetchIncomingProposals();
    fetchOutgoingProposals();
  }, [fetchIncomingProposals, fetchOutgoingProposals]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const data = tab === 'incoming' ? incomingProposals : outgoingProposals;

  return (
    <View style={styles.flex}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, tab === 'incoming' && styles.tabActive]}
          onPress={() => setTab('incoming')}>
          <Text style={[styles.tabText, tab === 'incoming' && styles.tabTextActive]}>
            Incoming {incomingProposals.length > 0 ? `(${incomingProposals.length})` : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'outgoing' && styles.tabActive]}
          onPress={() => setTab('outgoing')}>
          <Text style={[styles.tabText, tab === 'outgoing' && styles.tabTextActive]}>
            Sent {outgoingProposals.length > 0 ? `(${outgoingProposals.length})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && data.length === 0 ? (
        <LoadingSpinner message="Loading requests..." />
      ) : (
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={load} />}
          renderItem={({ item }) => (
            <ProposalCard
              proposal={item}
              onPress={() => navigation.navigate('ProposalDetail', { proposalId: item.id })}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="mail-outline"
              title={tab === 'incoming' ? 'No requests yet' : 'No sent requests'}
              subtitle={
                tab === 'incoming'
                  ? 'Challenges from nearby players will show up here.'
                  : 'Find a player nearby and send them a challenge.'
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
  tabBar: {
    flexDirection: 'row',
    margin: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.borderLight,
    borderRadius: radius.md,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  tabActive: {
    backgroundColor: colors.surface,
    ...shadow.sm,
  },
  tabText: { ...typography.bodyBold, color: colors.textSecondary },
  tabTextActive: { color: colors.textPrimary },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
});
