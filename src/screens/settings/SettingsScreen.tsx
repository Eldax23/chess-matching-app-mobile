import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SettingsStackParamList } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { AppHeader, Button, Card, IconTile, SectionHeader } from '@/components';
import { colors, spacing, typography } from '@/theme';

type Props = NativeStackScreenProps<SettingsStackParamList, 'Settings'>;

interface Row {
  icon: string;
  color: string;
  label: string;
  sub: string;
  onPress: () => void;
}

export default function SettingsScreen({ navigation }: Props) {
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const toProfile = (screen: 'EditProfile' | 'MatchHistory') =>
    navigation.getParent()?.navigate('ProfileStack', { screen, initial: false });

  const sections: { title: string; icon: string; color: string; rows: Row[] }[] = [
    {
      title: 'Account',
      icon: 'account-cog-outline',
      color: colors.primary,
      rows: [
        {
          icon: 'account-edit-outline',
          color: colors.primary,
          label: 'Edit profile',
          sub: 'Name, bio, board & linked ratings',
          onPress: () => toProfile('EditProfile'),
        },
        {
          icon: 'history',
          color: colors.warning,
          label: 'Match history',
          sub: 'Every over-the-board duel you recorded',
          onPress: () => toProfile('MatchHistory'),
        },
      ],
    },
    {
      title: 'Safety & Privacy',
      icon: 'shield-lock-outline',
      color: colors.secondary,
      rows: [
        {
          icon: 'account-cancel-outline',
          color: colors.danger,
          label: 'Blocked players',
          sub: 'Players who can’t see or challenge you',
          onPress: () => navigation.navigate('BlockList'),
        },
      ],
    },
    {
      title: 'App',
      icon: 'chess-knight',
      color: colors.warning,
      rows: [
        {
          icon: 'information-outline',
          color: colors.secondary,
          label: 'About',
          sub: 'Version, terms & credits',
          onPress: () => navigation.navigate('About'),
        },
      ],
    },
  ];

  return (
    <View style={styles.flex}>
      <AppHeader subtitle="Settings" />
      <ScrollView contentContainerStyle={styles.container}>
        {sections.map(section => (
          <View key={section.title} style={styles.section}>
            <SectionHeader title={section.title} icon={section.icon} color={section.color} />
            <Card padded={false}>
              {section.rows.map((row, index) => (
                <TouchableOpacity
                  key={row.label}
                  activeOpacity={0.8}
                  style={[styles.row, index < section.rows.length - 1 && styles.rowBorder]}
                  onPress={row.onPress}>
                  <IconTile icon={row.icon} color={row.color} size={40} />
                  <View style={styles.rowText}>
                    <Text style={styles.rowLabel}>{row.label}</Text>
                    <Text style={styles.rowSub}>{row.sub}</Text>
                  </View>
                  <Icon name="chevron-right" size={20} color={colors.textTertiary} />
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}

        <Button
          title="Log out"
          icon="logout"
          variant="dark"
          onPress={handleLogout}
          style={styles.logout}
        />
        {user && <Text style={styles.signedIn}>Signed in as {user.email}</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  section: { marginBottom: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rowText: { flex: 1, marginLeft: spacing.sm + 4 },
  rowLabel: { ...typography.bodyBold, fontWeight: '800', color: colors.textPrimary },
  rowSub: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  logout: { marginTop: spacing.sm },
  signedIn: {
    ...typography.small,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
