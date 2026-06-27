import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Shipment, useLogiTrack } from "@/store/logitrack-store";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function ShipmentsScreen() {
  const router = useRouter();
  const theme = useThemeColors();
  const { activeRole, shipments, acceptTask, riderStats } = useLogiTrack();

  // Sub-tabs for Riders: 'my_tasks' | 'available_tasks'
  const [riderSubTab, setRiderSubTab] = useState<
    "my_tasks" | "available_tasks"
  >("my_tasks");

  // Customer filtering: Active vs Delivered
  const customerActive = shipments.filter((s) => s.status !== "delivered");
  const customerHistory = shipments.filter((s) => s.status === "delivered");

  // Rider filtering
  const riderTasks = shipments.filter((s) => s.driverId === "DRV-101");
  const availableTasks = shipments.filter(
    (s) => s.driverId === null && s.status === "pending",
  );

  const renderShipmentCard = (item: Shipment) => {
    return (
      <Pressable
        key={item.id}
        className="border rounded-lg p-4 gap-3 bg-card border-border"
        onPress={() => router.push(`/views/shipment/${item.id}` as any)}
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-[15px] font-black font-mono tabular-nums text-foreground">
              {item.id}
            </Text>
            <Text className="text-[9px] font-extrabold mt-0.5 tracking-wider text-muted">
              {item.packageCategory.toUpperCase()} • {item.weight.toFixed(1)} KG
            </Text>
          </View>
          <View
            className={`px-2 py-1 rounded ${
              item.status === "pending"
                ? "bg-[#71717A1F]"
                : item.status === "picked_up"
                  ? "bg-[#3B82F61F]"
                  : item.status === "in_transit"
                    ? "bg-[#F59E0B1F]"
                    : "bg-[#10B9811F]"
            }`}
          >
            <Text
              className={`text-[9px] font-black tracking-wider ${
                item.status === "pending"
                  ? "text-muted"
                  : item.status === "picked_up"
                    ? "text-[#60A5FA]"
                    : item.status === "in_transit"
                      ? "text-warning"
                      : "text-success"
              }`}
            >
              {item.status.toUpperCase().replace("_", " ")}
            </Text>
          </View>
        </View>

        {item.delayReason && (
          <View className="flex-row items-center gap-1.5 border-[0.5px] py-1.5 px-2 rounded bg-[#EF44441F] border-danger">
            <IconSymbol
              name="exclamationmark.triangle.fill"
              size={12}
              color={theme.warning}
            />
            <Text className="text-[9px] font-extrabold tracking-wider text-danger">
              DELAY ALERT: {item.delayReason.toUpperCase()}
            </Text>
          </View>
        )}

        <View className="p-3 rounded-md border-[0.5px] bg-background border-border">
          <View className="flex-row items-center gap-2">
            <View className="w-1.5 h-1.5 rounded-full bg-primary" />
            <Text
              className="text-[11px] font-semibold flex-1 text-foreground"
              numberOfLines={1}
            >
              {item.senderAddress}
            </Text>
          </View>
          <View className="w-px h-2.5 ml-[2.5px] my-0.5 bg-border" />
          <View className="flex-row items-center gap-2">
            <View className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
            <Text
              className="text-[11px] font-semibold flex-1 text-foreground"
              numberOfLines={1}
            >
              {item.recipientAddress}
            </Text>
          </View>
        </View>

        <View className="">
          <Text className="text-[9px] font-bold text-muted">
            Created:{" "}
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Text className="text-sm font-black font-mono tabular-nums text-primary">
            ${item.price.toFixed(2)}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-16 pb-3 border-b ios:pt-16 border-b-card">
        <Text className="text-[22px] font-black tracking-[1.5px] text-foreground">
          {activeRole === "customer" ? "ROUTE REGISTRY" : "DISPATCH CONTROL"}
        </Text>
        <Text className="text-[11px] font-semibold mt-1 leading-4 text-muted">
          {activeRole === "customer"
            ? "Track registered consignments and histories"
            : "Manage accepted routes and open boarding tasks"}
        </Text>
      </View>

      {/* Driver/Rider Segment Tabs */}
      {activeRole === "rider" && (
        <View className="flex-row mx-4 mt-4 p-1 rounded-lg bg-card border border-border">
          <Pressable
            className={`flex-1 py-2.5 items-center justify-center rounded-md ${riderSubTab === "my_tasks" ? "bg-background border border-border" : ""}`}
            onPress={() => setRiderSubTab("my_tasks")}
          >
            <Text
              className={`text-[11px] font-black tracking-wider ${riderSubTab === "my_tasks" ? "text-primary" : "text-muted"}`}
            >
              MY TASKS ({riderTasks.length})
            </Text>
          </Pressable>

          <Pressable
            className={`flex-1 py-2.5 items-center justify-center rounded-md ${riderSubTab === "available_tasks" ? "bg-background border border-border" : ""}`}
            onPress={() => setRiderSubTab("available_tasks")}
          >
            <Text
              className={`text-[11px] font-black tracking-wider ${riderSubTab === "available_tasks" ? "text-primary" : "text-muted"}`}
            >
              DISPATCH BOARD ({availableTasks.length})
            </Text>
          </Pressable>
        </View>
      )}

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 pb-8"
        contentInsetAdjustmentBehavior="automatic"
      >
        {activeRole === "customer" ? (
          <View className="gap-3">
            {/* Active Consignments */}
            <Text className="text-[10px] font-black tracking-[1.5px] mb-1 text-muted">
              ACTIVE SHIPMENTS
            </Text>
            {customerActive.length > 0 ? (
              customerActive.map((item) => renderShipmentCard(item))
            ) : (
              <View className="border rounded-lg p-6 items-center justify-center gap-2.5 bg-card border-border">
                <Text className="text-xs font-semibold text-center text-muted">
                  No active logistics runs registered.
                </Text>
              </View>
            )}

            {/* Past Consignments */}
            <Text className="">DELIVERED RUNS</Text>
            {customerHistory.length > 0 ? (
              customerHistory.map((item) => renderShipmentCard(item))
            ) : (
              <View className="border rounded-lg p-6 items-center justify-center gap-2.5 bg-card border-border">
                <Text className="text-xs font-semibold text-center text-muted">
                  No delivery history available yet.
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View className="gap-3">
            {/* Rider My Tasks */}
            {riderSubTab === "my_tasks" && (
              <>
                {riderTasks.length > 0 ? (
                  riderTasks.map((item) => renderShipmentCard(item))
                ) : (
                  <View className="border rounded-lg p-6 items-center justify-center gap-2.5 bg-card border-border">
                    <Text className="text-xs font-semibold text-center text-muted">
                      No shipments assigned to your driver ID.
                    </Text>
                    <Pressable
                      className="border py-2 px-4 rounded-md bg-background border-border"
                      onPress={() => setRiderSubTab("available_tasks")}
                    >
                      <Text className="text-[11px] font-black text-foreground">
                        OPEN DISPATCH BOARD
                      </Text>
                    </Pressable>
                  </View>
                )}
              </>
            )}

            {/* Rider Available Tasks */}
            {riderSubTab === "available_tasks" && (
              <>
                {!riderStats.isOnline && (
                  <View className="flex-row gap-2.5 border p-3 rounded-lg items-center bg-[#F59E0B1F] border-warning">
                    <IconSymbol
                      name="exclamationmark.triangle.fill"
                      size={16}
                      color={theme.warning}
                    />
                    <Text className="text-[10px] font-bold flex-1 leading-snug text-warning">
                      You are currently OFFLINE. Toggle online duty status in
                      Dashboard or Terminal to accept routes.
                    </Text>
                  </View>
                )}

                {availableTasks.length > 0 ? (
                  availableTasks.map((item) => (
                    <View
                      key={item.id}
                      className="border rounded-lg p-4 gap-3 bg-card border-border"
                    >
                      <View className="flex-row justify-between items-center">
                        <View>
                          <Text className="text-base font-black font-mono tabular-nums text-foreground">
                            {item.id}
                          </Text>
                          <Text className="text-[9px] font-extrabold mt-0.5 tracking-wider text-muted">
                            {item.packageCategory.toUpperCase()} •{" "}
                            {item.weight.toFixed(1)} KG
                          </Text>
                        </View>
                        <Text className="text-base font-black font-mono tabular-nums text-primary">
                          ${item.price.toFixed(2)}
                        </Text>
                      </View>

                      <View className="p-3 rounded-md border-[0.5px] bg-background border-border">
                        <View className="flex-row items-center gap-2">
                          <View className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <Text
                            className="text-[11px] font-semibold flex-1 text-foreground"
                            numberOfLines={1}
                          >
                            Pickup: {item.senderAddress}
                          </Text>
                        </View>
                        <View className="w-px h-2.5 ml-[2.5px] my-0.5 bg-border" />
                        <View className="flex-row items-center gap-2">
                          <View className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                          <Text
                            className="text-[11px] font-semibold flex-1 text-foreground"
                            numberOfLines={1}
                          >
                            Dropoff: {item.recipientAddress}
                          </Text>
                        </View>
                      </View>

                      {item.notes ? (
                        <View className="border-l-2 pl-2 py-0.5 bg-[#71717A1F] border-l-muted">
                          <Text
                            className="text-[11px] italic text-muted"
                            numberOfLines={1}
                          >
                            Notes: "{item.notes}"
                          </Text>
                        </View>
                      ) : null}

                      <Pressable
                        className={`py-3 rounded-md flex-row items-center justify-center gap-1.5 ${riderStats.isOnline ? "bg-primary" : "bg-background border border-border"}`}
                        disabled={!riderStats.isOnline}
                        onPress={() => acceptTask(item.id)}
                      >
                        <IconSymbol
                          name="plus.circle.fill"
                          size={16}
                          color={theme.primaryText}
                        />
                        <Text className="text-[11px] font-black text-foreground">
                          ACCEPT ROUTE DISPATCH
                        </Text>
                      </Pressable>
                    </View>
                  ))
                ) : (
                  <View className="border rounded-lg p-6 items-center justify-center gap-2.5 bg-card border-border">
                    <Text className="text-xs font-semibold text-center text-muted">
                      Dispatch board clear. Check back later for open logistics
                      shipments.
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
