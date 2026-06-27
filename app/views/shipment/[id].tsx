import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { ShipmentStatus, useLogiTrack } from "@/store/logitrack-store";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

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
      <View className="flex-1 p-6 items-center justify-center gap-4 bg-background">
        <IconSymbol
          name="exclamationmark.triangle.fill"
          size={32}
          color={theme.danger}
        />
        <Text className="text-base font-black tracking-widest text-center text-danger">
          CONSIGNMENT UNREGISTERED
        </Text>
        <Text className="text-xs font-semibold text-center leading-snug px-6 text-muted">
          The tracking number ID &apos;{id}&apos; was not found in active
          database registries.
        </Text>
        <Pressable
          className="border py-3 px-5 rounded-md bg-card border-border"
          onPress={() => router.back()}
        >
          <Text className="text-xs font-extrabold text-primary">
            RETURN TO DASHBOARD
          </Text>
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
      className="flex-1 bg-background"
      contentContainerClassName="p-4 gap-4 pb-10"
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* Alert delay warning banner */}
      {shipment.delayReason && (
        <View className="flex-row items-center gap-3 border py-3 px-3.5 rounded-lg border-warning bg-[#F59E0B1F]">
          <IconSymbol
            name="exclamationmark.triangle.fill"
            size={20}
            color={theme.warning}
          />
          <View className="flex-1 gap-0.5">
            <Text className="text-xs font-black tracking-widest text-warning">
              ROUTE INTERRUPTED
            </Text>
            <Text className="text-[11px] font-semibold text-warning">
              Rider reported: {shipment.delayReason.toUpperCase()}
            </Text>
          </View>
        </View>
      )}

      {/* Cargo Overview Card */}
      <View className="border rounded-lg p-4 gap-3 bg-card border-border">
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-[10px] font-black tracking-[1.5px] text-muted">
              CARGO MANIFEST
            </Text>
            <Text className="text-[22px] font-black mt-1 text-foreground font-mono tabular-nums">
              {shipment.id}
            </Text>
          </View>
          <View
            className={`px-2.5 py-1 rounded ${shipment.delayReason ? "bg-[#EF44441F]" : "bg-[#10B9811F]"}`}
          >
            <Text
              className={`text-[9px] font-black tracking-wider ${shipment.delayReason ? "text-danger" : "text-success"}`}
            >
              {shipment.delayReason ? "EXCEPTION" : "NOMINAL"}
            </Text>
          </View>
        </View>

        <View className="p-3.5 rounded-md border gap-2.5 relative bg-background border-border">
          <View className="flex-row gap-3">
            <View className="w-2 h-2 rounded-full mt-1.5 bg-primary" />
            <View style={{ flex: 1 }}>
              <Text className="text-[8px] font-extrabold text-muted">
                ORIGIN SHIPPED FROM
              </Text>
              <Text className="text-[13px] font-extrabold mt-0.5 text-foreground">
                {shipment.senderName}
              </Text>
              <Text className="text-[11px] font-medium mt-0.5 text-muted">
                {shipment.senderAddress}
              </Text>
            </View>
          </View>

          <View className="absolute left-[17.5px] top-6 bottom-6 w-px bg-border" />

          <View className="flex-row gap-3">
            <View className="w-2 h-2 rounded-full mt-1.5 bg-[#3B82F6]" />
            <View style={{ flex: 1 }}>
              <Text className="text-[8px] font-extrabold text-muted">
                DELIVERY DESTINATION
              </Text>
              <Text className="text-[13px] font-extrabold mt-0.5 text-foreground">
                {shipment.recipientName}
              </Text>
              <Text className="text-[11px] font-medium mt-0.5 text-muted">
                {shipment.recipientAddress}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row border-y-[0.5px] py-3 border-border">
          <View className="flex-1 gap-1">
            <Text className="text-[9px] font-extrabold text-muted">
              CATEGORY
            </Text>
            <Text className="text-[13px] font-black text-foreground">
              {shipment.packageCategory}
            </Text>
          </View>
          <View className="flex-1 gap-1">
            <Text className="text-[9px] font-extrabold text-muted">WEIGHT</Text>
            <Text className="text-[13px] font-black text-foreground font-mono tabular-nums">
              {shipment.weight} KG
            </Text>
          </View>
          <View className="flex-1 gap-1">
            <Text className="text-[9px] font-extrabold text-muted">TARIFF</Text>
            <Text className="text-[13px] font-black font-mono tabular-nums text-primary">
              ${shipment.price.toFixed(2)}
            </Text>
          </View>
        </View>

        {shipment.notes ? (
          <View className="p-2.5 rounded border-l-2 bg-[#71717A1F] border-l-primary">
            <Text className="text-[8px] font-extrabold tracking-wider mb-1 text-primary">
              HANDLING INSTRUCTIONS
            </Text>
            <Text className="text-[11px] italic leading-snug text-muted">
              &quot;{shipment.notes}&quot;
            </Text>
          </View>
        ) : null}
      </View>

      {/* Driver Assigned Card */}
      <View className="border rounded-lg p-4 gap-3 bg-card border-border">
        <Text className="text-[10px] font-black tracking-[1.5px] text-muted">
          LOGISTICS AGENT
        </Text>
        {shipment.driverId ? (
          <View className="flex-row items-center gap-3 mt-1">
            <View className="w-11 h-11 rounded-md border items-center justify-center bg-background border-border">
              <Text className="text-sm font-extrabold text-foreground">MV</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text className="text-sm font-extrabold text-foreground">
                {shipment.driverName}
              </Text>
              <Text className="text-[10px] font-semibold mt-0.5 text-muted font-mono tabular-nums">
                RIDER ID: {shipment.driverId}
              </Text>
            </View>
            <View className="px-2 py-1 rounded bg-[#3B82F61F]">
              <Text className="text-[9px] font-black tracking-wider text-[#60A5FA]">
                DISPATCHED
              </Text>
            </View>
          </View>
        ) : (
          <View className="py-2">
            <Text className="text-xs font-semibold italic text-muted">
              UNASSIGNED — Awaiting Rider Dispatch
            </Text>
          </View>
        )}
      </View>

      {/* Interactive Driver Override Panels */}
      {isAssignedRider && (
        <View className="border rounded-lg p-4 gap-3 bg-card border-primary/30">
          <Text className="text-[10px] font-black tracking-[1.5px] text-primary">
            COURIER OVERRIDE CONTROLS
          </Text>
          <Text className="text-[11px] leading-snug text-muted">
            Update cargo transit steps and broadcast delays to client terminals
            in real-time.
          </Text>

          {/* Action Step trigger */}
          {driverAction ? (
            <Pressable
              className="py-3.5 rounded-md flex-row items-center justify-center gap-2 mt-1.5 bg-primary"
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
              <Text className="font-black text-[13px] text-[#18181B]">
                {driverAction.label}
              </Text>
            </Pressable>
          ) : (
            <View className="flex-row items-center justify-center gap-2 border py-3 rounded-md mt-1.5 bg-[#10B9811F] border-success">
              <IconSymbol
                name="checkmark.circle.fill"
                size={16}
                color={theme.success}
              />
              <Text className="text-[11px] font-black tracking-wider text-success">
                LOGISTICS COMPLETE: ROUTE FULLY RESOLVED
              </Text>
            </View>
          )}

          {/* Delay reporter */}
          {shipment.status !== "delivered" && (
            <View className="mt-1.5">
              {!shipment.delayReason ? (
                <>
                  <Pressable
                    className="border py-2.5 items-center justify-center flex-row gap-2 rounded-md bg-card border-border"
                    onPress={() => setShowDelayPicker(!showDelayPicker)}
                  >
                    <IconSymbol
                      name="exclamationmark.triangle.fill"
                      size={14}
                      color={theme.warning}
                    />
                    <Text className="text-[11px] font-extrabold text-foreground">
                      {showDelayPicker
                        ? "CLOSE EXCEPTION PANELS"
                        : "REPORT TRANSIT EXCEPTION"}
                    </Text>
                  </Pressable>

                  {showDelayPicker && (
                    <View className="mt-2 rounded-md border overflow-hidden bg-background border-border">
                      {delayReasons.map((reason) => (
                        <Pressable
                          key={reason}
                          className="py-3 px-4 border-b-[0.5px] border-b-card"
                          onPress={() => {
                            reportDelay(shipment.id, reason);
                            setShowDelayPicker(false);
                          }}
                        >
                          <Text className="text-[11px] font-black tracking-wider text-muted">
                            {reason.toUpperCase()}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </>
              ) : (
                <Pressable
                  className="border py-2.5 rounded-md flex-row items-center justify-center gap-2 bg-[#10B9811F] border-success"
                  onPress={() => clearDelay(shipment.id)}
                >
                  <IconSymbol
                    name="checkmark.circle.fill"
                    size={14}
                    color={theme.success}
                  />
                  <Text className="text-[11px] font-black text-success">
                    RESOLVE & CLEAR EXCEPTION
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      )}

      {/* Logistics Status logs Timeline */}
      <View className="border rounded-lg p-4 gap-3 bg-card border-border">
        <Text className="text-[10px] font-black tracking-[1.5px] text-muted">
          LOGISTICS TRACKING TIMELINE
        </Text>

        <View className="mt-2 gap-0">
          {shipment.statusLogs.map((log, index) => {
            const isLast = index === shipment.statusLogs.length - 1;
            const isDelay = log.status === "delay_reported";
            const isClear = log.status === "delay_cleared";

            return (
              <View key={index} className="flex-row">
                <View className="w-6 items-center">
                  <View
                    className={`${isLast ? "w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_4px_var(--color-primary)]" : "w-2 h-2 rounded-full mt-1.5"} ${!isLast && isDelay ? "bg-warning" : !isLast && isClear ? "bg-success" : !isLast ? "bg-border" : ""}`}
                  />
                  {!isLast && <View className="w-px flex-1 my-1 bg-border" />}
                </View>

                <View className="flex-1 pb-5 pl-2 gap-1">
                  <View className="flex-row justify-between items-center">
                    <Text
                      className={`text-xs font-black ${isLast ? "text-foreground" : isDelay ? "text-warning" : isClear ? "text-success" : "text-muted"}`}
                    >
                      {log.status.toUpperCase().replace("_", " ")}
                    </Text>
                    <Text className="text-[10px] font-bold font-mono tabular-nums text-muted">
                      {formatTime(log.timestamp)}
                    </Text>
                  </View>
                  <Text className="text-[11px] leading-snug text-foreground">
                    {log.note}
                  </Text>
                  <Text className="text-[9px] font-extrabold text-muted">
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
