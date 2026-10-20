import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { GatheringsStackParamList, JoinRequest } from '@/types';
import { useGatheringStore } from '@/store/gatheringStore';
import { useLocationStore } from '@/store/locationStore';
import {
  AppHeader,
  Avatar,
  Button,
  Card,
  EmptyState,
  GatheringCard,
  RatingBadge,
  SectionHeader,
  SegmentedControl,
} from '@/components';
import { colors, spacing, typography } from '@/theme';
import { getCurrentLocation, requestLocationPermission } from '@/utils/geolocation';
import { ratingUtils, timeUtils } from '@/utils';

type Props = NativeStackScreenProps<GatheringsStackParamList, 'GatheringsList'>;

type Tab = 'nearby' | 'mine' | 'requests';

export default function GatheringsListScreen({ navigation }: Props) {
  const {
    nearby,
    mine,
    requestsToApprove,
    myRequests,
    fetchNearby,
    fetchMine,
    fetchRequests,
    approveRequest,
    rejectRequest,
    withdrawRequest,
    isLoading,
    error,
  } = useGatheringStore();
  const { currentLocation, searchRadiusKm } = useLocationStore();
  const [tab, setTab] = useState<Tab>('nearby');
  const [busyId, setBusyId] = useState<string | null>(null);

  // The store records failures in `error`; catch here only to avoid unhandled rejections
  const load = useCallback(async () => {
    fetchMine().catch(() => {});
    fetchRequests().catch(() => {});
    try {
      let here = currentLocation;
      if (!here && (await requestLocationPermission())) {
        here = await getCurrentLocation();
      }
      if (here) {
        await fetchNearby(here.latitude, here.longitude, searchRadiusKm);
      }
    } catch {
      // shown via `error`
    }
  }, [currentLocation, searchRadiusKm, fetchMine, fetchRequests, fetchNearby]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const open = (gatheringId: string) => navigation.navigate('GatheringDetail', { gatheringId });

  const act = async (id: string, action: () => Promise<unknown>, done?: [string, string]) => {
    setBusyId(id);
    try {
      await action();
      if (done) Alert.alert(...done);
      fetchMine().catch(() => {});
    } catch (e: any) {
      Alert.alert('Something went wrong', e?.response?.data?.message || 'Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  const pendingMine = myRequests.filter(r => r.status === 'pending');

  const header = (
    <>
      <SegmentedControl
        options={[
          { value: 'nearby' as Tab, label: 'Nearby', icon: 'radar' },
          { value: 'mine' as Tab, label: 'Mine', icon: 'account-group-outline' },
          {
            value: 'requests' as Tab,
            label: 'Requests',
            icon: 'hand-wave-outline',
            count: requestsToApprove.length || undefined,
          },
        ]}
        value={tab}
        onChange={setTab}
        style={styles.tabs}
      />
      {tab !== 'requests' && (
        <Button
          title="Host a gathering"
          icon="plus"
          onPress={() => navigation.navigate('CreateGathering')}
          style={styles.host}
        />
      )}
    </>
  );

  if (tab === 'requests') {
    return (
      <View style={styles.flex}>
        <AppHeader subtitle="Gatherings" />
        <FlatList
          contentContainerStyle={styles.container}
          data={requestsToApprove}
          keyExtractor={r => r.id}
          refreshControl={<RefreshControl refreshing={false} onRefresh={load} tintColor={colors.primary} />}
          ListHeaderComponent={
            <>
              {header}
              <SectionHeader title="Asking to join you" icon="hand-wave-outline" />
              <Text style={styles.hint}>
                One yes from anyone in the gathering lets them in. Requests lapse after 15 minutes.
              </Text>
            </>
          }
          renderItem={({ item }) => (
            <RequestCard
              request={item}
              busy={busyId === item.id}
              onOpen={() => open(item.gatheringId)}
              onApprove={() => act(item.id, () => approveRequest(item.id), [
                  `${item.requester.fullName || item.requester.username} is in!`,
                  'They can see the venue now.',
                ])}
              onReject={() => act(item.id, () => rejectRequest(item.id))}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>Nobody is waiting on you right now.</Text>}
          ListFooterComponent={
            pendingMine.length > 0 ? (
              <View style={styles.section}>
                <SectionHeader title="Your requests" icon="send-outline" />
                {pendingMine.map(r => (
                  <Card key={r.id} style={styles.requestCard}>
                    <TouchableOpacity onPress={() => open(r.gatheringId)}>
                      <Text style={styles.requestTitle}>
                        Waiting to join a gathering
                      </Text>
                      <Text style={styles.hint}>
                        Lapses in {timeUtils.getTimeUntilExpiry(r.expiresAt)}
                      </Text>
                    </TouchableOpacity>
                    <Button
                      title="Withdraw"
                      variant="outline"
                      loading={busyId === r.id}
                      onPress={() => act(r.id, () => withdrawRequest(r.id))}
                      style={styles.withdraw}
                    />
                  </Card>
                ))}
              </View>
            ) : null
          }
        />
      </View>
    );
  }

  const data = tab === 'nearby' ? nearby : mine;

  return (
    <View style={styles.flex}>
      <AppHeader subtitle="Gatherings" />
      <FlatList
        contentContainerStyle={styles.container}
        data={data}
        keyExtractor={g => g.id}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={load} tintColor={colors.primary} />}
        ListHeaderComponent={header}
        renderItem={({ item }) => <GatheringCard gathering={item} onPress={() => open(item.id)} />}
        ListEmptyComponent={
          error ? (
            <EmptyState icon="wifi-off" title="Couldn't load gatherings" subtitle={error} />
          ) : tab === 'nearby' ? (
            <EmptyState
              icon="groups"
              title="No gatherings nearby yet"
              subtitle="Host one and people around you can ask to join."
            />
          ) : (
            <EmptyState
              icon="event-busy"
              title="You're not in any gatherings"
              subtitle="Join one nearby or host your own."
            />
          )
        }
      />
    </View>
  );
}

function RequestCard({
  request,
  busy,
  onOpen,
  onApprove,
  onReject,
}: {
  request: JoinRequest;
  busy: boolean;
  onOpen: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const rating = ratingUtils.best(request.requester);
  return (
    <Card style={styles.requestCard}>
      <TouchableOpacity style={styles.requestTop} onPress={onOpen} activeOpacity={0.8}>
        <Avatar
          photoUrl={request.requester.photoUrl}
          username={request.requester.username}
          size={44}
          shape="circle"
        />
        <View style={styles.requestInfo}>
          <Text style={styles.requestTitle}>
            {request.requester.fullName || request.requester.username}
          </Text>
          <Text style={styles.hint}>
            @{request.requester.username} · lapses in {timeUtils.getTimeUntilExpiry(request.expiresAt)}
          </Text>
        </View>
        {rating ? <RatingBadge label={rating.label} rating={rating.rating} /> : null}
      </TouchableOpacity>
      {request.message ? <Text style={styles.message}>"{request.message}"</Text> : null}
      <View style={styles.actions}>
        <Button title="Not this time" variant="dark" onPress={onReject} disabled={busy} style={styles.grow} />
        <Button title="Let them in" icon="check" onPress={onApprove} loading={busy} style={[styles.grow, styles.approve]} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  grow: { flex: 1 },
  container: { padding: spacing.lg, paddingBottom: spacing.xxl },
  tabs: { marginBottom: spacing.md },
  host: { marginBottom: spacing.lg },
  section: { marginTop: spacing.lg },
  hint: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  empty: { ...typography.body, color: colors.textSecondary, marginVertical: spacing.md },
  requestCard: { marginBottom: spacing.md },
  requestTop: { flexDirection: 'row', alignItems: 'center' },
  requestInfo: { flex: 1, marginHorizontal: spacing.md },
  requestTitle: { ...typography.bodyBold, color: colors.textPrimary },
  message: { ...typography.body, color: colors.textPrimary, marginTop: spacing.sm, fontStyle: 'italic' },
  actions: { flexDirection: 'row', marginTop: spacing.md },
  approve: { marginLeft: spacing.sm },
  withdraw: { marginTop: spacing.sm },
});
