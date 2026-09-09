import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ProfileStackParamList } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { Avatar, RatingBadge, Card } from '@/components';
import { colors, spacing, typography, radius } from '@/theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const { user } = useAuthStore();

  if (!user) return null;

  const stats = user.stats;

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Avatar photoUrl={user.photoUrl} username={user.username} size={88} />
        <Text style={styles.name}>{user.fullName || user.username}</Text>
        <Text style={styles.username}>@{user.username}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <View style={styles.editButton}>
            <Icon name="edit" size={14} color={colors.primary} />
            <Text style={styles.editButtonText}>Edit profile</Text>
          </View>
        </TouchableOpacity>
      </View>

      {user.bio ? (
        <Card style={styles.section}>
          <Text style={styles.bio}>{user.bio}</Text>
        </Card>
      ) : null}

      {(user.fideRating || user.chessCom?.rating || user.lichess?.rating) && (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Ratings</Text>
          <View style={styles.badgeRow}>
            <RatingBadge label="FIDE" rating={user.fideRating} />
            <RatingBadge label="Chess.com" rating={user.chessCom?.rating} />
            <RatingBadge label="Lichess" rating={user.lichess?.rating} />
          </View>
        </Card>
      )}

      {stats && (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalMatchesPlayed}</Text>
              <Text style={styles.statLabel}>Games</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalWins}</Text>
              <Text style={styles.statLabel}>Wins</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalLosses}</Text>
              <Text style={styles.statLabel}>Losses</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalDraws}</Text>
              <Text style={styles.statLabel}>Draws</Text>
            </View>
          </View>
        </Card>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('MatchHistory')}>
        <Card style={styles.linkCard}>
          <Icon name="history" size={20} color={colors.textPrimary} />
          <Text style={styles.linkText}>Match History</Text>
          <Icon name="chevron-right" size={20} color={colors.textTertiary} />
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xl },
  header: { alignItems: 'center', marginBottom: spacing.lg },
  name: { ...typography.h2, color: colors.textPrimary, marginTop: spacing.md },
  username: { ...typography.body, color: colors.textSecondary, marginTop: 2 },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
  },
  editButtonText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
    marginLeft: 4,
  },
  section: { marginBottom: spacing.md },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  bio: { ...typography.body, color: colors.textPrimary },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { ...typography.h2, color: colors.textPrimary },
  statLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: { ...typography.bodyBold, color: colors.textPrimary, flex: 1, marginLeft: spacing.sm },
});
