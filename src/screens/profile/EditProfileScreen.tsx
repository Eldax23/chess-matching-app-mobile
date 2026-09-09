import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/services/api';
import { Button, Input } from '@/components';
import { colors, spacing } from '@/theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ navigation }: Props) {
  const { user, updateUser } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [fideRating, setFideRating] = useState(user?.fideRating?.toString() || '');
  const [chessComUsername, setChessComUsername] = useState(user?.chessCom?.username || '');
  const [lichessUsername, setLichessUsername] = useState(user?.lichess?.username || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await apiClient.updateProfile({
        fullName: fullName.trim() || undefined,
        bio: bio.trim() || undefined,
        fideRating: fideRating ? parseInt(fideRating, 10) : undefined,
        chessComUsername: chessComUsername.trim() || undefined,
        lichessUsername: lichessUsername.trim() || undefined,
      });
      updateUser(updated);
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Input label="Full name" value={fullName} onChangeText={setFullName} autoCapitalize="words" />
      <Input
        label="Bio"
        value={bio}
        onChangeText={setBio}
        multiline
        style={styles.bioInput}
        placeholder="Tell other players about yourself"
      />
      <Input
        label="FIDE rating"
        value={fideRating}
        onChangeText={setFideRating}
        keyboardType="number-pad"
      />
      <Input
        label="Chess.com username"
        value={chessComUsername}
        onChangeText={setChessComUsername}
      />
      <Input label="Lichess username" value={lichessUsername} onChangeText={setLichessUsername} />

      <View style={styles.footer}>
        <Button title="Save Changes" onPress={handleSave} loading={saving} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xl },
  bioInput: { minHeight: 70, textAlignVertical: 'top' },
  footer: { marginTop: spacing.md },
});
