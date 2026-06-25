import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { LogiTrackProvider } from "@/store/logitrack-store";

export const unstable_settings = {
  anchor: "(tabs)",
};

const LogiTrackDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#CCFF00',
    background: '#18181B',
    card: '#27272A',
    text: '#FAFAFA',
    border: '#3F3F46',
    notification: '#EF4444',
  },
};

const LogiTrackLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#CCFF00', // Neon green accent
    background: '#FAFAFA',
    card: '#FFFFFF',
    text: '#18181B',
    border: '#E4E4E7',
    notification: '#EF4444',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? LogiTrackDarkTheme : LogiTrackLightTheme;

  return (
    <LogiTrackProvider>
      <ThemeProvider value={theme}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text,
            headerTitleStyle: { fontWeight: 'bold' },
            headerShadowVisible: false,
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
              headerBackTitle: "Back",
            }}
          />
        </Stack>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </ThemeProvider>
    </LogiTrackProvider>
  );
}
