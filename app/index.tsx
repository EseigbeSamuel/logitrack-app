import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useLogiTrack } from '@/store/logitrack-store';
import { View } from 'react-native';

export default function Index() {
  const { isAuthenticated, hasSeenOnboarding } = useLogiTrack();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <View style={{ flex: 1, backgroundColor: '#18181B' }} />;

  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth/sign-in" />;
  }

  return <Redirect href="/(tabs)" />;
}
