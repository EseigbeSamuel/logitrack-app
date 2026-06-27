import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, TextInput, Pressable, ScrollView, 
   KeyboardAvoidingView, Platform 
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useLogiTrack } from '@/store/logitrack-store';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useThemeColors();
  const { shipments, chats, sendMessage, activeRole } = useLogiTrack();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const shipment = shipments.find(s => s.id === id);
  const messages = chats[id as string] || [];

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  if (!shipment) {
    return (
      <View className="flex-1 bg-background bg-background">
        <Text className="text-center mt-10 font-extrabold text-danger text-danger">Comms channel not found.</Text>
      </View>
    );
  }

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(shipment.id, inputText.trim());
      setInputText('');
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-background bg-background" 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen 
        options={{
          title: `COMMS: ${shipment.id}`,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.primary,
          headerTitleStyle: { fontWeight: '900' },
        }} 
      />

      <ScrollView 
        ref={scrollViewRef}
        className="flex-1"
        contentContainerClassName="p-4 gap-3"
      >
        {messages.length === 0 ? (
          <View className="align-center mt-10">
            <Text className="text-xs font-bold text-muted text-muted">End-to-end encrypted channel established.</Text>
          </View>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderRole === activeRole;
            return (
              <View 
                key={msg.id} 
                className={`max-w-[80%] p-3 rounded-lg ${isMe ? "self-end bg-primary" : "self-start border bg-card border-border"}`}
              >
                <Text className={`text-sm font-semibold ${isMe ? 'text-[#18181B]' : 'text-foreground'}`}>
                  {msg.text}
                </Text>
                <Text className="text-[9px] font-extrabold mt-1 self-end text-muted text-muted">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>

      <View className="flex-row p-3 gap-2 border-t bg-card border-border bg-card border-border">
        <TextInput
          className="flex-1 border rounded-full px-4 py-2.5 text-sm font-semibold bg-background border-border text-foreground bg-background border-border text-foreground"
          value={inputText}
          onChangeText={setInputText}
          placeholder="Transmit message..."
          placeholderTextColor={theme.muted}
          onSubmitEditing={handleSend}
        />
        <Pressable 
          className={`w-10 h-10 rounded-full items-center justify-center ${!inputText.trim() ? 'bg-card' : 'bg-primary'}`} 
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <IconSymbol name="paperplane.fill" size={20} color={inputText.trim() ? theme.primaryText : theme.muted} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

