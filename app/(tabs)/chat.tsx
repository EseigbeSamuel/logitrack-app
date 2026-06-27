import React from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useLogiTrack } from '@/store/logitrack-store';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ChatScreen() {
  const router = useRouter();
  const { shipments, chats, activeRole } = useLogiTrack();

  const activeShipments = activeRole === 'customer' 
    ? shipments.filter(s => s.status !== 'delivered')
    : shipments.filter(s => s.driverId === 'DRV-101' && (s.status === 'picked_up' || s.status === 'in_transit'));

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 gap-4"
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="mb-2">
        <Text className="text-2xl font-black tracking-widest text-foreground">ACTIVE COMMS</Text>
      </View>

      {activeShipments.length > 0 ? (
        activeShipments.map((shipment) => {
          const shipmentChats = chats[shipment.id] || [];
          const latestMessage = shipmentChats[shipmentChats.length - 1];

          return (
            <Pressable
              key={shipment.id}
              className="border rounded-lg p-4 gap-2 bg-card border-border"
              onPress={() => router.push(`/views/chat/${shipment.id}` as any)}
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-sm font-black tabular-nums text-primary">{shipment.id}</Text>
                <View className="px-2 py-1 rounded bg-background">
                  <Text className="text-[9px] font-black tracking-wider text-muted">
                    {shipment.status.toUpperCase().replace('_', ' ')}
                  </Text>
                </View>
              </View>
              
              <Text className="text-[13px] font-semibold text-foreground" numberOfLines={1}>
                {latestMessage ? latestMessage.text : 'No messages yet. Tap to start comms.'}
              </Text>
              
              {latestMessage && (
                <Text className="text-[10px] font-bold self-end text-muted">
                  {new Date(latestMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              )}
            </Pressable>
          );
        })
      ) : (
        <View className="border rounded-lg p-6 items-center justify-center bg-card border-border">
          <Text className="text-xs font-semibold text-center text-muted">No active comms channels.</Text>
        </View>
      )}
    </ScrollView>
  );
}
