import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLogiTrack, PackageCategory } from '../store/logitrack-store';
import { IconSymbol } from '../components/ui/icon-symbol';

export default function BookShipmentScreen() {
  const router = useRouter();
  const { createShipment } = useLogiTrack();

  const [senderName, setSenderName] = useState('Sarah Jenkins');
  const [senderAddress, setSenderAddress] = useState('742 Evergreen Terrace, Springfield');
  const [recipientName, setRecipientName] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [packageCategory, setPackageCategory] = useState<PackageCategory>('General');
  const [weight, setWeight] = useState(2.0);
  const [notes, setNotes] = useState('');
  
  // Input focus simulation
  const [activeInput, setActiveInput] = useState<string | null>(null);

  // Pricing rule: Base $5.00 + $1.50 per kg
  const estimatedPrice = 5.00 + weight * 1.50;

  const handleBook = () => {
    if (!senderName || !senderAddress || !recipientName || !recipientAddress) {
      alert('Error: All name and address fields are required to establish a logistics route.');
      return;
    }

    createShipment({
      senderName,
      senderAddress,
      recipientName,
      recipientAddress,
      packageCategory,
      weight,
      notes: notes || undefined,
    });

    router.back();
  };

  const adjustWeight = (amount: number) => {
    setWeight((prev) => Math.max(0.1, parseFloat((prev + amount).toFixed(1))));
  };

  const categories: PackageCategory[] = ['General', 'Documents', 'Electronics', 'Food/Perishables'];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardContainer}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>BOOK LOGISTICS ROUTE</Text>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <Text style={styles.closeText}>CANCEL</Text>
          </Pressable>
        </View>

        {/* Sender Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>SENDER ORIGIN</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>SENDER NAME</Text>
            <TextInput
              style={[
                styles.textInput,
                activeInput === 'senderName' && styles.textInputActive,
              ]}
              value={senderName}
              onChangeText={setSenderName}
              placeholder="Full Name / Company"
              placeholderTextColor="#71717A"
              onFocus={() => setActiveInput('senderName')}
              onBlur={() => setActiveInput(null)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ORIGIN ADDRESS</Text>
            <TextInput
              style={[
                styles.textInput,
                activeInput === 'senderAddress' && styles.textInputActive,
              ]}
              value={senderAddress}
              onChangeText={setSenderAddress}
              placeholder="Street, City, Building Number"
              placeholderTextColor="#71717A"
              onFocus={() => setActiveInput('senderAddress')}
              onBlur={() => setActiveInput(null)}
            />
          </View>
        </View>

        {/* Recipient Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>RECIPIENT DESTINATION</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>RECIPIENT NAME</Text>
            <TextInput
              style={[
                styles.textInput,
                activeInput === 'recipientName' && styles.textInputActive,
              ]}
              value={recipientName}
              onChangeText={setRecipientName}
              placeholder="Full Name / Clinic / Facility"
              placeholderTextColor="#71717A"
              onFocus={() => setActiveInput('recipientName')}
              onBlur={() => setActiveInput(null)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>DESTINATION ADDRESS</Text>
            <TextInput
              style={[
                styles.textInput,
                activeInput === 'recipientAddress' && styles.textInputActive,
              ]}
              value={recipientAddress}
              onChangeText={setRecipientAddress}
              placeholder="Street, City, Suite / Room"
              placeholderTextColor="#71717A"
              onFocus={() => setActiveInput('recipientAddress')}
              onBlur={() => setActiveInput(null)}
            />
          </View>
        </View>

        {/* Package Specifications */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>CARGO SPECIFICATIONS</Text>
          
          <Text style={styles.inputLabel}>CATEGORY</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((cat) => (
              <Pressable
                key={cat}
                style={[
                  styles.categoryPill,
                  packageCategory === cat && styles.categoryPillActive,
                ]}
                onPress={() => setPackageCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    packageCategory === cat && styles.categoryTextActive,
                  ]}
                >
                  {cat.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.weightControlGroup}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>WEIGHT (KG)</Text>
              <Text style={[styles.weightValueText, styles.monoText]}>
                {weight.toFixed(1)} KG
              </Text>
            </View>
            <View style={styles.weightButtons}>
              <Pressable style={styles.weightAdjustButton} onPress={() => adjustWeight(-0.5)}>
                <Text style={styles.weightAdjustText}>-</Text>
              </Pressable>
              <Pressable style={styles.weightAdjustButton} onPress={() => adjustWeight(0.5)}>
                <Text style={styles.weightAdjustText}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>SPECIAL INSTRUCTIONS</Text>
            <TextInput
              style={[
                styles.textInput,
                styles.textAreaInput,
                activeInput === 'notes' && styles.textInputActive,
              ]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add loading notes, gate codes, or handling warnings"
              placeholderTextColor="#71717A"
              multiline
              numberOfLines={3}
              onFocus={() => setActiveInput('notes')}
              onBlur={() => setActiveInput(null)}
            />
          </View>
        </View>

        {/* Pricing Summary Card */}
        <View style={styles.priceCard}>
          <View>
            <Text style={styles.priceLabel}>ESTIMATED ROUTE TARIFF</Text>
            <Text style={styles.priceSubtext}>Calculated on Category & Cargo Weight</Text>
          </View>
          <Text style={[styles.priceValueText, styles.monoText]}>
            ${estimatedPrice.toFixed(2)}
          </Text>
        </View>

        {/* Action Button */}
        <Pressable style={styles.submitButton} onPress={handleBook}>
          <IconSymbol name="plus.circle.fill" size={20} color="#18181B" />
          <Text style={styles.submitButtonText}>DISPATCH LOGISTICS ROUTE</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#18181B',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 48,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FAFAFA',
    letterSpacing: 1,
  },
  closeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#27272A',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  closeText: {
    fontSize: 10,
    color: '#71717A',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: '#27272A',
    borderRadius: 8,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: '#3F3F46',
    padding: 16,
    gap: 14,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '900',
    color: '#CCFF00',
    letterSpacing: 1,
    marginBottom: 4,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#71717A',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 6,
    borderCurve: 'continuous',
    color: '#FAFAFA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textInputActive: {
    borderColor: '#CCFF00',
  },
  textAreaInput: {
    height: 70,
    textAlignVertical: 'top',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  categoryPill: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 6,
    borderCurve: 'continuous',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  categoryPillActive: {
    borderColor: '#CCFF00',
    backgroundColor: '#CCFF001A',
  },
  categoryText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700',
  },
  categoryTextActive: {
    color: '#CCFF00',
  },
  weightControlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 6,
    borderCurve: 'continuous',
    padding: 12,
  },
  weightValueText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FAFAFA',
    marginTop: 4,
  },
  weightButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  weightAdjustButton: {
    width: 44,
    height: 44,
    backgroundColor: '#27272A',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 6,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weightAdjustText: {
    color: '#FAFAFA',
    fontSize: 22,
    fontWeight: '700',
  },
  priceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#27272A',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 8,
    borderCurve: 'continuous',
    padding: 16,
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FAFAFA',
    letterSpacing: 0.5,
  },
  priceSubtext: {
    fontSize: 10,
    color: '#71717A',
    marginTop: 2,
  },
  priceValueText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#CCFF00',
  },
  monoText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontVariant: ['tabular-nums'],
  },
  submitButton: {
    backgroundColor: '#CCFF00',
    paddingVertical: 14,
    borderRadius: 8,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#18181B',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
