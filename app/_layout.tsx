import { PortalHost } from "@/components/primitives/portal";
import { DatabaseProvider } from "@/db/provider";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";
import { NAV_THEME } from "@/lib/constants";
import { getItem, setItem } from "@/lib/storage";
import { useColorScheme } from "@/lib/useColorScheme";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
// @ts-expect-error
import { ThemeProvider, type Theme } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import * as React from "react";
import { Platform } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./global.css";
const NAV_FONT_FAMILY = "Inter";
const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
  fonts: {
    regular: {
      fontFamily: NAV_FONT_FAMILY,
      fontWeight: "400",
    },
    medium: {
      fontFamily: NAV_FONT_FAMILY,
      fontWeight: "500",
    },
    bold: {
      fontFamily: NAV_FONT_FAMILY,
      fontWeight: "700",
    },
    heavy: {
      fontFamily: NAV_FONT_FAMILY,
      fontWeight: "800",
    },
  },
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
  fonts: {
    regular: {
      fontFamily: NAV_FONT_FAMILY,
      fontWeight: "400",
    },
    medium: {
      fontFamily: NAV_FONT_FAMILY,
      fontWeight: "500",
    },
    bold: {
      fontFamily: NAV_FONT_FAMILY,
      fontWeight: "700",
    },
    heavy: {
      fontFamily: NAV_FONT_FAMILY,
      fontWeight: "800",
    },
  },
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const theme = getItem("theme");
      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add("bg-background");
      }
      if (!theme) {
        setAndroidNavigationBar(colorScheme);
        setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      setAndroidNavigationBar(colorTheme);
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);

        setIsColorSchemeLoaded(true);
        return;
      }
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <>
      <DatabaseProvider>
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          <SystemBars style={isDarkColorScheme ? "light" : "dark"} />
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <Stack >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen options={{
                  headerShadowVisible: false,
                }} name="habits/archive" />
                <Stack.Screen options={{
                  headerShadowVisible: false,
                }} name="habits/[id]" />
              </Stack>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </DatabaseProvider>
      <PortalHost />
    </>

  );
}
