import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLogiTrack, Shipment } from '../../store/logitrack-store';
import { IconSymbol } from '../../components/ui/icon-symbol';

export default function HomeScreen() {
  const router = useRouter();
  const { activeRole, shipments, riderStats, toggleOnline, updateShipmentStatus } = useLogiTrack();

  const [searchId, setSearchId] = useState('');

  const handleSearch = () => {
    if (!searchId.trim()) return;
    const formattedId = searchId.trim().toUpperCase();
    const found = shipments.find((s) => s.id === formattedId);
    if (found) {
      router.push(`/shipment/${found.id}` as any);
      setSearchId('');
    } else {
      alert(`Logistics route '${formattedId}' not found in active registries.`);
    }
  };

  // Customer statistics
  const activeCustomerShipments = shipments.filter((s) => s.status !== 'delivered');
  const completedCustomerShipments = shipments.filter((s) => s.status === 'delivered');

  // Rider: Find active assigned shipment
  const activeRiderShipment = shipments.find(
    (s) => s.driverId === 'DRV-101' && (s.status === 'picked_up' || s.status === 'in_transit')
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* Header Bar */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerSubtitle}>
            {activeRole === 'customer' ? 'CLIENT COMMAND PANEL' : 'COURIER TERMINAL'}
          </Text>
          <Text style={styles.headerTitle}>
            {activeRole === 'customer' ? 'LOGITRACK CENTER' : 'OPERATOR SHIFT'}
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={[styles.badgeText, styles.monoText]}>
            {activeRole === 'customer' ? 'LEVEL-01' : 'DRV-101'}
          </Text>
        </View>
      </View>

      {/* Customer Mode View */}
      {activeRole === 'customer' && (
        <View style={styles.roleContainer}>
          {/* Tracking Search Input */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>FAST TRACK LOGISTICS ROUTE</Text>
            <View style={styles.searchRow}>
              <TextInput
                style={[styles.searchInput, styles.monoText]}
                value={searchId}
                onChangeText={setSearchId}
                placeholder="ENTER ID (E.G. LT-1029)"
                placeholderTextColor="#71717A"
                autoCapitalize="characters"
                onSubmitEditing={handleSearch}
              />
              <Pressable style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.searchButtonText}>LOCATE</Text>
              </Pressable>
            </View>
          </View>

          {/* Quick Actions & Metrics */}
          <View style={styles.statsRow}>
            <View style={[styles.statItem, { backgroundColor: '#27272A' }]}>
              <Text style={styles.statLabel}>IN-ROUTE CARGO</Text>
              <Text style={[styles.statValue, styles.monoText]}>
                {activeCustomerShipments.length}
              </Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: '#27272A' }]}>
              <Text style={styles.statLabel}>COMPLETED RUNS</Text>
              <Text style={[styles.statValue, styles.monoText, { color: '#10B981' }]}>
                {completedCustomerShipments.length}
              </Text>
            </View>
          </View>

          {/* Book Cargo CTA */}
          <Pressable
            style={styles.bookCtaButton}
            onPress={() => router.push('/book-shipment' as any)}
          >
            <IconSymbol name="plus.circle.fill" size={20} color="#18181B" />
            <Text style={styles.bookCtaText}>SCHEDULE NEW CARGO DELIVERY</Text>
          </Pressable>

          {/* Visual Tracking Map Widget */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeader}>REAL-TIME SECTOR MAP</Text>
              <View style={styles.liveIndicatorRow}>
                <View style={styles.pulseDot} />
                <Text style={styles.liveText}>GPS FEEDS ACTIVE</Text>
              </View>
            </View>

            {/* Tactical Grid Map Mockup */}
            <View style={styles.mapMock}>
              <View style={styles.mapGridLineH} />
              <View style={[styles.mapGridLineH, { top: '33%' }]} />
              <View style={[styles.mapGridLineH, { top: '66%' }]} />
              <View style={styles.mapGridLineV} />
              <View style={[styles.mapGridLineV, { left: '33%' }]} />
              <View style={[styles.mapGridLineV, { left: '66%' }]} />

              {/* Sender Node */}
              <View style={[styles.mapPin, { top: '70%', left: '25%' }]}>
                <View style={styles.mapPinInner} />
                <Text style={styles.mapPinLabel}>SND (SF)</Text>
              </View>

              {/* Transit Path Line */}
              <View style={styles.mapPathLine} />

              {/* Driver Courier Pin */}
              <View style={[styles.mapPin, { top: '42%', left: '52%', borderColor: '#CCFF00' }]}>
                <View style={[styles.mapPinInner, { backgroundColor: '#CCFF00' }]} />
                <Text style={[styles.mapPinLabel, { color: '#CCFF00' }]}>COURIER</Text>
              </View>

              {/* Recipient Node */}
              <View style={[styles.mapPin, { top: '20%', left: '75%', borderColor: '#60A5FA' }]}>
                <View style={[styles.mapPinInner, { backgroundColor: '#60A5FA' }]} />
                <Text style={[styles.mapPinLabel, { color: '#60A5FA' }]}>REC (SJ)</Text>
              </View>
            </View>
            <Text style={styles.mapCaption}>
              Coordinates: 37.7749° N, 122.4194° W — Terminal status nominal.
            </Text>
          </View>

          {/* Active Shipments Carousel/List */}
          <Text style={styles.sectionTitle}>ACTIVE CONSIGNMENTS</Text>
          {activeCustomerShipments.length > 0 ? (
            activeCustomerShipments.slice(0, 2).map((item) => (
              <Pressable
                key={item.id}
                style={styles.shipmentCard}
                onPress={() => router.push(`/shipment/${item.id}` as any)}
              >
                <View style={styles.shipmentHeader}>
                  <Text style={[styles.shipmentId, styles.monoText]}>{item.id}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      item.status === 'pending' && styles.statusPending,
                      item.status === 'picked_up' && styles.statusPicked,
                      item.status === 'in_transit' && styles.statusTransit,
                      item.status === 'delivered' && styles.statusDelivered,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        item.status === 'pending' && styles.statusTextPending,
                        item.status === 'picked_up' && styles.statusTextPicked,
                        item.status === 'in_transit' && styles.statusTextTransit,
                        item.status === 'delivered' && styles.statusTextDelivered,
                      ]}
                    >
                      {item.status.toUpperCase().replace('_', ' ')}
                    </Text>
                  </View>
                </View>

                {item.delayReason && (
                  <View style={styles.delayBanner}>
                    <IconSymbol name="exclamationmark.triangle.fill" size={14} color="#EAB308" />
                    <Text style={styles.delayText}>DELAY REPORTED: {item.delayReason}</Text>
                  </View>
                )}

                <View style={styles.shipmentDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>DESTINATION</Text>
                    <Text style={styles.detailValue} numberOfLines={1}>
                      {item.recipientAddress}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>CARGO TYPE</Text>
                    <Text style={styles.detailValue}>
                      {item.packageCategory} ({item.weight} kg)
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No active cargo routes currently operating.</Text>
            </View>
          )}
        </View>
      )}

      {/* Driver/Rider Mode View */}
      {activeRole === 'rider' && (
        <View style={styles.roleContainer}>
          {/* Duty Control Card */}
          <View style={styles.card}>
            <View style={styles.dutyRow}>
              <View>
                <Text style={styles.cardHeader}>COURIER DUTY STATUS</Text>
                <Text style={[styles.dutyStatusText, { color: riderStats.isOnline ? '#10B981' : '#71717A' }]}>
                  {riderStats.isOnline ? 'ONLINE — ACCEPTING DISPATCHES' : 'OFFLINE — SHIFT CLOSED'}
                </Text>
              </View>
              <Pressable
                style={[
                  styles.toggleSwitch,
                  riderStats.isOnline ? styles.toggleSwitchOn : styles.toggleSwitchOff,
                ]}
                onPress={toggleOnline}
              >
                <View
                  style={[
                    styles.toggleKnob,
                    riderStats.isOnline ? styles.toggleKnobOn : styles.toggleKnobOff,
                  ]}
                />
              </Pressable>
            </View>
          </View>

          {/* Earnings / Stats Widgets */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>SHIFT EARNINGS</Text>
              <Text style={[styles.statBoxValue, styles.monoText, { color: '#CCFF00' }]}>
                ${riderStats.earnings.toFixed(2)}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>TRIPS</Text>
              <Text style={[styles.statBoxValue, styles.monoText]}>{riderStats.completedTasks}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>DUTY HOURS</Text>
              <Text style={[styles.statBoxValue, styles.monoText]}>{riderStats.hoursOnline}h</Text>
            </View>
          </View>

          {/* Active Rider Task */}
          <Text style={styles.sectionTitle}>ACTIVE LOGISTICS ASSIGNMENT</Text>
          {activeRiderShipment ? (
            <View style={styles.riderActiveCard}>
              <View style={styles.riderActiveHeader}>
                <View>
                  <Text style={styles.riderActiveSub}>ACTIVE ROUTE</Text>
                  <Text style={[styles.riderActiveId, styles.monoText]}>{activeRiderShipment.id}</Text>
                </View>
                <Pressable
                  style={styles.detailsIconBtn}
                  onPress={() => router.push(`/shipment/${activeRiderShipment.id}` as any)}
                >
                  <IconSymbol name="info.circle.fill" size={20} color="#CCFF00" />
                </Pressable>
              </View>

              {activeRiderShipment.delayReason && (
                <View style={[styles.delayBanner, { backgroundColor: '#EAB3081A', borderColor: '#EAB30833' }]}>
                  <IconSymbol name="exclamationmark.triangle.fill" size={14} color="#EAB308" />
                  <Text style={[styles.delayText, { color: '#EAB308' }]}>
                    ACTIVE DELAY: {activeRiderShipment.delayReason}
                  </Text>
                </View>
              )}

              <View style={styles.riderAddresses}>
                <View style={styles.addressLine}>
                  <View style={[styles.addressIndicator, { backgroundColor: '#CCFF00' }]} />
                  <View style={styles.addressDetails}>
                    <Text style={styles.addressRoleLabel}>ORIGIN PICKUP</Text>
                    <Text style={styles.addressText}>{activeRiderShipment.senderAddress}</Text>
                  </View>
                </View>
                <View style={styles.addressLine}>
                  <View style={[styles.addressIndicator, { backgroundColor: '#60A5FA' }]} />
                  <View style={styles.addressDetails}>
                    <Text style={styles.addressRoleLabel}>DESTINATION DROP</Text>
                    <Text style={styles.addressText}>{activeRiderShipment.recipientAddress}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.dividerLine} />

              <View style={styles.riderTaskCargoRow}>
                <View>
                  <Text style={styles.cargoLabel}>CARGO CATEGORY</Text>
                  <Text style={styles.cargoValue}>{activeRiderShipment.packageCategory}</Text>
                </View>
                <View>
                  <Text style={styles.cargoLabel}>TALLY WEIGHT</Text>
                  <Text style={[styles.cargoValue, styles.monoText]}>{activeRiderShipment.weight} KG</Text>
                </View>
              </View>

              {/* Context Actions */}
              {activeRiderShipment.status === 'picked_up' ? (
                <Pressable
                  style={styles.actionCtaButton}
                  onPress={() =>
                    updateShipmentStatus(
                      activeRiderShipment.id,
                      'in_transit',
                      'Departed distribution depot en route.'
                    )
                  }
                >
                  <IconSymbol name="car.fill" size={18} color="#18181B" />
                  <Text style={styles.actionCtaButtonText}>DEPART ON ROUTE (IN TRANSIT)</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={[styles.actionCtaButton, { backgroundColor: '#10B981' }]}
                  onPress={() =>
                    updateShipmentStatus(
                      activeRiderShipment.id,
                      'delivered',
                      'Package handed over and signature confirmed.'
                    )
                  }
                >
                  <IconSymbol name="checkmark.circle.fill" size={18} color="#18181B" />
                  <Text style={styles.actionCtaButtonText}>CONFIRM CARGO HANDOVER</Text>
                </Pressable>
              )}
            </View>
          ) : (
            <View style={styles.emptyRiderCard}>
              <Text style={styles.emptyRiderTitle}>NO ACTIVE TRANSIT ROUTE</Text>
              <Text style={styles.emptyRiderSub}>
                Set duty to ONLINE and accept cargo routes from the Logistics Board.
              </Text>
              <Pressable
                style={styles.gotoBoardBtn}
                onPress={() => router.push('/shipments' as any)}
              >
                <Text style={styles.gotoBoardBtnText}>VIEW LOGISTICS BOARD</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FAFAFA',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#71717A',
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  badge: {
    backgroundColor: '#27272A',
    borderWidth: 1,
    borderColor: '#3F3F46',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  badgeText: {
    color: '#CCFF00',
    fontSize: 11,
    fontWeight: '900',
  },
  roleContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#27272A',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 8,
    borderCurve: 'continuous',
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: '900',
    color: '#CCFF00',
    letterSpacing: 1.5,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 6,
    borderCurve: 'continuous',
    color: '#FAFAFA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '700',
  },
  searchButton: {
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderCurve: 'continuous',
  },
  searchButtonText: {
    color: '#18181B',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 8,
    borderCurve: 'continuous',
    padding: 16,
    gap: 6,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#71717A',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FAFAFA',
  },
  bookCtaButton: {
    backgroundColor: '#CCFF00',
    paddingVertical: 14,
    borderRadius: 8,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  bookCtaText: {
    color: '#18181B',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  liveText: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  mapMock: {
    height: 180,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 6,
    borderCurve: 'continuous',
    position: 'relative',
    overflow: 'hidden',
  },
  mapGridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: '#3F3F4640',
  },
  mapGridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 0.5,
    backgroundColor: '#3F3F4640',
  },
  mapPin: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#71717A',
    backgroundColor: '#18181B',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  mapPinInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#71717A',
  },
  mapPinLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#71717A',
  },
  mapPathLine: {
    position: 'absolute',
    top: '32%',
    left: '30%',
    width: '42%',
    height: 38,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CCFF00',
  },
  mapCaption: {
    fontSize: 10,
    color: '#71717A',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FAFAFA',
    letterSpacing: 1.5,
    marginTop: 8,
  },
  shipmentCard: {
    backgroundColor: '#27272A',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 8,
    borderCurve: 'continuous',
    padding: 16,
    gap: 12,
  },
  shipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shipmentId: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FAFAFA',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusPending: { backgroundColor: '#71717A1F' },
  statusPicked: { backgroundColor: '#3B82F61F' },
  statusTransit: { backgroundColor: '#F59E0B1F' },
  statusDelivered: { backgroundColor: '#10B9811F' },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statusTextPending: { color: '#A1A1AA' },
  statusTextPicked: { color: '#60A5FA' },
  statusTextTransit: { color: '#FBBF24' },
  statusTextDelivered: { color: '#10B981' },
  delayBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EF44441F',
    borderWidth: 1,
    borderColor: '#EF444433',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  delayText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  shipmentDetails: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#71717A',
  },
  detailValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FAFAFA',
    maxWidth: '70%',
  },
  emptyCard: {
    backgroundColor: '#1E1E20',
    borderWidth: 1,
    borderColor: '#2D2D30',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  dutyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dutyStatusText: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },
  toggleSwitch: {
    width: 54,
    height: 30,
    borderRadius: 15,
    padding: 3,
    justifyContent: 'center',
  },
  toggleSwitchOn: {
    backgroundColor: '#CCFF00',
  },
  toggleSwitchOff: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  toggleKnobOn: {
    backgroundColor: '#18181B',
    alignSelf: 'flex-end',
  },
  toggleKnobOff: {
    backgroundColor: '#71717A',
    alignSelf: 'flex-start',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#27272A',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 8,
    borderCurve: 'continuous',
    padding: 12,
    gap: 4,
  },
  statBoxLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#71717A',
  },
  statBoxValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FAFAFA',
  },
  riderActiveCard: {
    backgroundColor: '#27272A',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 8,
    borderCurve: 'continuous',
    padding: 16,
    gap: 12,
  },
  riderActiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riderActiveSub: {
    fontSize: 9,
    fontWeight: '800',
    color: '#CCFF00',
    letterSpacing: 0.5,
  },
  riderActiveId: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FAFAFA',
  },
  detailsIconBtn: {
    padding: 6,
    backgroundColor: '#18181B',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  riderAddresses: {
    gap: 12,
    backgroundColor: '#18181B',
    padding: 12,
    borderRadius: 6,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  addressLine: {
    flexDirection: 'row',
    gap: 10,
  },
  addressIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  addressDetails: {
    flex: 1,
    gap: 2,
  },
  addressRoleLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#71717A',
  },
  addressText: {
    fontSize: 12,
    color: '#FAFAFA',
    fontWeight: '600',
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#3F3F46',
  },
  riderTaskCargoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cargoLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#71717A',
  },
  cargoValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FAFAFA',
    marginTop: 2,
  },
  actionCtaButton: {
    backgroundColor: '#CCFF00',
    paddingVertical: 12,
    borderRadius: 6,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionCtaButtonText: {
    color: '#18181B',
    fontWeight: '900',
    fontSize: 12,
  },
  emptyRiderCard: {
    backgroundColor: '#1E1E20',
    borderWidth: 1,
    borderColor: '#2D2D30',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyRiderTitle: {
    color: '#FAFAFA',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  emptyRiderSub: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 12,
  },
  gotoBoardBtn: {
    backgroundColor: '#27272A',
    borderWidth: 1,
    borderColor: '#3F3F46',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 8,
  },
  gotoBoardBtnText: {
    color: '#CCFF00',
    fontSize: 11,
    fontWeight: '800',
  },
  monoText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontVariant: ['tabular-nums'],
  },
});
