import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Gathering, GatheringsStackParamList, ReviewTag } from '@/types';
import { apiClient } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { Avatar, Button, Card, Chip, Input, LoadingSpinner, Toggle } from '@/components';
import { colors, spacing, typography } from '@/theme';
import { REVIEW_TAG_LABELS } from '@/utils';

type Props = NativeStackScreenProps<GatheringsStackParamList, 'ReviewGathering'>;

interface Draft {
  tags: ReviewTag[];
  noShow: boolean;
  comment: string;
}

const EMPTY: Draft = { tags: [], noShow: false, comment: '' };
const TAGS = Object.keys(REVIEW_TAG_LABELS) as ReviewTag[];

// Reviews are about how the meetup went with each person, never about the chess
export default function ReviewGatheringScreen({ route, navigation }: Props) {
  const { gatheringId } = route.params;
  const myId = useAuthStore(s => s.user?.id);

  const [gathering, setGathering] = useState<Gathering | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiClient
      .getGathering(gatheringId)
      .then(setGathering)
      .catch(() => {
        Alert.alert('Error', 'Could not load this gathering.');
        navigation.goBack();
      });
  }, [gatheringId, navigation]);

  if (!gathering) return <LoadingSpinner message="Loading..." />;

  const others = gathering.members.filter(m => m.id !== myId);
  const draftFor = (id: string) => drafts[id] ?? EMPTY;
  const update = (id: string, change: Partial<Draft>) =>
    setDrafts(d => ({ ...d, [id]: { ...draftFor(id), ...change } }));

  const toggleTag = (id: string, tag: ReviewTag) => {
    const tags = draftFor(id).tags;
    update(id, { tags: tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag] });
  };

  const filled = others.filter(m => {
    const d = draftFor(m.id);
    return d.noShow || d.tags.length > 0 || d.comment.trim();
  });

  const handleSubmit = async () => {
    setSaving(true);
    const failed: string[] = [];
    for (const m of filled) {
      const d = draftFor(m.id);
      try {
        await apiClient.createReview({
          gatheringId,
          revieweeId: m.id,
          noShow: d.noShow,
          tags: d.noShow ? [] : d.tags,
          comment: d.comment.trim() || undefined,
        });
      } catch {
        failed.push(m.username);
      }
    }
    setSaving(false);
    if (failed.length) {
      Alert.alert(
        'Some reviews were not saved',
        `Couldn't save for ${failed.join(', ')}. You may have reviewed them already.`,
      );
    } else {
      Alert.alert('Thanks!', 'Your reviews help people find good company.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.intro}>
        How was meeting everyone? Skip anyone you'd rather not review.
      </Text>

      {others.map(m => {
        const d = draftFor(m.id);
        return (
          <Card key={m.id} style={styles.card}>
            <View style={styles.person}>
              <Avatar photoUrl={m.photoUrl} username={m.username} size={40} shape="circle" />
              <Text style={styles.name}>{m.fullName || m.username}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Didn't show up</Text>
              <Toggle value={d.noShow} onValueChange={v => update(m.id, { noShow: v })} />
            </View>

            {!d.noShow && (
              <View style={styles.chips}>
                {TAGS.map(tag => (
                  <Chip
                    key={tag}
                    label={REVIEW_TAG_LABELS[tag]}
                    active={d.tags.includes(tag)}
                    onPress={() => toggleTag(m.id, tag)}
                  />
                ))}
              </View>
            )}

            <Input
              placeholder="Anything to add? (optional)"
              value={d.comment}
              onChangeText={comment => update(m.id, { comment })}
              maxLength={500}
              multiline
            />
          </Card>
        );
      })}

      <Button
        title={filled.length ? `Send ${filled.length} review${filled.length > 1 ? 's' : ''}` : 'Send reviews'}
        disabled={!filled.length}
        loading={saving}
        onPress={handleSubmit}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xxl },
  intro: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.md },
  card: { marginBottom: spacing.md },
  person: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  name: { ...typography.bodyBold, color: colors.textPrimary, marginLeft: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.sm,
  },
  rowLabel: { ...typography.body, color: colors.textPrimary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
});
