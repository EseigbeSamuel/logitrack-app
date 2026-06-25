import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform, Appearance, useColorScheme } from 'react-native';
import { useLogiTrack } from '@/store/logitrack-store';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { activeRole, riderStats, shipments, logout, deleteAccount } = useLogiTrack();
  const theme = useThemeColors();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const totalCustomerShipments = shipments.length;
  const totalCustomerSpent = shipments.reduce((sum, s) => sum + s.price, 0);

  const activeShipmentsCount = shipments.filter(
    (s) => s.status !== 'delivered'
  ).length;

  const toggleTheme = () => {
    Appearance.setColorScheme(isDarkMode ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    router.replace('/auth/sign-in' as any);
  };

  const handleDeleteAccount = () => {
    deleteAccount();
    router.replace('/auth/sign-up' as any);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>LOGITRACK TERMINAL</Text>
        <Text style={[styles.headerSubtitle, { color: theme.muted }]}>System Control & User Configuration</Text>
      </View>

      {/* Operator Metadata Card */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>OPERATOR PROFILE</Text>
        <View style={styles.profileRow}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={[styles.avatarText, { color: theme.primaryText }]}>MV</Text>
          </View>
          <View style={styles.profileDetails}>
            <Text style={[styles.profileName, { color: theme.text }]}>Marcus Vance</Text>
            <Text style={[styles.profileMeta, styles.monoText, { color: theme.muted }]}>ROLE: {activeRole.toUpperCase()}</Text>
            <Text style={[styles.profileMeta, { color: theme.muted }]}>HQ Center: San Francisco Logistics</Text>
          </View>
        </View>
      </View>

      {/* Role-Specific Stats Dashboard */}
      {activeRole === 'customer' ? (
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>CUSTOMER OVERVIEW</Text>
          
          <View style={styles.statsGrid}>
            <View style={[styles.statBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.statLabel, { color: theme.muted }]}>TOTAL BOOKINGS</Text>
              <Text style={[styles.statValue, styles.monoText, { color: theme.text }]}>{totalCustomerShipments}</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.statLabel, { color: theme.muted }]}>ACTIVE RUNS</Text>
              <Text style={[styles.statValue, styles.monoText, { color: theme.info }]}>
                {activeShipmentsCount}
              </Text>
            </View>
          </View>

          <View style={[styles.statBox, { marginTop: 12, width: '100%', backgroundColor: theme.background, borderColor: theme.border }]}>
            <Text style={[styles.statLabel, { color: theme.muted }]}>LOGISTICS ACCUMULATED SPEND</Text>
            <Text style={[styles.statValue, styles.monoText, { color: theme.primary }]}>
              ${totalCustomerSpent.toFixed(2)}
            </Text>
          </View>
        </View>
      ) : (
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>RIDER PERFORMANCE</Text>

          <View style={styles.statsGrid}>
            <View style={[styles.statBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.statLabel, { color: theme.muted }]}>DUTY STATUS</Text>
              <View style={styles.statusIndicatorWrapper}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: riderStats.isOnline ? theme.success : theme.muted },
                  ]}
                />
                <Text
                  style={[
                    styles.statValue,
                    { fontSize: 16, color: riderStats.isOnline ? theme.success : theme.muted },
                  ]}
                >
                  {riderStats.isOnline ? 'ONLINE' : 'OFFLINE'}
                </Text>
              </View>
            </View>
            <View style={[styles.statBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.statLabel, { color: theme.muted }]}>TRIPS COMPLETED</Text>
              <Text style={[styles.statValue, styles.monoText, { color: theme.text }]}>{riderStats.completedTasks}</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={[styles.statBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.statLabel, { color: theme.muted }]}>HOURS LOGGED</Text>
              <Text style={[styles.statValue, styles.monoText, { color: theme.text }]}>{riderStats.hoursOnline}h</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.statLabel, { color: theme.muted }]}>TOTAL EARNINGS</Text>
              <Text style={[styles.statValue, styles.monoText, { color: theme.primary }]}>
                ${riderStats.earnings.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Theme Controls */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>APPEARANCE</Text>
        <Text style={[styles.cardHelper, { color: theme.muted }]}>
          Toggle the interface appearance between active Dark Mode and Light Mode configurations.
        </Text>
        <Pressable 
          style={[styles.themeButton, { backgroundColor: theme.background, borderColor: theme.border }]} 
          onPress={toggleTheme}
        >
          <IconSymbol name={isDarkMode ? 'checkmark.circle.fill' : 'circle'} size={18} color={theme.text} />
          <Text style={[styles.themeButtonText, { color: theme.text }]}>
            {isDarkMode ? 'DARK MODE ENABLED' : 'SWITCH TO DARK MODE'}
          </Text>
        </Pressable>
      </View>

      {/* Auth Controls */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>SESSION CONTROLS</Text>
        <Pressable 
          style={[styles.themeButton, { backgroundColor: theme.background, borderColor: theme.border, marginBottom: 8 }]} 
          onPress={handleLogout}
        >
          <Text style={[styles.themeButtonText, { color: theme.text }]}>LOG OUT OF TERMINAL</Text>
        </Pressable>
        <Pressable 
          style={[styles.resetButton, { backgroundColor: theme.dangerBg, borderColor: theme.danger }]} 
          onPress={handleDeleteAccount}
        >
          <Text style={[styles.resetButtonText, { color: theme.danger }]}>DELETE ACCOUNT DATA</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    paddingTop: Platform.OS === 'ios' ? 64 : 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  card: {
    borderWidth: 1,
    borderRadius: 8,
    borderCurve: 'continuous',
    padding: 16,
    gap: 12,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  cardHelper: {
    fontSize: 12,
    lineHeight: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    borderCurve: 'continuous',
    padding: 12,
    gap: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  monoText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontVariant: ['tabular-nums'],
  },
  statusIndicatorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontWeight: '900',
    fontSize: 18,
  },
  profileDetails: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
  },
  profileMeta: {
    fontSize: 11,
    fontWeight: '600',
  },
  themeButton: {
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderCurve: 'continuous',
    flexDirection: 'row',
    gap: 8,
  },
  themeButtonText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  resetButton: {
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderCurve: 'continuous',
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
