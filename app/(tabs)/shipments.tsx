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
import { useLogiTrack, Shipment } from '@/store/logitrack-store';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function ShipmentsScreen() {
  const router = useRouter();
  const theme = useThemeColors();
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
        style={[styles.shipmentCard, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={() => router.push(`/views/shipment/${item.id}` as any)}
      >
        <View style={styles.shipmentHeader}>
          <View>
            <Text style={[styles.shipmentId, styles.monoText, { color: theme.text }]}>{item.id}</Text>
            <Text style={[styles.packageCategoryLabel, { color: theme.muted }]}>
              {item.packageCategory.toUpperCase()} • {item.weight.toFixed(1)} KG
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge, { backgroundColor: theme.mutedBg },
              item.status === 'pending' && { backgroundColor: theme.mutedBg },
              item.status === 'picked_up' && { backgroundColor: theme.infoBg },
              item.status === 'in_transit' && { backgroundColor: theme.warningBg },
              item.status === 'delivered' && { backgroundColor: theme.successBg },
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText, { color: theme.text },
                item.status === 'pending' && { color: theme.muted },
                item.status === 'picked_up' && { color: theme.info },
                item.status === 'in_transit' && { color: theme.warning },
                item.status === 'delivered' && { color: theme.success },
              ]}
            >
              {item.status.toUpperCase().replace('_', ' ')}
            </Text>
          </View>
        </View>

        {item.delayReason && (
          <View style={[styles.delayBanner, { backgroundColor: theme.dangerBg, borderColor: theme.danger }]}>
            <IconSymbol name="exclamationmark.triangle.fill" size={12} color={theme.warning} />
            <Text style={[styles.delayText, { color: theme.danger }]}>DELAY ALERT: {item.delayReason.toUpperCase()}</Text>
          </View>
        )}

        <View style={[styles.addressSection, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <View style={styles.addressRow}>
            <View style={[styles.addressDot, { backgroundColor: theme.primary }]} />
            <Text style={[styles.addressText, { color: theme.text }]} numberOfLines={1}>
              {item.senderAddress}
            </Text>
          </View>
          <View style={[styles.addressConnector, { backgroundColor: theme.border }]} />
          <View style={styles.addressRow}>
            <View style={[styles.addressDot, { backgroundColor: theme.info }]} />
            <Text style={[styles.addressText, { color: theme.text }]} numberOfLines={1}>
              {item.recipientAddress}
            </Text>
          </View>
        </View>

        <View style={[styles.footerRow, { borderTopColor: theme.border }]}>
          <Text style={[styles.timestampText, { color: theme.muted }]}>
            Created: {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={[styles.tariffValue, styles.monoText, { color: theme.primary }]}>
            ${item.price.toFixed(2)}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.screenHeader, { borderBottomColor: theme.card }]}>
        <Text style={[styles.screenTitle, { color: theme.text }]}>
          {activeRole === 'customer' ? 'ROUTE REGISTRY' : 'DISPATCH CONTROL'}
        </Text>
        <Text style={[styles.screenSubtitle, { color: theme.muted }]}>
          {activeRole === 'customer'
            ? 'Track registered consignments and histories'
            : 'Manage accepted routes and open boarding tasks'}
        </Text>
      </View>

      {/* Driver/Rider Segment Tabs */}
      {activeRole === 'rider' && (
        <View style={[styles.riderTabsContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <Pressable
            style={[
              styles.riderTab,
              riderSubTab === 'my_tasks' && [styles.riderTabActive, { backgroundColor: theme.card, borderColor: theme.border }],
            ]}
            onPress={() => setRiderSubTab('my_tasks')}
          >
            <Text
              style={[
                styles.riderTabText, { color: theme.muted },
                riderSubTab === 'my_tasks' && [styles.riderTabTextActive, { color: theme.primaryText }],
              ]}
            >
              MY TASKS ({riderTasks.length})
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.riderTab,
              riderSubTab === 'available_tasks' && [styles.riderTabActive, { backgroundColor: theme.card, borderColor: theme.border }],
            ]}
            onPress={() => setRiderSubTab('available_tasks')}
          >
            <Text
              style={[
                styles.riderTabText, { color: theme.muted },
                riderSubTab === 'available_tasks' && [styles.riderTabTextActive, { color: theme.primaryText }],
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
            <Text style={[styles.groupHeader, { color: theme.muted }]}>ACTIVE SHIPMENTS</Text>
            {customerActive.length > 0 ? (
              customerActive.map((item) => renderShipmentCard(item))
            ) : (
              <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.emptyText, { color: theme.muted }]}>No active logistics runs registered.</Text>
              </View>
            )}

            {/* Past Consignments */}
            <Text style={[styles.groupHeader, { color: theme.muted, marginTop: 12 }]}>DELIVERED RUNS</Text>
            {customerHistory.length > 0 ? (
              customerHistory.map((item) => renderShipmentCard(item))
            ) : (
              <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.emptyText, { color: theme.muted }]}>No delivery history available yet.</Text>
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
                  <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.emptyText, { color: theme.muted }]}>
                      No shipments assigned to your driver ID.
                    </Text>
                    <Pressable
                      style={[styles.secondaryActionBtn, { backgroundColor: theme.background, borderColor: theme.border }]}
                      onPress={() => setRiderSubTab('available_tasks')}
                    >
                      <Text style={[styles.secondaryActionText, { color: theme.primaryText }]}>OPEN DISPATCH BOARD</Text>
                    </Pressable>
                  </View>
                )}
              </>
            )}

            {/* Rider Available Tasks */}
            {riderSubTab === 'available_tasks' && (
              <>
                {!riderStats.isOnline && (
                  <View style={[styles.offlineWarningCard, { backgroundColor: theme.warningBg, borderColor: theme.warning }]}>
                    <IconSymbol name="exclamationmark.triangle.fill" size={16} color={theme.warning} />
                    <Text style={[styles.offlineWarningText, { color: theme.warning }]}>
                      You are currently OFFLINE. Toggle online duty status in Dashboard or Terminal to accept routes.
                    </Text>
                  </View>
                )}

                {availableTasks.length > 0 ? (
                  availableTasks.map((item) => (
                    <View key={item.id} style={[styles.availableCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                      <View style={styles.availableHeader}>
                        <View>
                          <Text style={[styles.availableId, styles.monoText, { color: theme.text }]}>{item.id}</Text>
                          <Text style={[styles.packageCategoryLabel, { color: theme.muted }]}>
                            {item.packageCategory.toUpperCase()} • {item.weight.toFixed(1)} KG
                          </Text>
                        </View>
                        <Text style={[styles.availableTariff, styles.monoText, { color: theme.primary }]}>
                          ${item.price.toFixed(2)}
                        </Text>
                      </View>

                      <View style={[styles.addressSection, { backgroundColor: theme.background, borderColor: theme.border }]}>
                        <View style={styles.addressRow}>
                          <View style={[styles.addressDot, { backgroundColor: theme.primary }]} />
                          <Text style={[styles.addressText, { color: theme.text }]} numberOfLines={1}>
                            Pickup: {item.senderAddress}
                          </Text>
                        </View>
                        <View style={[styles.addressConnector, { backgroundColor: theme.border }]} />
                        <View style={styles.addressRow}>
                          <View style={[styles.addressDot, { backgroundColor: theme.info }]} />
                          <Text style={[styles.addressText, { color: theme.text }]} numberOfLines={1}>
                            Dropoff: {item.recipientAddress}
                          </Text>
                        </View>
                      </View>

                      {item.notes ? (
                        <View style={[styles.notesBox, { backgroundColor: theme.mutedBg, borderLeftColor: theme.muted }]}>
                          <Text style={[styles.notesText, { color: theme.muted }]} numberOfLines={1}>
                            Notes: "{item.notes}"
                          </Text>
                        </View>
                      ) : null}

                      <Pressable
                        style={[
                          styles.acceptBtn, { backgroundColor: theme.primary },
                          (!riderStats.isOnline) && [styles.acceptBtnDisabled, { backgroundColor: theme.background, borderColor: theme.border }],
                        ]}
                        disabled={!riderStats.isOnline}
                        onPress={() => acceptTask(item.id)}
                      >
                        <IconSymbol name="plus.circle.fill" size={16} color={theme.primaryText} />
                        <Text style={[styles.acceptBtnText, { color: theme.primaryText }]}>ACCEPT ROUTE DISPATCH</Text>
                      </Pressable>
                    </View>
                  ))
                ) : (
                  <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.emptyText, { color: theme.muted }]}>
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
  },
  screenHeader: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 64 : 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
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
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  shipmentCard: {
    borderWidth: 1,
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
  },
  packageCategoryLabel: {
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  delayBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 0.5,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  delayText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  addressSection: {
    padding: 12,
    borderRadius: 6,
    borderCurve: 'continuous',
    borderWidth: 0.5,
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
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  addressConnector: {
    width: 1,
    height: 10,
    marginLeft: 2.5,
    marginVertical: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    paddingTop: 8,
    marginTop: 2,
  },
  timestampText: {
    fontSize: 9,
    fontWeight: '700',
  },
  tariffValue: {
    fontSize: 14,
    fontWeight: '900',
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryActionBtn: {
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  secondaryActionText: {
    fontSize: 11,
    fontWeight: '800',
  },
  availableCard: {
    borderWidth: 1,
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
  },
  availableTariff: {
    fontSize: 16,
    fontWeight: '900',
  },
  notesBox: {
    borderLeftWidth: 2,
    paddingLeft: 8,
    paddingVertical: 2,
  },
  notesText: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  acceptBtn: {
    paddingVertical: 12,
    borderRadius: 6,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  acceptBtnDisabled: {
    borderWidth: 1,
  },
  acceptBtnText: {
    fontWeight: '900',
    fontSize: 12,
  },
  offlineWarningCard: {
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  offlineWarningText: {
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
