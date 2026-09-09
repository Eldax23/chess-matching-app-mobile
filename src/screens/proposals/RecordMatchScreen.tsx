import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ProposalsStackParamList, MatchOutcome } from '@/types';
import { apiClient } from '@/services/api';
import { Button, Card, Input } from '@/components';
import { colors, spacing, typography, radius } from '@/theme';

type Props = NativeStackScreenProps<ProposalsStackParamList, 'RecordMatch'>;

const OUTCOMES: { value: MatchOutcome; label: string; icon: string }[] = [
  { value: 'player1_won', label: 'I won', icon: 'emoji-events' },
  { value: 'player2_won', label: 'I lost', icon: 'sentiment-dissatisfied' },
  { value: 'draw', label: 'Draw', icon: 'handshake' },
];

const TIME_CONTROLS = ['Blitz', 'Rapid', 'Classical', 'Bullet'];

export default function RecordMatchScreen({ route, navigation }: Props) {
  const { opponentId, opponentUsername } = route.params;
  const [outcome, setOutcome] = useState<MatchOutcome | null>(null);
  const [timeControl, setTimeControl] = useState<string>('Rapid');
  const [playedWithBoard, setPlayedWithBoard] = useState(true);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!outcome) {
      Alert.alert('Pick a result', 'Select how the game ended before saving.');
      return;
    }
    setSaving(true);
    try {
      await apiClient.recordMatch({
        opponentId,
        playedAt: new Date().toISOString(),
        outcome,
        playedWithBoard,
        timeControl,
        notes: notes.trim() || undefined,
      });
      Alert.alert('Match recorded!', 'Great game — this is now in your history.', [
        { text: 'OK', onPress: () => navigation.popToTop() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to record match');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Text style={styles.opponentLabel}>Recording match vs @{opponentUsername}</Text>
      <Text style={styles.sectionTitle}>How did it go?</Text>
      <View style={styles.outcomeRow}>
        {OUTCOMES.map(o => (
          <TouchableOpacity
            key={o.value}
            style={[styles.outcomeCard, outcome === o.value && styles.outcomeCardActive]}
            onPress={() => setOutcome(o.value)}>
            <Icon
              name={o.icon}
              size={26}
              color={outcome === o.value ? colors.primary : colors.textTertiary}
            />
            <Text
              style={[
                styles.outcomeLabel,
                outcome === o.value && styles.outcomeLabelActive,
              ]}>
              {o.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Time control</Text>
      <View style={styles.chipsRow}>
        {TIME_CONTROLS.map(tc => (
          <TouchableOpacity
            key={tc}
            style={[styles.chip, timeControl === tc && styles.chipActive]}
            onPress={() => setTimeControl(tc)}>
            <Text style={[styles.chipText, timeControl === tc && styles.chipTextActive]}>
              {tc}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Card style={styles.section}>
        <TouchableOpacity
          style={styles.boardRow}
          onPress={() => setPlayedWithBoard(!playedWithBoard)}>
          <Icon
            name={playedWithBoard ? 'check-box' : 'check-box-outline-blank'}
            size={22}
            color={playedWithBoard ? colors.primary : colors.textTertiary}
          />
          <Text style={styles.boardLabel}>Played with a physical board</Text>
        </TouchableOpacity>
      </Card>

      <Input
        label="Notes (optional)"
        placeholder="Great endgame, close match..."
        value={notes}
        onChangeText={setNotes}
        multiline
        style={styles.notesInput}
      />

      <Button title="Save Result" onPress={handleSave} loading={saving} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xl },
  opponentLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  outcomeRow: { flexDirection: 'row', marginBottom: spacing.lg },
  outcomeCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginRight: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  outcomeCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  outcomeLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  outcomeLabelActive: { color: colors.primaryDark, fontWeight: '700' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.lg },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  chipText: { ...typography.caption, color: colors.textSecondary },
  chipTextActive: { color: colors.primaryDark, fontWeight: '700' },
  section: { marginBottom: spacing.lg },
  boardRow: { flexDirection: 'row', alignItems: 'center' },
  boardLabel: { ...typography.body, color: colors.textPrimary, marginLeft: spacing.sm },
  notesInput: { minHeight: 80, textAlignVertical: 'top' },
});
