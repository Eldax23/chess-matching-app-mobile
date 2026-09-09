import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Card } from '@/components';
import { colors, spacing, typography } from '@/theme';

const APP_VERSION = '0.0.1';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>♟️</Text>
        <Text style={styles.appName}>Chess Matching</Text>
        <Text style={styles.version}>Version {APP_VERSION}</Text>
      </View>

      <Card style={styles.section}>
        <Text style={styles.paragraph}>
          Find nearby chess players, challenge them to over-the-board games, and track
          your results — all in one app.
        </Text>
      </Card>

      <Card padded={false}>
        <TouchableOpacity
          style={styles.link}
          onPress={() => Linking.openURL('https://github.com/MudatherZaki/chess-matching-app')}>
          <Icon name="code" size={20} color={colors.textPrimary} />
          <Text style={styles.linkText}>Backend source code</Text>
          <Icon name="open-in-new" size={16} color={colors.textTertiary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.link, styles.linkBorder]}
          onPress={() =>
            Linking.openURL('https://github.com/MudatherZaki/chess-matching-app-mobile')
          }>
          <Icon name="phone-iphone" size={20} color={colors.textPrimary} />
          <Text style={styles.linkText}>Mobile source code</Text>
          <Icon name="open-in-new" size={16} color={colors.textTertiary} />
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg },
  header: { alignItems: 'center', marginBottom: spacing.lg },
  logo: { fontSize: 40, marginBottom: spacing.sm },
  appName: { ...typography.h2, color: colors.textPrimary },
  version: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  section: { marginBottom: spacing.md },
  paragraph: { ...typography.body, color: colors.textPrimary, lineHeight: 22 },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  linkBorder: { borderTopWidth: 1, borderTopColor: colors.borderLight },
  linkText: { ...typography.body, color: colors.textPrimary, flex: 1, marginLeft: spacing.md },
});
