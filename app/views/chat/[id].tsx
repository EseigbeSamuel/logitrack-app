import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, TextInput, Pressable, ScrollView, 
  StyleSheet, KeyboardAvoidingView, Platform 
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
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.danger }]}>Comms channel not found.</Text>
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
      style={[styles.container, { backgroundColor: theme.background }]} 
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
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.muted }]}>End-to-end encrypted channel established.</Text>
          </View>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderRole === activeRole;
            return (
              <View 
                key={msg.id} 
                style={[
                  styles.messageBubble, 
                  isMe ? [styles.messageBubbleMe, { backgroundColor: theme.primary }] : [styles.messageBubbleOther, { backgroundColor: theme.card, borderColor: theme.border }]
                ]}
              >
                <Text style={[
                  styles.messageText,
                  isMe ? [styles.messageTextMe, { color: theme.primaryText }] : [styles.messageTextOther, { color: theme.text }]
                ]}>
                  {msg.text}
                </Text>
                <Text style={[styles.messageTime, { color: theme.muted }]}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>

      <View style={[styles.inputContainer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Transmit message..."
          placeholderTextColor={theme.muted}
          onSubmitEditing={handleSend}
        />
        <Pressable 
          style={[styles.sendButton, { backgroundColor: theme.primary }, !inputText.trim() && [styles.sendButtonDisabled, { backgroundColor: theme.card }]]} 
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <IconSymbol name="paperplane.fill" size={20} color={inputText.trim() ? theme.primaryText : theme.muted} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 40,
    fontWeight: '800',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '700',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 8,
    borderCurve: 'continuous',
  },
  messageBubbleMe: {
    alignSelf: 'flex-end',
  },
  messageBubbleOther: {
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  messageTextMe: {
  },
  messageTextOther: {
  },
  messageTime: {
    fontSize: 9,
    fontWeight: '800',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
  },
});
