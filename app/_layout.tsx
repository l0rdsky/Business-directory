import { Stack, router } from "expo-router";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from "react";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { View } from 'react-native';
import LoginScreen from '@/components/LoginScreen';
import * as SecureStore from "expo-secure-store";
SplashScreen.preventAutoHideAsync();
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};
export default function RootLayout() {

  const [fontsLoaded, fontError] =  useFonts({
    'outfit': require('@/assets/fonts/Outfit-Regular.ttf'),
    'outfit-bold': require('@/assets/fonts/Outfit-Bold.ttf'),
    'outfit-medium': require('@/assets/fonts/Outfit-Medium.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ClerkProvider 
    tokenCache={tokenCache}
     publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string}>
      <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
        <SignedIn>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </SignedIn>
        <SignedOut>
          <LoginScreen />
        </SignedOut>
      </View>
    </ClerkProvider>
  );
}
