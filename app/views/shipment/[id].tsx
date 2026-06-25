import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ShipmentStatus, useLogiTrack } from "@/store/logitrack-store";
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function ShipmentDetailScreen() {
  const router = useRouter();
  const theme = useThemeColors();
  const { id } = useLocalSearchParams();
  const {
    activeRole,
    shipments,
    updateShipmentStatus,
    reportDelay,
    clearDelay,
  } = useLogiTrack();

  const [showDelayPicker, setShowDelayPicker] = useState(false);

  const shipment = shipments.find((s) => s.id === id);

  if (!shipment) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <IconSymbol
          name="exclamationmark.triangle.fill"
          size={32}
          color={theme.danger}
        />
        <Text style={[styles.errorTitle, { color: theme.danger }]}>CONSIGNMENT UNREGISTERED</Text>
        <Text style={[styles.errorText, { color: theme.muted }]}>
          The tracking number ID &apos;{id}&apos; was not found in active
          database registries.
        </Text>
        <Pressable style={[styles.backBtn, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => router.back()}>
          <Text style={[styles.backBtnText, { color: theme.primary }]}>RETURN TO DASHBOARD</Text>
        </Pressable>
      </View>
    );
  }

  // Check if active rider is the one assigned
  const isAssignedRider =
    activeRole === "rider" && shipment.driverId === "DRV-101";

  // Helper to format Date string
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Transition driver buttons
  const getDriverAction = () => {
    if (shipment.status === "pending" && shipment.driverId === "DRV-101") {
      return {
        label: "CONFIRM CARGO PICKUP",
        nextStatus: "picked_up" as ShipmentStatus,
        note: "Courier arrived at pickup origin. Cargo loaded.",
        icon: "shippingbox.fill",
      };
    }
    if (shipment.status === "picked_up") {
      return {
        label: "DEPART FROM DEPOT (IN TRANSIT)",
        nextStatus: "in_transit" as ShipmentStatus,
        note: "Courier departed center. Out on delivery leg.",
        icon: "car.fill",
      };
    }
    if (shipment.status === "in_transit") {
      return {
        label: "CONFIRM CARGO HANDOVER",
        nextStatus: "delivered" as ShipmentStatus,
        note: "Delivered directly to recipient. Signature logged.",
        icon: "checkmark.circle.fill",
      };
    }
    return null;
  };

  const driverAction = getDriverAction();
  const delayReasons = [
    "Heavy Traffic",
    "Low Fuel / Charging",
    "Vehicle Maintenance",
    "Adverse Weather",
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* Alert delay warning banner */}
      {shipment.delayReason && (
        <View style={[styles.alertBanner, { backgroundColor: theme.warningBg, borderColor: theme.warning }]}>
          <IconSymbol
            name="exclamationmark.triangle.fill"
            size={20}
            color={theme.warning}
          />
          <View style={styles.alertTextWrapper}>
            <Text style={[styles.alertTitle, { color: theme.warning }]}>ROUTE INTERRUPTED</Text>
            <Text style={[styles.alertSubtitle, { color: theme.warning }]}>
              Rider reported: {shipment.delayReason.toUpperCase()}
            </Text>
          </View>
        </View>
      )}

      {/* Cargo Overview Card */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={[styles.sectionHeader, { color: theme.muted }]}>CARGO MANIFEST</Text>
            <Text style={[styles.manifestId, styles.monoText, { color: theme.text }]}>
              {shipment.id}
            </Text>
          </View>
          <View
            style={[
              styles.tagBadge, { backgroundColor: theme.mutedBg },
              shipment.delayReason ? { backgroundColor: theme.dangerBg } : { backgroundColor: theme.successBg },
            ]}
          >
            <Text
              style={[
                styles.tagText, { color: theme.muted },
                shipment.delayReason
                  ? { color: theme.danger }
                  : { color: theme.success },
              ]}
            >
              {shipment.delayReason ? "EXCEPTION" : "NOMINAL"}
            </Text>
          </View>
        </View>

        <View style={[styles.addressBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <View style={styles.addressItem}>
            <View
              style={[styles.nodeIndicator, { backgroundColor: theme.primary }]}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.addressRole, { color: theme.muted }]}>ORIGIN SHIPPED FROM</Text>
              <Text style={[styles.addressNameText, { color: theme.text }]}>{shipment.senderName}</Text>
              <Text style={[styles.addressValText, { color: theme.muted }]}>
                {shipment.senderAddress}
              </Text>
            </View>
          </View>

          <View style={[styles.addressConnectorLine, { backgroundColor: theme.border }]} />

          <View style={styles.addressItem}>
            <View
              style={[styles.nodeIndicator, { backgroundColor: theme.info }]}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.addressRole, { color: theme.muted }]}>DELIVERY DESTINATION</Text>
              <Text style={[styles.addressNameText, { color: theme.text }]}>
                {shipment.recipientName}
              </Text>
              <Text style={[styles.addressValText, { color: theme.muted }]}>
                {shipment.recipientAddress}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.manifestMetricsGrid, { borderColor: theme.border }]}>
          <View style={styles.manifestMetric}>
            <Text style={[styles.metricLabel, { color: theme.muted }]}>CATEGORY</Text>
            <Text style={[styles.metricVal, { color: theme.text }]}>{shipment.packageCategory}</Text>
          </View>
          <View style={styles.manifestMetric}>
            <Text style={[styles.metricLabel, { color: theme.muted }]}>WEIGHT</Text>
            <Text style={[styles.metricVal, styles.monoText, { color: theme.text }]}>
              {shipment.weight} KG
            </Text>
          </View>
          <View style={styles.manifestMetric}>
            <Text style={[styles.metricLabel, { color: theme.muted }]}>TARIFF</Text>
            <Text
              style={[styles.metricVal, styles.monoText, { color: theme.primary }]}
            >
              ${shipment.price.toFixed(2)}
            </Text>
          </View>
        </View>

        {shipment.notes ? (
          <View style={[styles.instructionsBox, { backgroundColor: theme.mutedBg, borderLeftColor: theme.primary }]}>
            <Text style={[styles.instructionsHeader, { color: theme.primary }]}>HANDLING INSTRUCTIONS</Text>
            <Text style={[styles.instructionsText, { color: theme.text }]}>
              &quot;{shipment.notes}&quot;
            </Text>
          </View>
        ) : null}
      </View>

      {/* Driver Assigned Card */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionHeader, { color: theme.muted }]}>LOGISTICS AGENT</Text>
        {shipment.driverId ? (
          <View style={styles.agentRow}>
            <View style={[styles.agentAvatar, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.agentAvatarText, { color: theme.text }]}>MV</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.agentName, { color: theme.text }]}>{shipment.driverName}</Text>
              <Text style={[styles.agentId, styles.monoText, { color: theme.muted }]}>
                RIDER ID: {shipment.driverId}
              </Text>
            </View>
            <View style={[styles.assignedBadge, { backgroundColor: theme.infoBg }]}>
              <Text style={[styles.assignedBadgeText, { color: theme.info }]}>DISPATCHED</Text>
            </View>
          </View>
        ) : (
          <View style={styles.unassignedRow}>
            <Text style={[styles.unassignedText, { color: theme.muted }]}>
              UNASSIGNED — Awaiting Rider Dispatch
            </Text>
          </View>
        )}
      </View>

      {/* Interactive Driver Override Panels */}
      {isAssignedRider && (
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.primary + '44' }]}>
          <Text style={[styles.sectionHeader, { color: theme.primary }]}>
            COURIER OVERRIDE CONTROLS
          </Text>
          <Text style={[styles.overrideHelper, { color: theme.muted }]}>
            Update cargo transit steps and broadcast delays to client terminals
            in real-time.
          </Text>

          {/* Action Step trigger */}
          {driverAction ? (
            <Pressable
              style={[styles.overrideCta, { backgroundColor: theme.primary }]}
              onPress={() =>
                updateShipmentStatus(
                  shipment.id,
                  driverAction.nextStatus,
                  driverAction.note,
                )
              }
            >
              <IconSymbol
                name={driverAction.icon as any}
                size={16}
                color={theme.primaryText}
              />
              <Text style={[styles.overrideCtaText, { color: theme.primaryText }]}>{driverAction.label}</Text>
            </Pressable>
          ) : (
            <View style={[styles.nominalFinishBox, { backgroundColor: theme.successBg, borderColor: theme.success }]}>
              <IconSymbol
                name="checkmark.circle.fill"
                size={16}
                color={theme.success}
              />
              <Text style={[styles.nominalFinishText, { color: theme.success }]}>
                LOGISTICS COMPLETE: ROUTE FULLY RESOLVED
              </Text>
            </View>
          )}

          {/* Delay reporter */}
          {shipment.status !== "delivered" && (
            <View style={styles.delayControlsWrapper}>
              {!shipment.delayReason ? (
                <>
                  <Pressable
                    style={[styles.delayReporterToggle, { backgroundColor: theme.card, borderColor: theme.border }]}
                    onPress={() => setShowDelayPicker(!showDelayPicker)}
                  >
                    <IconSymbol
                      name="exclamationmark.triangle.fill"
                      size={14}
                      color={theme.warning}
                    />
                    <Text style={[styles.delayReporterToggleText, { color: theme.text }]}>
                      {showDelayPicker
                        ? "CLOSE EXCEPTION PANELS"
                        : "REPORT TRANSIT EXCEPTION"}
                    </Text>
                  </Pressable>

                  {showDelayPicker && (
                    <View style={[styles.delayOptionsBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
                      {delayReasons.map((reason) => (
                        <Pressable
                          key={reason}
                          style={[styles.delayOptionBtn, { borderBottomColor: theme.card }]}
                          onPress={() => {
                            reportDelay(shipment.id, reason);
                            setShowDelayPicker(false);
                          }}
                        >
                          <Text style={[styles.delayOptionText, { color: theme.muted }]}>
                            {reason.toUpperCase()}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </>
              ) : (
                <Pressable
                  style={[styles.clearDelayBtn, { backgroundColor: theme.successBg, borderColor: theme.success }]}
                  onPress={() => clearDelay(shipment.id)}
                >
                  <IconSymbol
                    name="checkmark.circle.fill"
                    size={14}
                    color={theme.success}
                  />
                  <Text style={[styles.clearDelayBtnText, { color: theme.success }]}>
                    RESOLVE & CLEAR EXCEPTION
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      )}

      {/* Logistics Status logs Timeline */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionHeader, { color: theme.muted }]}>LOGISTICS TRACKING TIMELINE</Text>

        <View style={styles.timelineList}>
          {shipment.statusLogs.map((log, index) => {
            const isLast = index === shipment.statusLogs.length - 1;
            const isDelay = log.status === "delay_reported";
            const isClear = log.status === "delay_cleared";

            return (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineGraphicColumn}>
                  <View
                    style={[
                      styles.timelineDot, { backgroundColor: theme.border },
                      isLast && [styles.timelineDotActive, { backgroundColor: theme.primary, boxShadow: '0 0 4px ' + theme.primary }],
                      isDelay && { backgroundColor: theme.warning },
                      isClear && { backgroundColor: theme.success },
                    ]}
                  />
                  {!isLast && <View style={[styles.timelineConnector, { backgroundColor: theme.border }]} />}
                </View>

                <View style={styles.timelineContent}>
                  <View style={styles.timelineTitleRow}>
                    <Text
                      style={[
                        styles.timelineStatusTitle, { color: theme.muted },
                        isLast && [styles.timelineStatusTitleActive, { color: theme.text }],
                        isDelay && { color: theme.warning },
                        isClear && { color: theme.success },
                      ]}
                    >
                      {log.status.toUpperCase().replace("_", " ")}
                    </Text>
                    <Text style={[styles.timelineTimeText, styles.monoText, { color: theme.muted }]}>
                      {formatTime(log.timestamp)}
                    </Text>
                  </View>
                  <Text style={[styles.timelineNote, { color: theme.text }]}>{log.note}</Text>
                  <Text style={[styles.timelineDate, { color: theme.muted }]}>
                    {formatDate(log.timestamp)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18181B",
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#18181B",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  errorTitle: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
  },
  errorText: {
    color: "#71717A",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 24,
  },
  backBtn: {
    backgroundColor: "#27272A",
    borderWidth: 1,
    borderColor: "#3F3F46",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  backBtnText: {
    color: "#CCFF00",
    fontSize: 12,
    fontWeight: "800",
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#EAB3081A",
    borderWidth: 1,
    borderColor: "#EAB30833",
    padding: 14,
    borderRadius: 8,
  },
  alertTextWrapper: {
    flex: 1,
    gap: 2,
  },
  alertTitle: {
    color: "#EAB308",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },
  alertSubtitle: {
    color: "#EAB308BF",
    fontSize: 11,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#27272A",
    borderWidth: 1,
    borderColor: "#3F3F46",
    borderRadius: 8,
    borderCurve: "continuous",
    padding: 16,
    gap: 12,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: "900",
    color: "#71717A",
    letterSpacing: 1.5,
  },
  manifestId: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FAFAFA",
    marginTop: 4,
  },
  tagBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagNominal: { backgroundColor: "#10B9811F" },
  tagWarning: { backgroundColor: "#EF44441F" },
  tagText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  tagTextNominal: { color: "#10B981" },
  tagTextWarning: { color: "#EF4444" },
  addressBox: {
    backgroundColor: "#18181B",
    padding: 14,
    borderRadius: 6,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: "#3F3F46",
    gap: 10,
    position: "relative",
  },
  addressItem: {
    flexDirection: "row",
    gap: 12,
  },
  nodeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
  },
  addressRole: {
    fontSize: 8,
    fontWeight: "800",
    color: "#71717A",
  },
  addressNameText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FAFAFA",
    marginTop: 2,
  },
  addressValText: {
    fontSize: 11,
    color: "#A1A1AA",
    fontWeight: "500",
    marginTop: 1,
  },
  addressConnectorLine: {
    position: "absolute",
    left: 17.5,
    top: 24,
    bottom: 24,
    width: 1,
    backgroundColor: "#3F3F46",
  },
  manifestMetricsGrid: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#3F3F46",
    paddingVertical: 12,
  },
  manifestMetric: {
    flex: 1,
    gap: 4,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#71717A",
  },
  metricVal: {
    fontSize: 13,
    fontWeight: "900",
    color: "#FAFAFA",
  },
  instructionsBox: {
    backgroundColor: "#18181B4D",
    padding: 10,
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: "#CCFF00",
  },
  instructionsHeader: {
    fontSize: 8,
    fontWeight: "800",
    color: "#CCFF00",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 11,
    color: "#A1A1AA",
    fontStyle: "italic",
    lineHeight: 14,
  },
  agentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  agentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: "#27272A",
    borderWidth: 1,
    borderColor: "#3F3F46",
    alignItems: "center",
    justifyContent: "center",
  },
  agentAvatarText: {
    color: "#FAFAFA",
    fontSize: 14,
    fontWeight: "800",
  },
  agentName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FAFAFA",
  },
  agentId: {
    fontSize: 10,
    color: "#71717A",
    fontWeight: "600",
    marginTop: 2,
  },
  assignedBadge: {
    backgroundColor: "#3B82F61F",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  assignedBadgeText: {
    color: "#60A5FA",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  unassignedRow: {
    paddingVertical: 8,
  },
  unassignedText: {
    color: "#71717A",
    fontSize: 12,
    fontWeight: "600",
    fontStyle: "italic",
  },
  overrideHelper: {
    fontSize: 11,
    color: "#71717A",
    lineHeight: 15,
  },
  overrideCta: {
    backgroundColor: "#CCFF00",
    paddingVertical: 14,
    borderRadius: 6,
    borderCurve: "continuous",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 6,
  },
  overrideCtaText: {
    color: "#18181B",
    fontWeight: "900",
    fontSize: 13,
  },
  nominalFinishBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#10B9811F",
    borderWidth: 1,
    borderColor: "#10B98133",
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 6,
  },
  nominalFinishText: {
    color: "#10B981",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  delayControlsWrapper: {
    marginTop: 6,
  },
  delayReporterToggle: {
    backgroundColor: "#27272A",
    borderWidth: 1,
    borderColor: "#3F3F46",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderRadius: 6,
  },
  delayReporterToggleText: {
    color: "#FAFAFA",
    fontSize: 11,
    fontWeight: "800",
  },
  delayOptionsBox: {
    marginTop: 8,
    backgroundColor: "#18181B",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#3F3F46",
    overflow: "hidden",
  },
  delayOptionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#27272A",
  },
  delayOptionText: {
    color: "#71717A",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  clearDelayBtn: {
    backgroundColor: "#10B9811F",
    borderWidth: 1,
    borderColor: "#10B981",
    paddingVertical: 10,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  clearDelayBtnText: {
    color: "#10B981",
    fontSize: 11,
    fontWeight: "900",
  },
  timelineList: {
    marginTop: 8,
    gap: 0,
  },
  timelineItem: {
    flexDirection: "row",
  },
  timelineGraphicColumn: {
    width: 24,
    alignItems: "center",
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3F3F46",
    marginTop: 6,
  },
  timelineDotActive: {
    backgroundColor: "#CCFF00",
    width: 10,
    height: 10,
    borderRadius: 5,
    boxShadow: "0 0 4px #CCFF00",
  },
  timelineConnector: {
    width: 1,
    flex: 1,
    backgroundColor: "#3F3F46",
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 20,
    paddingLeft: 8,
    gap: 4,
  },
  timelineTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timelineStatusTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#71717A",
  },
  timelineStatusTitleActive: {
    color: "#FAFAFA",
  },
  timelineTimeText: {
    fontSize: 9,
    color: "#71717A",
    fontWeight: "700",
  },
  timelineNote: {
    fontSize: 11,
    color: "#A1A1AA",
    fontWeight: "500",
    lineHeight: 14,
  },
  timelineDate: {
    fontSize: 8,
    color: "#71717A",
    fontWeight: "700",
    marginTop: 2,
  },
  monoText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontVariant: ["tabular-nums"],
  },
});
