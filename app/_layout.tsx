import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, Pressable, Text } from "react-native";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { LogiTrackProvider } from "@/store/logitrack-store";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

const LogiTrackDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#CCFF00",
    background: "#18181B",
    card: "#27272A",
    text: "#FAFAFA",
    border: "#3F3F46",
    notification: "#EF4444",
  },
};

const LogiTrackLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#CCFF00", // Neon green accent
    background: "#FAFAFA",
    card: "#FFFFFF",
    text: "#18181B",
    border: "#E4E4E7",
    notification: "#EF4444",
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme =
    colorScheme === "dark" ? LogiTrackDarkTheme : LogiTrackLightTheme;
  const router = useRouter();

  const CustomBackButton = () => (
    <Pressable
      onPress={() => router.back()}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginLeft: Platform.OS === "ios" ? -12 : -4,
        paddingVertical: 4,
        paddingRight: 14,
      }}
    >
      <IconSymbol
        name="chevron.left"
        size={26}
        color={theme.colors.text}
        style={{ marginTop: Platform.OS === "android" ? 2 : 1 }}
      />
      <Text
        style={{ color: theme.colors.text, fontSize: 17, fontWeight: "600" }}
      >
        Back
      </Text>
    </Pressable>
  );

  return (
    <LogiTrackProvider>
      <ThemeProvider value={theme}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text,
            headerTitleStyle: { fontWeight: "bold" },
            headerShadowVisible: false,
            headerBackVisible: false, // We will use our custom one
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen
            name="views/book-shipment"
            options={{
              presentation: "formSheet",
              title: "Schedule Shipment",
              sheetGrabberVisible: true,
              sheetAllowedDetents: [0.9],
            }}
          />
          <Stack.Screen
            name="views/shipment/[id]"
            options={{
              title: "Logistics Tracking",
              headerLeft: () => <CustomBackButton />,
            }}
          />
          <Stack.Screen
            name="views/chat/[id]"
            options={{
              headerLeft: () => <CustomBackButton />,
            }}
          />
        </Stack>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </ThemeProvider>
    </LogiTrackProvider>
  );
}
