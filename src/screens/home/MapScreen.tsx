import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_DEFAULT } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, NearbyUser } from '@/types';
import { useLocationStore } from '@/store/locationStore';
import {
  AppHeader,
  UserCard,
  EmptyState,
  LoadingSpinner,
  SegmentedControl,
  Chip,
} from '@/components';
import { colors, spacing, typography, radius } from '@/theme';
import { getCurrentLocation, requestLocationPermission, formatDistance } from '@/utils/geolocation';

type Props = NativeStackScreenProps<HomeStackParamList, 'Map'>;

type Filter = 'all' | 'board' | 'rated';
type View_ = 'list' | 'radar';

const RADIUS_OPTIONS = [1, 2, 5, 10];

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'board', label: 'Has board' },
  { value: 'rated', label: 'Rated' },
];

// Alternate card accents like the design (green, cyan, green, ...)
const ACCENTS = [colors.primary, colors.secondary];

export default function MapScreen({ navigation }: Props) {
  const { isAvailable, currentLocation, getNearbyUsers, isLoading, searchRadiusKm, setSearchRadius } =
    useLocationStore();
  const [players, setPlayers] = useState<NearbyUser[]>([]);
  const [view, setView] = useState<View_>('list');
  const [filter, setFilter] = useState<Filter>('all');
  const [center, setCenter] = useState({ latitude: 30.0444, longitude: 31.2357 });

  const loadNearby = useCallback(async () => {
    try {
      const granted = await requestLocationPermission();
      let here = currentLocation;
      if (granted && !here) {
        here = await getCurrentLocation();
      }
      if (here) {
        setCenter({ latitude: here.latitude, longitude: here.longitude });
      }
      const users = await getNearbyUsers(searchRadiusKm);
      setPlayers(users);
    } catch {
      // handled via store error state
    }
  }, [currentLocation, getNearbyUsers, searchRadiusKm]);

  useEffect(() => {
    loadNearby();
  }, [loadNearby]);

  const sorted = useMemo(
    () => [...players].sort((a, b) => a.distanceKm - b.distanceKm),
    [players],
  );

  const visible = useMemo(() => {
    if (filter === 'board') return sorted.filter(p => p.hasBoard);
    if (filter === 'rated') return sorted.filter(p => p.fideRating || p.chessComRating || p.lichessRating);
    return sorted;
  }, [sorted, filter]);

  const cycleRadius = () => {
    const i = RADIUS_OPTIONS.indexOf(searchRadiusKm);
    setSearchRadius(RADIUS_OPTIONS[(i + 1) % RADIUS_OPTIONS.length]);
  };

  const controls = (
    <View>
      <View style={styles.locationRow}>
        <TouchableOpacity style={styles.locationPill} onPress={cycleRadius} activeOpacity={0.8}>
          <Icon name="map-marker-outline" size={18} color={colors.primary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {currentLocation?.address || 'Your area'}
          </Text>
          <Text style={styles.locationRadius}>• {searchRadiusKm}km</Text>
          <Icon name="chevron-down" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.activePill}>
          <View style={styles.activeDot} />
          <Text style={styles.activeText}>{players.length} active</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        <SegmentedControl
          options={[
            { value: 'list', label: 'List', icon: 'format-list-bulleted' },
            { value: 'radar', label: 'Radar', icon: 'radar' },
          ]}
          value={view}
          onChange={setView}
          style={styles.viewToggle}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          {FILTERS.map(f => (
            <Chip
              key={f.value}
              label={f.label}
              active={filter === f.value}
              onPress={() => setFilter(f.value)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );

  const hero = (
    <ScanCard
      players={sorted}
      isAvailable={isAvailable}
      onPress={() => navigation.navigate('SetAvailability')}
    />
  );

  return (
    <View style={styles.flex}>
      <AppHeader subtitle="Radar" />

      {view === 'radar' ? (
        <View style={styles.flex}>
          <View style={styles.padded}>{controls}</View>
          <View style={styles.mapWrap}>
            <MapView
              provider={PROVIDER_DEFAULT}
              style={styles.map}
              customMapStyle={DARK_MAP_STYLE}
              region={{
                ...center,
                latitudeDelta: (searchRadiusKm * 2.6) / 111,
                longitudeDelta: (searchRadiusKm * 2.6) / 111,
              }}>
              <Circle
                center={center}
                radius={searchRadiusKm * 1000}
                strokeColor={colors.primary}
                fillColor="rgba(31, 242, 138, 0.08)"
                strokeWidth={1.5}
              />
              {currentLocation && (
                <Marker coordinate={currentLocation} title="You" pinColor={colors.primary} />
              )}
            </MapView>
            <View style={styles.mapNote}>
              <Icon name="shield-lock-outline" size={14} color={colors.secondary} />
              <Text style={styles.mapNoteText}>
                Exact player locations stay private — use List for distances
              </Text>
            </View>
          </View>
        </View>
      ) : isLoading && players.length === 0 ? (
        <>
          <View style={styles.padded}>{controls}</View>
          <LoadingSpinner message="Scanning for players..." />
        </>
      ) : (
        <FlatList
          data={visible}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={loadNearby}
              tintColor={colors.primary}
              colors={[colors.primary]}
              progressBackgroundColor={colors.surface}
            />
          }
          ListHeaderComponent={
            <>
              {controls}
              {hero}
              <View style={styles.listTitleRow}>
                <Text style={styles.listTitle}>Active Challengers Nearby</Text>
                <Text style={styles.listSort}>Sorted by distance</Text>
              </View>
            </>
          }
          renderItem={({ item, index }) => (
            <UserCard
              user={item}
              accent={ACCENTS[index % ACCENTS.length]}
              onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
              onChallenge={() => navigation.navigate('UserProfile', { userId: item.id })}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="explore-off"
              title="No challengers in range"
              subtitle="Widen your radius or drop a beacon so players can find you."
            />
          }
        />
      )}
    </View>
  );
}

function ScanCard({
  players,
  isAvailable,
  onPress,
}: {
  players: NearbyUser[];
  isAvailable: boolean;
  onPress: () => void;
}) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 2200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const withBoard = players.filter(p => p.hasBoard).length;
  const avgKm = players.length
    ? players.reduce((sum, p) => sum + p.distanceKm, 0) / players.length
    : 0;

  const title =
    players.length === 0
      ? 'Quiet Sector'
      : players.length >= 5
      ? 'Boards Are Packed'
      : `${players.length} Player${players.length === 1 ? '' : 's'} Nearby`;

  return (
    <TouchableOpacity style={styles.scan} activeOpacity={0.85} onPress={onPress}>
      {/* Radar rings */}
      <View style={styles.rings} pointerEvents="none">
        {[150, 110, 70].map(size => (
          <View
            key={size}
            style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]}
          />
        ))}
        <Animated.View
          style={[
            styles.pulse,
            {
              opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
              transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.3, 2.2] }) }],
            },
          ]}
        />
      </View>

      <View style={styles.scanLabelRow}>
        <Icon name="access-point" size={14} color={colors.primary} />
        <Text style={styles.scanLabel}>Live signal scan</Text>
      </View>

      <View style={styles.scanBody}>
        <View style={styles.flexFill}>
          <Text style={styles.scanTitle}>{title}</Text>
          <Text style={styles.scanSub} numberOfLines={2}>
            {players.length === 0
              ? 'No one is broadcasting in range yet.'
              : `Closest ${formatDistance(players[0].distanceKm)} • ${withBoard} with boards`}
          </Text>
        </View>
        {players.length > 0 && (
          <View style={styles.scanStat}>
            <Text style={styles.scanStatValue}>{formatDistance(avgKm)}</Text>
            <Text style={styles.scanStatLabel}>Avg distance</Text>
          </View>
        )}
      </View>

      {!isAvailable && (
        <View style={styles.beaconCta}>
          <Icon name="broadcast" size={16} color={colors.textInverse} />
          <Text style={styles.beaconCtaText}>Drop your beacon</Text>
          <Icon name="arrow-right" size={16} color={colors.textInverse} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#12181f' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6b7785' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0e13' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#161d25' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#10261b' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1f2830' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#27323d' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0b1a24' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  flexFill: { flex: 1 },
  padded: { paddingHorizontal: spacing.md },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm + 4,
  },
  locationPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginRight: spacing.sm,
  },
  locationText: {
    ...typography.bodyBold,
    fontWeight: '800',
    color: colors.textPrimary,
    marginLeft: 6,
    flexShrink: 1,
  },
  locationRadius: {
    ...typography.caption,
    color: colors.textSecondary,
    marginHorizontal: 6,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primary + '55',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  activeText: { ...typography.label, fontSize: 10, color: colors.primary },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  viewToggle: { width: 170, marginRight: spacing.sm },
  chips: { flexGrow: 0 },
  scan: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary + '33',
    padding: spacing.md,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  rings: {
    position: 'absolute',
    right: -20,
    top: -10,
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: colors.primary + '22',
  },
  pulse: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
  },
  scanLabelRow: { flexDirection: 'row', alignItems: 'center' },
  scanLabel: { ...typography.label, fontSize: 10, color: colors.primary, marginLeft: 6 },
  scanBody: { flexDirection: 'row', alignItems: 'flex-end', marginTop: spacing.xs },
  scanTitle: { ...typography.h2, fontWeight: '800', color: colors.textPrimary },
  scanSub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  scanStat: { alignItems: 'center', marginLeft: spacing.md },
  scanStatValue: {
    ...typography.label,
    fontSize: 22,
    letterSpacing: 0,
    textTransform: 'none',
    color: colors.primary,
  },
  scanStatLabel: { ...typography.small, color: colors.textSecondary },
  beaconCta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: spacing.md,
  },
  beaconCtaText: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.textInverse,
    marginHorizontal: 6,
  },
  listTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  listTitle: { ...typography.h3, fontWeight: '800', color: colors.textPrimary },
  listSort: { ...typography.small, color: colors.textSecondary },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  mapWrap: {
    flex: 1,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  map: { flex: 1 },
  mapNote: {
    position: 'absolute',
    left: spacing.sm,
    right: spacing.sm,
    bottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 14, 19, 0.88)',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  mapNoteText: {
    ...typography.small,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    flex: 1,
  },
});
