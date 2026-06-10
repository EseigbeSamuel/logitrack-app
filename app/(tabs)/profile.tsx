import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { useLogiTrack } from '../../store/logitrack-store';
import { Colors } from '../../constants/theme';
import { IconSymbol } from '../../components/ui/icon-symbol';

export default function ProfileScreen() {
  const { activeRole, switchRole, riderStats, shipments, resetStore } = useLogiTrack();

  const totalCustomerShipments = shipments.length;
  const totalCustomerSpent = shipments.reduce((sum, s) => sum + s.price, 0);

  const activeShipmentsCount = shipments.filter(
    (s) => s.status !== 'delivered'
  ).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LOGITRACK TERMINAL</Text>
        <Text style={styles.headerSubtitle}>System Control & User Configuration</Text>
      </View>

      {/* Role Switcher Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>ACTIVE USER INTERFACE</Text>
        <Text style={styles.cardHelper}>
          Toggle between roles to test workflows. Statuses and shipments sync in real-time.
        </Text>

        <View style={styles.segmentContainer}>
          <Pressable
            style={[
              styles.segmentButton,
              activeRole === 'customer' && styles.segmentButtonActive,
            ]}
            onPress={() => switchRole('customer')}
          >
            <IconSymbol
              name="person.fill"
              size={18}
              color={activeRole === 'customer' ? '#18181B' : '#71717A'}
            />
            <Text
              style={[
                styles.segmentText,
                activeRole === 'customer' && styles.segmentTextActive,
              ]}
            >
              CUSTOMER
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.segmentButton,
              activeRole === 'rider' && styles.segmentButtonActive,
            ]}
            onPress={() => switchRole('rider')}
          >
            <IconSymbol
              name="car.fill"
              size={18}
              color={activeRole === 'rider' ? '#18181B' : '#71717A'}
            />
            <Text
              style={[
                styles.segmentText,
                activeRole === 'rider' && styles.segmentTextActive,
              ]}
            >
              RIDER / DRIVER
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Role-Specific Stats Dashboard */}
      {activeRole === 'customer' ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>CUSTOMER OVERVIEW</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>TOTAL BOOKINGS</Text>
              <Text style={[styles.statValue, styles.monoText]}>{totalCustomerShipments}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>ACTIVE RUNS</Text>
              <Text style={[styles.statValue, styles.monoText, { color: '#60A5FA' }]}>
                {activeShipmentsCount}
              </Text>
            </View>
          </View>

          <View style={[styles.statBox, { marginTop: 12, width: '100%' }]}>
            <Text style={styles.statLabel}>LOGISTICS ACCUMULATED SPEND</Text>
            <Text style={[styles.statValue, styles.monoText, { color: '#CCFF00' }]}>
              ${totalCustomerSpent.toFixed(2)}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>RIDER PERFORMANCE</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>DUTY STATUS</Text>
              <View style={styles.statusIndicatorWrapper}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: riderStats.isOnline ? '#10B981' : '#71717A' },
                  ]}
                />
                <Text
                  style={[
                    styles.statValue,
                    { fontSize: 16, color: riderStats.isOnline ? '#10B981' : '#71717A' },
                  ]}
                >
                  {riderStats.isOnline ? 'ONLINE' : 'OFFLINE'}
                </Text>
              </View>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>TRIPS COMPLETED</Text>
              <Text style={[styles.statValue, styles.monoText]}>{riderStats.completedTasks}</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>HOURS LOGGED</Text>
              <Text style={[styles.statValue, styles.monoText]}>{riderStats.hoursOnline}h</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>TOTAL EARNINGS</Text>
              <Text style={[styles.statValue, styles.monoText, { color: '#CCFF00' }]}>
                ${riderStats.earnings.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Operator Metadata Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>OPERATOR PROFILE</Text>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MV</Text>
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>Marcus Vance</Text>
            <Text style={[styles.profileMeta, styles.monoText]}>ID: OP-984-X2</Text>
            <Text style={styles.profileMeta}>HQ Center: San Francisco Logistics</Text>
          </View>
        </View>
      </View>

      {/* Danger Zone / System Reset */}
      <View style={[styles.card, { borderColor: '#EF444433' }]}>
        <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>SYSTEM CONTROLS</Text>
        <Text style={styles.cardHelper}>
          Reset all mock shipments, driver logs, earnings, and configurations to original state.
        </Text>
        <Pressable style={styles.resetButton} onPress={resetStore}>
          <Text style={styles.resetButtonText}>RESET SIMULATOR DATABASE</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181B',
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
    color: '#FAFAFA',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#71717A',
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#27272A',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 8,
    borderCurve: 'continuous',
    padding: 16,
    gap: 12,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#CCFF00',
    letterSpacing: 1.5,
  },
  cardHelper: {
    fontSize: 12,
    color: '#71717A',
    lineHeight: 16,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#18181B',
    padding: 4,
    borderRadius: 8,
    borderCurve: 'continuous',
    gap: 4,
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
    borderCurve: 'continuous',
    gap: 6,
  },
  segmentButtonActive: {
    backgroundColor: '#CCFF00',
  },
  segmentText: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '800',
  },
  segmentTextActive: {
    color: '#18181B',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 6,
    borderCurve: 'continuous',
    padding: 12,
    gap: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#71717A',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FAFAFA',
  },
  monoText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
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
    backgroundColor: '#CCFF00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#18181B',
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
    color: '#FAFAFA',
  },
  profileMeta: {
    fontSize: 11,
    color: '#71717A',
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#EF44441F',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderCurve: 'continuous',
  },
  resetButtonText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
