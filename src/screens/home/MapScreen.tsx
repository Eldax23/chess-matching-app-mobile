import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, NearbyUser } from '@/types';
import { useLocationStore } from '@/store/locationStore';
import { UserCard, EmptyState, LoadingSpinner, Button } from '@/components';
import { colors, spacing, typography, radius, shadow } from '@/theme';
import { getCurrentLocation, requestLocationPermission } from '@/utils/geolocation';

type Props = NativeStackScreenProps<HomeStackParamList, 'Map'>;

const DEFAULT_RADIUS_KM = 10;

export default function MapScreen({ navigation }: Props) {
  const { isAvailable, currentLocation, getNearbyUsers, isLoading } = useLocationStore();
  const [players, setPlayers] = useState<NearbyUser[]>([]);
  const [view, setView] = useState<'map' | 'list'>('list');
  const [region, setRegion] = useState({
    latitude: 30.0444,
    longitude: 31.2357,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  });

  const loadNearby = useCallback(async () => {
    try {
      const granted = await requestLocationPermission();
      let center = currentLocation;
      if (granted && !center) {
        center = await getCurrentLocation();
      }
      if (center) {
        setRegion(r => ({ ...r, latitude: center!.latitude, longitude: center!.longitude }));
      }
      const users = await getNearbyUsers(DEFAULT_RADIUS_KM);
      setPlayers(users);
    } catch {
      // handled via store error state
    }
  }, [currentLocation, getNearbyUsers]);

  useEffect(() => {
    loadNearby();
  }, [loadNearby]);

  return (
    <View style={styles.flex}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.count}>{players.length} players nearby</Text>
          <Text style={styles.radius}>within {DEFAULT_RADIUS_KM} km</Text>
        </View>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, view === 'list' && styles.toggleButtonActive]}
            onPress={() => setView('list')}>
            <Icon
              name="view-list"
              size={18}
              color={view === 'list' ? colors.primary : colors.textTertiary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, view === 'map' && styles.toggleButtonActive]}
            onPress={() => setView('map')}>
            <Icon
              name="map"
              size={18}
              color={view === 'map' ? colors.primary : colors.textTertiary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {view === 'map' ? (
        <View style={styles.flex}>
          <View style={styles.mapNote}>
            <Icon name="info-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.mapNoteText}>
              Exact player locations are private — switch to list view for distances
            </Text>
          </View>
          <MapView provider={PROVIDER_DEFAULT} style={styles.map} region={region}>
            {currentLocation && (
              <Marker coordinate={currentLocation} title="You" pinColor={colors.primary} />
            )}
          </MapView>
        </View>
      ) : isLoading && players.length === 0 ? (
        <LoadingSpinner message="Finding players nearby..." />
      ) : (
        <FlatList
          data={players}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={loadNearby} />
          }
          renderItem={({ item }) => (
            <UserCard
              user={item}
              onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="explore-off"
              title="No players nearby"
              subtitle="Try widening your search or check back later."
            />
          }
        />
      )}

      <View style={styles.fabWrap}>
        <Button
          title={isAvailable ? "You're available" : 'Go available'}
          onPress={() => navigation.navigate('SetAvailability')}
          variant={isAvailable ? 'secondary' : 'primary'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  count: { ...typography.h3, color: colors.textPrimary },
  radius: { ...typography.caption, color: colors.textSecondary },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.borderLight,
    borderRadius: radius.md,
    padding: 3,
  },
  toggleButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  toggleButtonActive: {
    backgroundColor: colors.surface,
    ...shadow.sm,
  },
  map: { flex: 1 },
  mapNote: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  mapNoteText: {
    ...typography.small,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
    flexGrow: 1,
  },
  fabWrap: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
  },
});
