import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HomeStackParamList } from '@/types';
import { useLocationStore } from '@/store/locationStore';
import { Button, Card } from '@/components';
import { colors, spacing, typography } from '@/theme';
import { getCurrentLocation, requestLocationPermission } from '@/utils/geolocation';

type Props = NativeStackScreenProps<HomeStackParamList, 'SetAvailability'>;

const DURATION_OPTIONS = [1, 2, 4, 8];

export default function SetAvailabilityScreen({ navigation }: Props) {
  const { isAvailable, currentLocation, setAvailability, setUnavailable, isLoading } =
    useLocationStore();
  const [hasBoard, setHasBoard] = useState(false);
  const [duration, setDuration] = useState(4);
  const [locating, setLocating] = useState(false);

  const handleToggle = async (value: boolean) => {
    if (!value) {
      try {
        await setUnavailable();
      } catch (e: any) {
        Alert.alert('Error', e?.message || 'Failed to update availability');
      }
      return;
    }

    setLocating(true);
    try {
      const granted = await requestLocationPermission();
      if (!granted) {
        Alert.alert('Location needed', 'Enable location access to become available.');
        return;
      }
      const location = await getCurrentLocation();
      await setAvailability(location, hasBoard, duration);
      Alert.alert('You\'re available!', 'Nearby players can now see and challenge you.');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Could not get your location');
    } finally {
      setLocating(false);
    }
  };

  const busy = isLoading || locating;

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Card style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusIconWrap,
              { backgroundColor: isAvailable ? colors.secondaryLight : colors.borderLight },
            ]}>
            <Icon
              name={isAvailable ? 'visibility' : 'visibility-off'}
              size={24}
              color={isAvailable ? colors.secondary : colors.textTertiary}
            />
          </View>
          <View style={styles.statusText}>
            <Text style={styles.statusTitle}>
              {isAvailable ? "You're available" : 'You\'re offline'}
            </Text>
            <Text style={styles.statusSubtitle}>
              {isAvailable
                ? 'Visible to nearby players'
                : 'Turn on to appear on the map'}
            </Text>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={handleToggle}
            disabled={busy}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={isAvailable ? colors.primary : '#f4f3f4'}
          />
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Before you go available</Text>

      <Card style={styles.optionCard}>
        <View style={styles.optionRow}>
          <View style={styles.optionInfo}>
            <Icon name="grid-on" size={20} color={colors.textPrimary} />
            <Text style={styles.optionLabel}>I have a board with me</Text>
          </View>
          <Switch
            value={hasBoard}
            onValueChange={setHasBoard}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={hasBoard ? colors.primary : '#f4f3f4'}
          />
        </View>
      </Card>

      <Text style={styles.label}>How long should you stay visible?</Text>
      <View style={styles.durationRow}>
        {DURATION_OPTIONS.map(hrs => (
          <Button
            key={hrs}
            title={`${hrs}h`}
            variant={duration === hrs ? 'primary' : 'outline'}
            size="sm"
            fullWidth={false}
            onPress={() => setDuration(hrs)}
            style={styles.durationButton}
          />
        ))}
      </View>

      {currentLocation && (
        <Card style={styles.locationCard}>
          <Icon name="place" size={18} color={colors.textSecondary} />
          <Text style={styles.locationText}>
            {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
          </Text>
        </Card>
      )}

      <View style={styles.footer}>
        <Button
          title={isAvailable ? 'Update & Refresh Location' : 'Go Available'}
          onPress={() => handleToggle(true)}
          loading={busy}
        />
        <Button
          title="Back to map"
          variant="ghost"
          onPress={() => navigation.navigate('Map')}
          style={styles.backButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg },
  statusCard: { marginBottom: spacing.lg },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: { flex: 1, marginLeft: spacing.md },
  statusTitle: { ...typography.bodyBold, color: colors.textPrimary },
  statusSubtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  optionCard: { marginBottom: spacing.lg },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionInfo: { flexDirection: 'row', alignItems: 'center' },
  optionLabel: { ...typography.body, color: colors.textPrimary, marginLeft: spacing.sm },
  label: { ...typography.bodyBold, color: colors.textPrimary, marginBottom: spacing.sm },
  durationRow: { flexDirection: 'row', marginBottom: spacing.lg },
  durationButton: { marginRight: spacing.sm, paddingHorizontal: spacing.lg },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  locationText: { ...typography.caption, color: colors.textSecondary, marginLeft: spacing.sm },
  footer: { marginTop: spacing.md },
  backButton: { marginTop: spacing.sm },
});
