import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useLogiTrack } from "@/store/logitrack-store";
import { useRouter } from "expo-router";
import React from "react";
import {
  Appearance,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { activeRole, riderStats, shipments, logout, deleteAccount } =
    useLogiTrack();
  const theme = useThemeColors();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const totalCustomerShipments = shipments.length;
  const totalCustomerSpent = shipments.reduce((sum, s) => sum + s.price, 0);

  const activeShipmentsCount = shipments.filter(
    (s) => s.status !== "delivered",
  ).length;

  const toggleTheme = () => {
    Appearance.setColorScheme(isDarkMode ? "light" : "dark");
  };

  const handleLogout = () => {
    logout();
    router.replace("/auth/sign-in" as any);
  };

  const handleDeleteAccount = () => {
    deleteAccount();
    router.replace("/auth/sign-up" as any);
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 gap-4 pt-16 pb-10"
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="mb-2">
        <Text className="text-[22px] font-black tracking-widest text-foreground">
          LOGITRACK TERMINAL
        </Text>
        <Text className="text-xs font-semibold mt-1 uppercase text-muted">
          System Control & User Configuration
        </Text>
      </View>

      {/* Operator Metadata Card */}
      <View className="border rounded-lg p-4 gap-3 shadow-md bg-card border-border">
        <Text className="text-xs font-black tracking-[1.5px] text-primary">
          OPERATOR PROFILE
        </Text>
        <View className="flex-row items-center gap-4">
          <View className="w-[54px] h-[54px] rounded-lg items-center justify-center bg-primary">
            <Text className="font-black text-lg text-[#18181B]">MV</Text>
          </View>
          <View className="flex-1 gap-0.5">
            <Text className="text-base font-extrabold text-foreground">
              Marcus Vance
            </Text>
            <Text className="text-[11px] font-semibold text-muted font-mono tabular-nums">
              ROLE: {activeRole.toUpperCase()}
            </Text>
            <Text className="text-[11px] font-semibold text-muted">
              HQ Center: San Francisco Logistics
            </Text>
          </View>
        </View>
      </View>

      {/* Role-Specific Stats Dashboard */}
      {activeRole === "customer" ? (
        <View className="border rounded-lg p-4 gap-3 shadow-md bg-card border-border">
          <Text className="text-xs font-black tracking-[1.5px] text-primary">
            CUSTOMER OVERVIEW
          </Text>

          <View className="flex-row gap-3">
            <View className="flex-1 border rounded-md p-3 gap-1 bg-background border-border">
              <Text className="text-[10px] font-extrabold tracking-wider text-muted">
                TOTAL BOOKINGS
              </Text>
              <Text className="text-xl font-black text-foreground font-mono tabular-nums">
                {totalCustomerShipments}
              </Text>
            </View>
            <View className="flex-1 border rounded-md p-3 gap-1 bg-background border-border">
              <Text className="text-[10px] font-extrabold tracking-wider text-muted">
                ACTIVE RUNS
              </Text>
              <Text className="text-xl font-black font-mono tabular-nums text-[#3B82F6]">
                {activeShipmentsCount}
              </Text>
            </View>
          </View>

          <View className="flex-1 border rounded-md p-3 gap-1 bg-background border-border mt-3 w-full">
            <Text className="text-[10px] font-extrabold tracking-wider text-muted">
              LOGISTICS ACCUMULATED SPEND
            </Text>
            <Text className="text-xl font-black font-mono tabular-nums text-primary">
              ${totalCustomerSpent.toFixed(2)}
            </Text>
          </View>
        </View>
      ) : (
        <View className="border rounded-lg p-4 gap-3 shadow-md bg-card border-border">
          <Text className="text-xs font-black tracking-[1.5px] text-primary">
            RIDER PERFORMANCE
          </Text>

          <View className="flex-row gap-3">
            <View className="flex-1 border rounded-md p-3 gap-1 bg-background border-border">
              <Text className="text-[10px] font-extrabold tracking-wider text-muted">
                DUTY STATUS
              </Text>
              <View className="flex-row items-center gap-2 mt-1">
                <View
                  className={`w-2.5 h-2.5 rounded-full ${riderStats.isOnline ? "bg-success" : "bg-muted"}`}
                />
                <Text
                  className={`text-base font-black ${riderStats.isOnline ? "text-success" : "text-muted"}`}
                >
                  {riderStats.isOnline ? "ONLINE" : "OFFLINE"}
                </Text>
              </View>
            </View>
            <View className="flex-1 border rounded-md p-3 gap-1 bg-background border-border">
              <Text className="text-[10px] font-extrabold tracking-wider text-muted">
                TRIPS COMPLETED
              </Text>
              <Text className="text-xl font-black text-foreground font-mono tabular-nums">
                {riderStats.completedTasks}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 border rounded-md p-3 gap-1 bg-background border-border">
              <Text className="text-[10px] font-extrabold tracking-wider text-muted">
                HOURS LOGGED
              </Text>
              <Text className="text-xl font-black text-foreground font-mono tabular-nums">
                {riderStats.hoursOnline}h
              </Text>
            </View>
            <View className="flex-1 border rounded-md p-3 gap-1 bg-background border-border">
              <Text className="text-[10px] font-extrabold tracking-wider text-muted">
                TOTAL EARNINGS
              </Text>
              <Text className="text-xl font-black font-mono tabular-nums text-primary">
                ${riderStats.earnings.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Theme Controls */}
      <View className="border rounded-lg p-4 gap-3 shadow-md bg-card border-border">
        <Text className="text-xs font-black tracking-[1.5px] text-primary">
          APPEARANCE
        </Text>
        <Text className="text-xs leading-4 text-muted">
          Toggle the interface appearance between active Dark Mode and Light
          Mode configurations.
        </Text>
        <Pressable
          className="border py-3 px-4 items-center justify-center rounded-md flex-row gap-2 bg-background border-border"
          onPress={toggleTheme}
        >
          <IconSymbol
            name={isDarkMode ? "checkmark.circle.fill" : "circle"}
            size={18}
            color={theme.text}
          />
          <Text className="text-xs font-extrabold tracking-wider text-foreground">
            {isDarkMode ? "DARK MODE ENABLED" : "SWITCH TO DARK MODE"}
          </Text>
        </Pressable>
      </View>

      {/* Auth Controls */}
      <View className="border rounded-lg p-4 gap-3 shadow-md bg-card border-border">
        <Text className="text-xs font-black tracking-[1.5px] text-primary">
          SESSION CONTROLS
        </Text>
        <Pressable
          className="border py-3 px-4 items-center justify-center rounded-md flex-row gap-2 bg-background border-border mb-2"
          onPress={handleLogout}
        >
          <Text className="text-xs font-extrabold tracking-wider text-foreground">
            LOG OUT OF TERMINAL
          </Text>
        </Pressable>
        <Pressable
          className="border py-3 items-center justify-center rounded-md bg-[#EF44441F] border-danger"
          onPress={handleDeleteAccount}
        >
          <Text className="text-xs font-black tracking-wider text-danger">
            DELETE ACCOUNT DATA
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
