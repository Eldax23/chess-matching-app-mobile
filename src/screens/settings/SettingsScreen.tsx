import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SettingsStackParamList } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components';
import { colors, spacing, typography } from '@/theme';

type Props = NativeStackScreenProps<SettingsStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const items: { icon: string; label: string; onPress: () => void; danger?: boolean }[] = [
    {
      icon: 'block',
      label: 'Blocked players',
      onPress: () => navigation.navigate('BlockList'),
    },
    {
      icon: 'info-outline',
      label: 'About',
      onPress: () => navigation.navigate('About'),
    },
    {
      icon: 'logout',
      label: 'Log out',
      onPress: handleLogout,
      danger: true,
    },
  ];

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Card padded={false}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.row, index < items.length - 1 && styles.rowBorder]}
            onPress={item.onPress}>
            <Icon
              name={item.icon}
              size={20}
              color={item.danger ? colors.danger : colors.textPrimary}
            />
            <Text style={[styles.rowLabel, item.danger && styles.rowLabelDanger]}>
              {item.label}
            </Text>
            <Icon name="chevron-right" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rowLabel: { ...typography.body, color: colors.textPrimary, flex: 1, marginLeft: spacing.md },
  rowLabelDanger: { color: colors.danger },
});
