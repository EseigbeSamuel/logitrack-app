import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLogiTrack, Shipment } from '../../store/logitrack-store';
import { Colors } from '../../constants/theme';
import { IconSymbol } from '../../components/ui/icon-symbol';

export default function ShipmentsScreen() {
  const router = useRouter();
  const { activeRole, shipments, acceptTask, riderStats } = useLogiTrack();

  // Sub-tabs for Riders: 'my_tasks' | 'available_tasks'
  const [riderSubTab, setRiderSubTab] = useState<'my_tasks' | 'available_tasks'>('my_tasks');

  // Customer filtering: Active vs Delivered
  const customerActive = shipments.filter((s) => s.status !== 'delivered');
  const customerHistory = shipments.filter((s) => s.status === 'delivered');

  // Rider filtering
  const riderTasks = shipments.filter((s) => s.driverId === 'DRV-101');
  const availableTasks = shipments.filter((s) => s.driverId === null && s.status === 'pending');

  const renderShipmentCard = (item: Shipment) => {
    return (
      <Pressable
        key={item.id}
        style={styles.shipmentCard}
        onPress={() => router.push(`/shipment/${item.id}` as any)}
      >
        <View style={styles.shipmentHeader}>
          <View>
            <Text style={[styles.shipmentId, styles.monoText]}>{item.id}</Text>
            <Text style={styles.packageCategoryLabel}>
              {item.packageCategory.toUpperCase()} • {item.weight.toFixed(1)} KG
            </Text>
          </View>
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
            <IconSymbol name="exclamationmark.triangle.fill" size={12} color="#EAB308" />
            <Text style={styles.delayText}>DELAY ALERT: {item.delayReason.toUpperCase()}</Text>
          </View>
        )}

        <View style={styles.addressSection}>
          <View style={styles.addressRow}>
            <View style={[styles.addressDot, { backgroundColor: '#CCFF00' }]} />
            <Text style={styles.addressText} numberOfLines={1}>
              {item.senderAddress}
            </Text>
          </View>
          <View style={styles.addressConnector} />
          <View style={styles.addressRow}>
            <View style={[styles.addressDot, { backgroundColor: '#60A5FA' }]} />
            <Text style={styles.addressText} numberOfLines={1}>
              {item.recipientAddress}
            </Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.timestampText}>
            Created: {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={[styles.tariffValue, styles.monoText]}>
            ${item.price.toFixed(2)}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>
          {activeRole === 'customer' ? 'ROUTE REGISTRY' : 'DISPATCH CONTROL'}
        </Text>
        <Text style={styles.screenSubtitle}>
          {activeRole === 'customer'
            ? 'Track registered consignments and histories'
            : 'Manage accepted routes and open boarding tasks'}
        </Text>
      </View>

      {/* Driver/Rider Segment Tabs */}
      {activeRole === 'rider' && (
        <View style={styles.riderTabsContainer}>
          <Pressable
            style={[
              styles.riderTab,
              riderSubTab === 'my_tasks' && styles.riderTabActive,
            ]}
            onPress={() => setRiderSubTab('my_tasks')}
          >
            <Text
              style={[
                styles.riderTabText,
                riderSubTab === 'my_tasks' && styles.riderTabTextActive,
              ]}
            >
              MY TASKS ({riderTasks.length})
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.riderTab,
              riderSubTab === 'available_tasks' && styles.riderTabActive,
            ]}
            onPress={() => setRiderSubTab('available_tasks')}
          >
            <Text
              style={[
                styles.riderTabText,
                riderSubTab === 'available_tasks' && styles.riderTabTextActive,
              ]}
            >
              DISPATCH BOARD ({availableTasks.length})
            </Text>
          </Pressable>
        </View>
      )}

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        {activeRole === 'customer' ? (
          <View style={styles.listSection}>
            {/* Active Consignments */}
            <Text style={styles.groupHeader}>ACTIVE SHIPMENTS</Text>
            {customerActive.length > 0 ? (
              customerActive.map((item) => renderShipmentCard(item))
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No active logistics runs registered.</Text>
              </View>
            )}

            {/* Past Consignments */}
            <Text style={[styles.groupHeader, { marginTop: 12 }]}>DELIVERED RUNS</Text>
            {customerHistory.length > 0 ? (
              customerHistory.map((item) => renderShipmentCard(item))
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No delivery history available yet.</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.listSection}>
            {/* Rider My Tasks */}
            {riderSubTab === 'my_tasks' && (
              <>
                {riderTasks.length > 0 ? (
                  riderTasks.map((item) => renderShipmentCard(item))
                ) : (
                  <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>
                      No shipments assigned to your driver ID.
                    </Text>
                    <Pressable
                      style={styles.secondaryActionBtn}
                      onPress={() => setRiderSubTab('available_tasks')}
                    >
                      <Text style={styles.secondaryActionText}>OPEN DISPATCH BOARD</Text>
                    </Pressable>
                  </View>
                )}
              </>
            )}

            {/* Rider Available Tasks */}
            {riderSubTab === 'available_tasks' && (
              <>
                {!riderStats.isOnline && (
                  <View style={styles.offlineWarningCard}>
                    <IconSymbol name="exclamationmark.triangle.fill" size={16} color="#EAB308" />
                    <Text style={styles.offlineWarningText}>
                      You are currently OFFLINE. Toggle online duty status in Dashboard or Terminal to accept routes.
                    </Text>
                  </View>
                )}

                {availableTasks.length > 0 ? (
                  availableTasks.map((item) => (
                    <View key={item.id} style={styles.availableCard}>
                      <View style={styles.availableHeader}>
                        <View>
                          <Text style={[styles.availableId, styles.monoText]}>{item.id}</Text>
                          <Text style={styles.packageCategoryLabel}>
                            {item.packageCategory.toUpperCase()} • {item.weight.toFixed(1)} KG
                          </Text>
                        </View>
                        <Text style={[styles.availableTariff, styles.monoText]}>
                          ${item.price.toFixed(2)}
                        </Text>
                      </View>

                      <View style={styles.addressSection}>
                        <View style={styles.addressRow}>
                          <View style={[styles.addressDot, { backgroundColor: '#CCFF00' }]} />
                          <Text style={styles.addressText} numberOfLines={1}>
                            Pickup: {item.senderAddress}
                          </Text>
                        </View>
                        <View style={styles.addressConnector} />
                        <View style={styles.addressRow}>
                          <View style={[styles.addressDot, { backgroundColor: '#60A5FA' }]} />
                          <Text style={styles.addressText} numberOfLines={1}>
                            Dropoff: {item.recipientAddress}
                          </Text>
                        </View>
                      </View>

                      {item.notes ? (
                        <View style={styles.notesBox}>
                          <Text style={styles.notesText} numberOfLines={1}>
                            Notes: "{item.notes}"
                          </Text>
                        </View>
                      ) : null}

                      <Pressable
                        style={[
                          styles.acceptBtn,
                          (!riderStats.isOnline) && styles.acceptBtnDisabled,
                        ]}
                        disabled={!riderStats.isOnline}
                        onPress={() => acceptTask(item.id)}
                      >
                        <IconSymbol name="plus.circle.fill" size={16} color="#18181B" />
                        <Text style={styles.acceptBtnText}>ACCEPT ROUTE DISPATCH</Text>
                      </Pressable>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>
                      Dispatch board clear. Check back later for open logistics shipments.
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181B',
  },
  screenHeader: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 64 : 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FAFAFA',
    letterSpacing: 1.5,
  },
  screenSubtitle: {
    fontSize: 11,
    color: '#71717A',
    fontWeight: '600',
    marginTop: 4,
    lineHeight: 16,
  },
  riderTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E1E20',
    padding: 6,
    borderBottomWidth: 1.5,
    borderBottomColor: '#2D2D30',
  },
  riderTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderCurve: 'continuous',
  },
  riderTabActive: {
    backgroundColor: '#27272A',
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  riderTabText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  riderTabTextActive: {
    color: '#CCFF00',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  listSection: {
    gap: 12,
  },
  groupHeader: {
    fontSize: 10,
    fontWeight: '900',
    color: '#71717A',
    letterSpacing: 1.5,
    marginBottom: 4,
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
    fontSize: 15,
    fontWeight: '900',
    color: '#FAFAFA',
  },
  packageCategoryLabel: {
    fontSize: 9,
    color: '#71717A',
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: 0.5,
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
    borderWidth: 0.5,
    borderColor: '#EF444433',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  delayText: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  addressSection: {
    backgroundColor: '#18181B',
    padding: 12,
    borderRadius: 6,
    borderCurve: 'continuous',
    borderWidth: 0.5,
    borderColor: '#3F3F46',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  addressText: {
    color: '#FAFAFA',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  addressConnector: {
    width: 1,
    height: 10,
    backgroundColor: '#3F3F46',
    marginLeft: 2.5,
    marginVertical: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#3F3F46',
    paddingTop: 8,
    marginTop: 2,
  },
  timestampText: {
    fontSize: 9,
    color: '#71717A',
    fontWeight: '700',
  },
  tariffValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#CCFF00',
  },
  emptyCard: {
    backgroundColor: '#1E1E20',
    borderWidth: 1,
    borderColor: '#2D2D30',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyText: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryActionBtn: {
    backgroundColor: '#27272A',
    borderWidth: 1,
    borderColor: '#3F3F46',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  secondaryActionText: {
    color: '#CCFF00',
    fontSize: 11,
    fontWeight: '800',
  },
  availableCard: {
    backgroundColor: '#27272A',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 8,
    borderCurve: 'continuous',
    padding: 16,
    gap: 12,
  },
  availableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availableId: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FAFAFA',
  },
  availableTariff: {
    fontSize: 16,
    fontWeight: '900',
    color: '#CCFF00',
  },
  notesBox: {
    backgroundColor: '#18181B1F',
    borderLeftWidth: 2,
    borderLeftColor: '#71717A',
    paddingLeft: 8,
    paddingVertical: 2,
  },
  notesText: {
    fontSize: 11,
    color: '#71717A',
    fontStyle: 'italic',
  },
  acceptBtn: {
    backgroundColor: '#CCFF00',
    paddingVertical: 12,
    borderRadius: 6,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  acceptBtnDisabled: {
    backgroundColor: '#27272A',
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  acceptBtnText: {
    color: '#18181B',
    fontWeight: '900',
    fontSize: 12,
  },
  offlineWarningCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#F59E0B1A',
    borderWidth: 1,
    borderColor: '#F59E0B33',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  offlineWarningText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '700',
    flex: 1,
    lineHeight: 14,
  },
  monoText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontVariant: ['tabular-nums'],
  },
});
