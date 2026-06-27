import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useLogiTrack } from "@/store/logitrack-store";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const {
    activeRole,
    shipments,
    riderStats,
    toggleOnline,
    updateShipmentStatus,
  } = useLogiTrack();
  const theme = useThemeColors();

  const [searchId, setSearchId] = useState("");

  const handleSearch = () => {
    if (!searchId.trim()) return;
    const formattedId = searchId.trim().toUpperCase();
    const found = shipments.find((s) => s.id === formattedId);
    if (found) {
      router.push(`/views/shipment/${found.id}` as any);
      setSearchId("");
    } else {
      alert(`Logistics route '${formattedId}' not found in active registries.`);
    }
  };

  // Customer statistics
  const activeCustomerShipments = shipments.filter(
    (s) => s.status !== "delivered",
  );
  const completedCustomerShipments = shipments.filter(
    (s) => s.status === "delivered",
  );

  // Rider: Find active assigned shipment
  const activeRiderShipment = shipments.find(
    (s) =>
      s.driverId === "DRV-101" &&
      (s.status === "picked_up" || s.status === "in_transit"),
  );

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 gap-4 pt-16 pb-10"
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* Header Bar */}
      <View className="flex-row items-center justify-between mb-2">
        <View>
          <Text className="text-[10px] text-muted font-extrabold tracking-[1.5px]">
            {activeRole === "customer"
              ? "CLIENT COMMAND PANEL"
              : "COURIER TERMINAL"}
          </Text>
          <Text className="text-[22px] font-black text-foreground tracking-widest">
            {activeRole === "customer" ? "LOGITRACK CENTER" : "OPERATOR SHIFT"}
          </Text>
        </View>
        <View className="bg-card border border-border px-2.5 py-1.5 rounded">
          <Text className="text-primary text-[11px] font-black font-mono tabular-nums">
            {activeRole === "customer" ? "LEVEL-01" : "DRV-101"}
          </Text>
        </View>
      </View>

      {/* Customer Mode View */}
      {activeRole === "customer" && (
        <View className="gap-4">
          {/* Tracking Search Input */}
          <View className="bg-card border border-border rounded-lg p-4 gap-3">
            <Text className="text-[11px] font-black text-primary tracking-[1.5px]">
              FAST TRACK LOGISTICS ROUTE
            </Text>
            <View className="flex-row gap-2">
              <TextInput
                className="flex-1 bg-background border border-border rounded-md text-foreground px-3 py-2.5 text-sm font-bold font-mono tabular-nums"
                value={searchId}
                onChangeText={setSearchId}
                placeholder="ENTER ID (E.G. LT-1029)"
                placeholderTextColor={theme.muted}
                autoCapitalize="characters"
                onSubmitEditing={handleSearch}
              />
              <Pressable
                className="bg-[#FAFAFA] px-4 items-center justify-center rounded-md"
                onPress={handleSearch}
              >
                <Text className="text-[#18181B] text-xs font-black tracking-wider">
                  LOCATE
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Quick Actions & Metrics */}
          <View className="flex-row gap-3">
            <View
              className="flex-1 border border-border rounded-lg p-4 gap-1.5 bg-card"
              style={{ backgroundColor: theme.card }}
            >
              <Text className="text-[10px] font-extrabold text-muted tracking-wider">
                IN-ROUTE CARGO
              </Text>
              <Text className="text-2xl font-black text-foreground font-mono tabular-nums">
                {activeCustomerShipments.length}
              </Text>
            </View>
            <View
              className="flex-1 border border-border rounded-lg p-4 gap-1.5 bg-card"
              style={{ backgroundColor: theme.card }}
            >
              <Text className="text-[10px] font-extrabold text-muted tracking-wider">
                COMPLETED RUNS
              </Text>
              <Text className="text-2xl font-black text-success font-mono tabular-nums">
                {completedCustomerShipments.length}
              </Text>
            </View>
          </View>

          {/* Book Cargo CTA */}
          <Pressable
            className="bg-primary py-3.5 rounded-lg flex-row items-center justify-center gap-2"
            onPress={() => router.push("/views/book-shipment" as any)}
          >
            <IconSymbol name="plus.circle.fill" size={20} color="#18181B" />
            <Text className="text-[#18181B] font-black text-[13px] tracking-wider">
              SCHEDULE NEW CARGO DELIVERY
            </Text>
          </Pressable>

          {/* Visual Tracking Map Widget */}
          <View className="bg-card border border-border rounded-lg p-4 gap-3">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-[11px] font-black text-primary tracking-[1.5px]">
                REAL-TIME SECTOR MAP
              </Text>
              <View className="flex-row items-center gap-1.5">
                <View className="w-1.5 h-1.5 rounded-full bg-danger" />
                <Text className="text-danger text-[9px] font-extrabold tracking-wider">
                  GPS FEEDS ACTIVE
                </Text>
              </View>
            </View>

            {/* Tactical Grid Map Mockup */}
            <View className="h-[180px] bg-background border border-border rounded-md relative overflow-hidden">
              <View className="absolute left-0 right-0 h-[0.5px] bg-[#3F3F4640]" />
              <View
                className="absolute left-0 right-0 h-[0.5px] bg-[#3F3F4640]"
                style={{ top: "33%" }}
              />
              <View
                className="absolute left-0 right-0 h-[0.5px] bg-[#3F3F4640]"
                style={{ top: "66%" }}
              />
              <View className="absolute top-0 bottom-0 w-[0.5px] bg-[#3F3F4640]" />
              <View
                className="absolute top-0 bottom-0 w-[0.5px] bg-[#3F3F4640]"
                style={{ left: "33%" }}
              />
              <View
                className="absolute top-0 bottom-0 w-[0.5px] bg-[#3F3F4640]"
                style={{ left: "66%" }}
              />

              {/* Sender Node */}
              <View
                className="absolute flex-row items-center gap-1 border border-[#71717A] bg-background rounded px-1 py-0.5"
                style={{ top: "70%", left: "25%" }}
              >
                <View className="w-1.5 h-1.5 rounded-full bg-[#71717A]" />
                <Text className="text-[9px] font-extrabold text-muted">
                  SND (SF)
                </Text>
              </View>

              {/* Transit Path Line */}
              <View className="absolute top-[32%] left-[30%] w-[42%] h-[38px] border-l-[1.5px] border-b-[1.5px] border-dashed border-primary" />

              {/* Driver Courier Pin */}
              <View
                className="absolute flex-row items-center gap-1 border border-[#71717A] bg-background rounded px-1 py-0.5"
                style={{ top: "42%", left: "52%", borderColor: "#CCFF00" }}
              >
                <View
                  className="w-1.5 h-1.5 rounded-full bg-[#71717A]"
                  style={{ backgroundColor: theme.primary }}
                />
                <Text
                  className="text-[9px] font-extrabold text-muted"
                  style={{ color: theme.primary }}
                >
                  COURIER
                </Text>
              </View>

              {/* Recipient Node */}
              <View
                className="absolute flex-row items-center gap-1 border border-[#71717A] bg-background rounded px-1 py-0.5"
                style={{ top: "20%", left: "75%", borderColor: "#60A5FA" }}
              >
                <View
                  className="w-1.5 h-1.5 rounded-full bg-[#71717A]"
                  style={{ backgroundColor: "#60A5FA" }}
                />
                <Text
                  className="text-[9px] font-extrabold text-muted"
                  style={{ color: "#60A5FA" }}
                >
                  REC (SJ)
                </Text>
              </View>
            </View>
            <Text className="text-[10px] text-muted text-center">
              Coordinates: 37.7749° N, 122.4194° W — Terminal status nominal.
            </Text>
          </View>

          {/* Active Shipments Carousel/List */}
          <Text className="text-xs font-black text-foreground tracking-[1.5px] mt-2">
            ACTIVE CONSIGNMENTS
          </Text>
          {activeCustomerShipments.length > 0 ? (
            activeCustomerShipments.slice(0, 2).map((item) => (
              <Pressable
                key={item.id}
                className="bg-card border border-border rounded-lg p-4 gap-3"
                onPress={() => router.push(`/views/shipment/${item.id}` as any)}
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-black text-foreground font-mono tabular-nums">
                    {item.id}
                  </Text>
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
                  <View className="flex-row items-center gap-1.5 bg-[#EF44441F] border border-[#EF444433] py-2 px-2.5 rounded">
                    <IconSymbol
                      name="exclamationmark.triangle.fill"
                      size={14}
                      color="#EAB308"
                    />
                    <Text className="text-danger text-[10px] font-extrabold tracking-wider">
                      DELAY REPORTED: {item.delayReason}
                    </Text>
                  </View>
                )}

                <View className="gap-1.5">
                  <View className="flex-row justify-between">
                    <Text className="text-[9px] font-bold text-muted">
                      DESTINATION
                    </Text>
                    <Text
                      className="text-[11px] font-extrabold text-foreground max-w-[70%]"
                      numberOfLines={1}
                    >
                      {item.recipientAddress}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-[9px] font-bold text-muted">
                      CARGO TYPE
                    </Text>
                    <Text className="text-[11px] font-extrabold text-foreground max-w-[70%]">
                      {item.packageCategory} ({item.weight} kg)
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))
          ) : (
            <View className="bg-[#1E1E20] border border-[#2D2D30] rounded-lg p-6 items-center justify-center">
              <Text className="text-muted text-xs font-semibold text-center">
                No active cargo routes currently operating.
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Driver/Rider Mode View */}
      {activeRole === "rider" && (
        <View className="gap-4">
          {/* Duty Control Card */}
          <View className="bg-card border border-border rounded-lg p-4 gap-3">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-[11px] font-black text-primary tracking-[1.5px]">
                  COURIER DUTY STATUS
                </Text>
                <Text
                  className="text-xs font-extrabold mt-1"
                  style={{ color: riderStats.isOnline ? "#10B981" : "#71717A" }}
                >
                  {riderStats.isOnline
                    ? "ONLINE — ACCEPTING DISPATCHES"
                    : "OFFLINE — SHIFT CLOSED"}
                </Text>
              </View>
              <Pressable
                className={`w-[54px] h-[30px] rounded-full p-[3px] justify-center border ${riderStats.isOnline ? "bg-primary border-primary" : "bg-background border-border"}`}
                onPress={toggleOnline}
              >
                <View
                  className={`w-6 h-6 rounded-full ${riderStats.isOnline ? "bg-background self-end" : "bg-[#71717A] self-start"}`}
                />
              </Pressable>
            </View>
          </View>

          {/* Earnings / Stats Widgets */}
          <View className="flex-row gap-2">
            <View className="flex-1 bg-card border border-border rounded-lg p-3 gap-1">
              <Text className="text-[9px] font-extrabold text-muted">
                SHIFT EARNINGS
              </Text>
              <Text className="text-xl font-black text-primary font-mono tabular-nums">
                ${riderStats.earnings.toFixed(2)}
              </Text>
            </View>
            <View className="flex-1 bg-card border border-border rounded-lg p-3 gap-1">
              <Text className="text-[9px] font-extrabold text-muted">
                TRIPS
              </Text>
              <Text className="text-xl font-black text-foreground font-mono tabular-nums">
                {riderStats.completedTasks}
              </Text>
            </View>
            <View className="flex-1 bg-card border border-border rounded-lg p-3 gap-1">
              <Text className="text-[9px] font-extrabold text-muted">
                DUTY HOURS
              </Text>
              <Text className="text-xl font-black text-foreground font-mono tabular-nums">
                {riderStats.hoursOnline}h
              </Text>
            </View>
          </View>

          {/* Active Rider Task */}
          <Text className="text-xs font-black text-foreground tracking-[1.5px] mt-2">
            ACTIVE LOGISTICS ASSIGNMENT
          </Text>
          {activeRiderShipment ? (
            <View className="bg-card border border-border rounded-lg p-4 gap-3">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-[9px] font-extrabold text-primary tracking-wider">
                    ACTIVE ROUTE
                  </Text>
                  <Text className="text-lg font-black text-foreground font-mono tabular-nums">
                    {activeRiderShipment.id}
                  </Text>
                </View>
                <Pressable
                  className="p-1.5 bg-background rounded border border-border"
                  onPress={() =>
                    router.push(
                      `/views/shipment/${activeRiderShipment.id}` as any,
                    )
                  }
                >
                  <IconSymbol
                    name="info.circle.fill"
                    size={20}
                    color="#CCFF00"
                  />
                </Pressable>
              </View>

              {activeRiderShipment.delayReason && (
                <View
                  className="flex-row items-center gap-1.5 bg-[#EF44441F] border border-[#EF444433] py-2 px-2.5 rounded"
                  style={{
                    backgroundColor: "#EAB3081A",
                    borderColor: "#EAB30833",
                  }}
                >
                  <IconSymbol
                    name="exclamationmark.triangle.fill"
                    size={14}
                    color="#EAB308"
                  />
                  <Text
                    className="text-danger text-[10px] font-extrabold tracking-wider"
                    style={{ color: "#EAB308" }}
                  >
                    ACTIVE DELAY: {activeRiderShipment.delayReason}
                  </Text>
                </View>
              )}

              <View className="gap-3 bg-background p-3 rounded-md border border-border">
                <View className="flex-row gap-2.5">
                  <View
                    className="w-2 h-2 rounded-full mt-1"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <View className="flex-1 gap-0.5">
                    <Text className="text-[8px] font-extrabold text-muted">
                      ORIGIN PICKUP
                    </Text>
                    <Text className="text-xs text-foreground font-semibold">
                      {activeRiderShipment.senderAddress}
                    </Text>
                  </View>
                </View>
                <View className="flex-row gap-2.5">
                  <View
                    className="w-2 h-2 rounded-full mt-1"
                    style={{ backgroundColor: "#60A5FA" }}
                  />
                  <View className="flex-1 gap-0.5">
                    <Text className="text-[8px] font-extrabold text-muted">
                      DESTINATION DROP
                    </Text>
                    <Text className="text-xs text-foreground font-semibold">
                      {activeRiderShipment.recipientAddress}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="h-px bg-border" />

              <View className="flex-row justify-between">
                <View>
                  <Text className="text-[9px] font-bold text-muted">
                    CARGO CATEGORY
                  </Text>
                  <Text className="text-xs font-extrabold text-foreground mt-0.5">
                    {activeRiderShipment.packageCategory}
                  </Text>
                </View>
                <View>
                  <Text className="text-[9px] font-bold text-muted">
                    TALLY WEIGHT
                  </Text>
                  <Text className="text-xs font-extrabold text-foreground mt-0.5 font-mono tabular-nums">
                    {activeRiderShipment.weight} KG
                  </Text>
                </View>
              </View>

              {/* Context Actions */}
              {activeRiderShipment.status === "picked_up" ? (
                <Pressable
                  className="bg-primary py-3 rounded-md flex-row items-center justify-center gap-1.5"
                  onPress={() =>
                    updateShipmentStatus(
                      activeRiderShipment.id,
                      "in_transit",
                      "Departed distribution depot en route.",
                    )
                  }
                >
                  <IconSymbol name="car.fill" size={18} color="#18181B" />
                  <Text className="text-[#18181B] font-black text-xs">
                    DEPART ON ROUTE (IN TRANSIT)
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  className="bg-primary py-3 rounded-md flex-row items-center justify-center gap-1.5"
                  style={{ backgroundColor: "#10B981" }}
                  onPress={() =>
                    updateShipmentStatus(
                      activeRiderShipment.id,
                      "delivered",
                      "Package handed over and signature confirmed.",
                    )
                  }
                >
                  <IconSymbol
                    name="checkmark.circle.fill"
                    size={18}
                    color="#18181B"
                  />
                  <Text className="text-[#18181B] font-black text-xs">
                    CONFIRM CARGO HANDOVER
                  </Text>
                </Pressable>
              )}
            </View>
          ) : (
            <View className="bg-[#1E1E20] border border-[#2D2D30] rounded-lg p-6 items-center justify-center gap-2">
              <Text className="text-foreground text-sm font-black tracking-wider">
                NO ACTIVE TRANSIT ROUTE
              </Text>
              <Text className="text-muted text-[11px] font-semibold text-center leading-4 px-3">
                Set duty to ONLINE and accept cargo routes from the Logistics
                Board.
              </Text>
              <Pressable
                className="bg-card border border-border py-2 px-4 rounded-md mt-2"
                onPress={() => router.push("/shipments" as any)}
              >
                <Text className="text-primary text-[11px] font-extrabold">
                  VIEW LOGISTICS BOARD
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}
