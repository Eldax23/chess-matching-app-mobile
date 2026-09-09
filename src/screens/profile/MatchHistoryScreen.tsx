import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Match } from '@/types';
import { apiClient } from '@/services/api';
import { Avatar, Card, EmptyState, LoadingSpinner } from '@/components';
import { colors, spacing, typography, radius } from '@/theme';
import { timeUtils } from '@/utils';

const OUTCOME_META: Record<string, { label: string; color: string; icon: string }> = {
  player1_won: { label: 'Won', color: colors.secondary, icon: 'emoji-events' },
  player2_won: { label: 'Lost', color: colors.danger, icon: 'sentiment-dissatisfied' },
  draw: { label: 'Draw', color: colors.warning, icon: 'handshake' },
  not_played: { label: 'Not played', color: colors.textTertiary, icon: 'schedule' },
};

export default function MatchHistoryScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.getMatchHistory();
      setMatches(response.matches || []);
    } catch {
      // keep whatever is on screen
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading && matches.length === 0) {
    return <LoadingSpinner message="Loading match history..." />;
  }

  return (
    <FlatList
      style={styles.flex}
      data={matches}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      renderItem={({ item }) => {
        const meta = OUTCOME_META[item.outcome] || OUTCOME_META.not_played;
        return (
          <Card style={styles.card}>
            <View style={styles.row}>
              <Avatar
                photoUrl={item.opponent.photoUrl}
                username={item.opponent.username}
                size={44}
              />
              <View style={styles.info}>
                <Text style={styles.name}>
                  {item.opponent.fullName || item.opponent.username}
                </Text>
                <Text style={styles.date}>{timeUtils.formatDate(item.playedAt)}</Text>
                {item.timeControl && <Text style={styles.timeControl}>{item.timeControl}</Text>}
              </View>
              <View style={[styles.outcomePill, { backgroundColor: `${meta.color}22` }]}>
                <Icon name={meta.icon} size={14} color={meta.color} />
                <Text style={[styles.outcomeText, { color: meta.color }]}>{meta.label}</Text>
              </View>
            </View>
            {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
          </Card>
        );
      }}
      ListEmptyComponent={
        <EmptyState
          icon="history"
          title="No matches yet"
          subtitle="Games you record will appear here."
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: spacing.lg, flexGrow: 1 },
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, marginLeft: spacing.md },
  name: { ...typography.bodyBold, color: colors.textPrimary },
  date: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  timeControl: { ...typography.small, color: colors.textTertiary, marginTop: 2 },
  outcomePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  outcomeText: { ...typography.small, fontWeight: '700', marginLeft: 4 },
  notes: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
});
