import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useLogiTrack } from '@/store/logitrack-store';
import { useThemeColors } from '@/hooks/use-theme-colors';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'COMMAND YOUR LOGISTICS',
    subtitle: 'Track, manage, and execute complex delivery routes from a single high-performance terminal.',
  },
  {
    id: '2',
    title: 'REAL-TIME OPERATIONS',
    subtitle: 'Live map tracking, dynamic route assignment, and instantaneous dispatch updates.',
  },
  {
    id: '3',
    title: 'JOIN THE GRID',
    subtitle: 'Log in to sync your command center and commence field operations.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useLogiTrack();
  const theme = useThemeColors();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / width);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const nextSlide = () => {
    if (currentIndex < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (currentIndex + 1) * width, animated: true });
    } else {
      completeOnboarding();
      router.replace('/auth/sign-in' as any);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {SLIDES.map((slide, index) => (
          <View key={slide.id} style={styles.slide}>
            <View style={[styles.visualMockup, { backgroundColor: theme.card, borderColor: theme.border }]}>
              {/* Abstract decorative element representing the app UI */}
              <View style={[styles.mockElementLarge, { backgroundColor: theme.background }]} />
              <View style={[styles.mockElementSmall, { backgroundColor: theme.border }]} />
              <View style={[styles.mockElementSmall, { width: '40%', backgroundColor: theme.border }]} />
              <View style={[styles.accentLine, { backgroundColor: theme.primary }]} />
            </View>

            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: theme.text }]}>{slide.title}</Text>
              <Text style={[styles.subtitle, { color: theme.muted }]}>{slide.subtitle}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot, { backgroundColor: theme.border },
                index === currentIndex && { width: 24, backgroundColor: theme.primary },
              ]}
            />
          ))}
        </View>

        <Pressable style={[styles.button, { backgroundColor: theme.primary }]} onPress={nextSlide}>
          <Text style={[styles.buttonText, { color: theme.primaryText }]}>
            {currentIndex === SLIDES.length - 1 ? 'INITIALIZE TERMINAL' : 'NEXT PROTOCOL'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    height: height * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  visualMockup: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    borderCurve: 'continuous',
    borderWidth: 1,
    padding: 24,
    justifyContent: 'flex-end',
    marginBottom: 40,
    overflow: 'hidden',
  },
  mockElementLarge: {
    width: '100%',
    height: 80,
    borderRadius: 4,
    marginBottom: 12,
  },
  mockElementSmall: {
    width: '70%',
    height: 20,
    borderRadius: 4,
    marginBottom: 12,
  },
  accentLine: {
    position: 'absolute',
    top: 0,
    left: 24,
    width: 2,
    height: '100%',
  },
  textContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 48,
    gap: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 8,
    borderCurve: 'continuous',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
});
