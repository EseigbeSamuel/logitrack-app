import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import React from "react";
import { Platform } from "react-native";
import { useThemeColors } from "@/hooks/use-theme-colors";

export default function TabLayout() {
  const theme = useThemeColors();

  return (
    <NativeTabs tintColor={theme.primary}>
      <NativeTabs.Trigger name="index">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="shipments">
        <Icon sf="shippingbox.fill" />
        <Label>Logistics</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="chat">
        <Icon sf="bubble.left.and.bubble.right.fill" />
        <Label>Comms</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Icon sf="person.fill" />
        <Label>Terminal</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
