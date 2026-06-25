import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useLogiTrack } from '@/store/logitrack-store';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function ChatScreen() {
  const router = useRouter();
  const theme = useThemeColors();
  const { shipments, chats, activeRole } = useLogiTrack();

  const activeShipments = activeRole === 'customer' 
    ? shipments.filter(s => s.status !== 'delivered')
    : shipments.filter(s => s.driverId === 'DRV-101' && (s.status === 'picked_up' || s.status === 'in_transit'));

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>ACTIVE COMMS</Text>
      </View>

      {activeShipments.length > 0 ? (
        activeShipments.map((shipment) => {
          const shipmentChats = chats[shipment.id] || [];
          const latestMessage = shipmentChats[shipmentChats.length - 1];

          return (
            <Pressable
              key={shipment.id}
              style={[styles.chatCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push(`/views/chat/${shipment.id}` as any)}
            >
              <View style={styles.chatHeader}>
                <Text style={[styles.shipmentId, { color: theme.primary }]}>{shipment.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: theme.background }]}>
                  <Text style={[styles.statusBadgeText, { color: theme.muted }]}>
                    {shipment.status.toUpperCase().replace('_', ' ')}
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.chatPreview, { color: theme.text }]} numberOfLines={1}>
                {latestMessage ? latestMessage.text : 'No messages yet. Tap to start comms.'}
              </Text>
              
              {latestMessage && (
                <Text style={[styles.timestamp, { color: theme.muted }]}>
                  {new Date(latestMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              )}
            </Pressable>
          );
        })
      ) : (
        <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.emptyText, { color: theme.muted }]}>No active comms channels.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
  },
  chatCard: {
    borderWidth: 1,
    borderRadius: 8,
    borderCurve: 'continuous',
    padding: 16,
    gap: 8,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shipmentId: {
    fontSize: 14,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  chatPreview: {
    fontSize: 13,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 10,
    fontWeight: '700',
    alignSelf: 'flex-end',
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
