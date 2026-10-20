import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HomeStackParamList, ReviewListResponse, UserPublicProfile } from '@/types';
import { apiClient } from '@/services/api';
import { Avatar, RatingBadge, Card, LinkedAccountCard, LoadingSpinner, Tag } from '@/components';
import { colors, spacing, typography, radius } from '@/theme';
import { REVIEW_TAG_LABELS } from '@/utils';

type Props = NativeStackScreenProps<HomeStackParamList, 'UserProfile'>;

export default function UserProfileScreen({ route }: Props) {
  const { userId } = route.params;

  const [profile, setProfile] = useState<UserPublicProfile | null>(null);
  const [reviews, setReviews] = useState<ReviewListResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiClient.getUserProfile(userId);
        setProfile(data);
      } catch {
        Alert.alert('Error', 'Could not load this profile.');
      } finally {
        setLoading(false);
      }
    })();
    // Reviews are a nice-to-have; the profile still shows without them
    apiClient
      .getReviewsForUser(userId)
      .then(setReviews)
      .catch(() => {});
  }, [userId]);

  if (loading) return <LoadingSpinner message="Loading profile..." />;
  if (!profile) return null;

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Avatar photoUrl={profile.photoUrl} username={profile.username} size={80} />
        <Text style={styles.name}>{profile.fullName || profile.username}</Text>
        <Text style={styles.username}>@{profile.username}</Text>
        {profile.hasBoard && (
          <View style={styles.boardPill}>
            <Icon name="grid-on" size={14} color={colors.secondary} />
            <Text style={styles.boardPillText}>Has a board</Text>
          </View>
        )}
      </View>

      {profile.bio ? (
        <Card style={styles.section}>
          <Text style={styles.bio}>{profile.bio}</Text>
        </Card>
      ) : null}

      {(profile.fideRating || profile.chessComRating || profile.lichessRating) && (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Ratings</Text>
          <View style={styles.badgeRow}>
            <RatingBadge label="FIDE" rating={profile.fideRating} />
            <RatingBadge label="Chess.com" rating={profile.chessComRating} />
            <RatingBadge label="Lichess" rating={profile.lichessRating} />
          </View>
        </Card>
      )}

      {profile.linkedAccounts?.map(account => (
        <View key={account.platform} style={styles.section}>
          <LinkedAccountCard account={account} />
        </View>
      ))}

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>What people say</Text>
        {reviews && reviews.count > 0 ? (
          <>
            <View style={styles.badgeRow}>
              {reviews.tagCounts.map(t => (
                <Tag
                  key={t.tag}
                  label={`${REVIEW_TAG_LABELS[t.tag]} · ${t.count}`}
                  color={colors.primary}
                  style={styles.reviewTag}
                />
              ))}
              {reviews.noShowCount > 0 && (
                <Tag
                  label={`Missed ${reviews.noShowCount} meetup${reviews.noShowCount > 1 ? 's' : ''}`}
                  color={colors.danger}
                  style={styles.reviewTag}
                />
              )}
            </View>
            {reviews.reviews
              .filter(r => r.comment)
              .slice(0, 3)
              .map(r => (
                <View key={r.id} style={styles.comment}>
                  <Text style={styles.commentText}>"{r.comment}"</Text>
                  <Text style={styles.commentBy}>@{r.reviewerUsername}</Text>
                </View>
              ))}
          </>
        ) : (
          <Text style={styles.helperText}>
            No reviews yet. They appear after people meet up at a gathering.
          </Text>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xl },
  header: { alignItems: 'center', marginBottom: spacing.lg },
  name: { ...typography.h2, color: colors.textPrimary, marginTop: spacing.md },
  username: { ...typography.body, color: colors.textSecondary, marginTop: 2 },
  boardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    marginTop: spacing.sm,
  },
  boardPillText: {
    ...typography.small,
    color: colors.secondary,
    fontWeight: '700',
    marginLeft: 4,
  },
  section: { marginBottom: spacing.md },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  bio: { ...typography.body, color: colors.textPrimary },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap' },
  reviewTag: { marginRight: spacing.sm, marginBottom: spacing.xs },
  comment: { marginTop: spacing.sm },
  commentText: { ...typography.body, color: colors.textPrimary, fontStyle: 'italic' },
  commentBy: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  helperText: { ...typography.caption, color: colors.textSecondary },
});
