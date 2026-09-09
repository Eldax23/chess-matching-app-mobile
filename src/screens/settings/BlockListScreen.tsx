import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BlockedUser } from '@/types';
import { apiClient } from '@/services/api';
import { Card, Button, EmptyState, LoadingSpinner } from '@/components';
import { colors, spacing, typography } from '@/theme';
import { timeUtils } from '@/utils';

export default function BlockListScreen() {
  const [blocked, setBlocked] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [unblockingId, setUnblockingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.getBlockList();
      setBlocked(response.blockedUsers || []);
    } catch {
      // keep current state
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handleUnblock = async (id: string) => {
    setUnblockingId(id);
    try {
      await apiClient.unblockUser(id);
      setBlocked(prev => prev.filter(b => b.id !== id));
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to unblock');
    } finally {
      setUnblockingId(null);
    }
  };

  if (loading && blocked.length === 0) {
    return <LoadingSpinner message="Loading blocked players..." />;
  }

  return (
    <FlatList
      style={styles.flex}
      data={blocked}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={styles.info}>
              <Text style={styles.username}>@{item.blockedUsername}</Text>
              <Text style={styles.date}>
                Blocked {timeUtils.formatDate(item.blockedAt)}
              </Text>
              {item.reason ? <Text style={styles.reason}>{item.reason}</Text> : null}
            </View>
            <Button
              title="Unblock"
              variant="outline"
              size="sm"
              fullWidth={false}
              loading={unblockingId === item.id}
              onPress={() => handleUnblock(item.id)}
            />
          </View>
        </Card>
      )}
      ListEmptyComponent={
        <EmptyState
          icon="block"
          title="No blocked players"
          subtitle="Players you block will be listed here."
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: spacing.lg, flexGrow: 1 },
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  info: { flex: 1, marginRight: spacing.md },
  username: { ...typography.bodyBold, color: colors.textPrimary },
  date: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  reason: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
});
