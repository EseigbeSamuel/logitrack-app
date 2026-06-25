import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PackageCategory, useLogiTrack } from "@/store/logitrack-store";
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function BookShipmentScreen() {
  const router = useRouter();
  const theme = useThemeColors();
  const { createShipment } = useLogiTrack();

  const [senderName, setSenderName] = useState("Sarah Jenkins");
  const [senderAddress, setSenderAddress] = useState(
    "742 Evergreen Terrace, Springfield",
  );
  const [recipientName, setRecipientName] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [packageCategory, setPackageCategory] =
    useState<PackageCategory>("General");
  const [weight, setWeight] = useState(2.0);
  const [notes, setNotes] = useState("");

  // Input focus simulation
  const [activeInput, setActiveInput] = useState<string | null>(null);

  // Pricing rule: Base $5.00 + $1.50 per kg
  const estimatedPrice = 5.0 + weight * 1.5;

  const handleBook = () => {
    if (!senderName || !senderAddress || !recipientName || !recipientAddress) {
      alert(
        "Error: All name and address fields are required to establish a logistics route.",
      );
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

  const categories: PackageCategory[] = [
    "General",
    "Documents",
    "Electronics",
    "Food/Perishables",
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardContainer}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>BOOK LOGISTICS ROUTE</Text>
          <Pressable onPress={() => router.back()} style={[styles.closeButton, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.closeText, { color: theme.muted }]}>CANCEL</Text>
          </Pressable>
        </View>

        {/* Sender Section */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionHeader, { color: theme.primary }]}>SENDER ORIGIN</Text>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.muted }]}>SENDER NAME</Text>
            <TextInput
              style={[
                styles.textInput, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text },
                activeInput === "senderName" && [styles.textInputActive, { borderColor: theme.primary }],
              ]}
              value={senderName}
              onChangeText={setSenderName}
              placeholder="Full Name / Company"
              placeholderTextColor={theme.muted}
              onFocus={() => setActiveInput("senderName")}
              onBlur={() => setActiveInput(null)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.muted }]}>ORIGIN ADDRESS</Text>
            <TextInput
              style={[
                styles.textInput, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text },
                activeInput === "senderAddress" && [styles.textInputActive, { borderColor: theme.primary }],
              ]}
              value={senderAddress}
              onChangeText={setSenderAddress}
              placeholder="Street, City, Building Number"
              placeholderTextColor={theme.muted}
              onFocus={() => setActiveInput("senderAddress")}
              onBlur={() => setActiveInput(null)}
            />
          </View>
        </View>

        {/* Recipient Section */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionHeader, { color: theme.primary }]}>RECIPIENT DESTINATION</Text>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.muted }]}>RECIPIENT NAME</Text>
            <TextInput
              style={[
                styles.textInput, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text },
                activeInput === "recipientName" && [styles.textInputActive, { borderColor: theme.primary }],
              ]}
              value={recipientName}
              onChangeText={setRecipientName}
              placeholder="Full Name / Clinic / Facility"
              placeholderTextColor={theme.muted}
              onFocus={() => setActiveInput("recipientName")}
              onBlur={() => setActiveInput(null)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.muted }]}>DESTINATION ADDRESS</Text>
            <TextInput
              style={[
                styles.textInput, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text },
                activeInput === "recipientAddress" && [styles.textInputActive, { borderColor: theme.primary }],
              ]}
              value={recipientAddress}
              onChangeText={setRecipientAddress}
              placeholder="Street, City, Suite / Room"
              placeholderTextColor={theme.muted}
              onFocus={() => setActiveInput("recipientAddress")}
              onBlur={() => setActiveInput(null)}
            />
          </View>
        </View>

        {/* Package Specifications */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionHeader, { color: theme.primary }]}>CARGO SPECIFICATIONS</Text>

          <Text style={[styles.inputLabel, { color: theme.muted }]}>CATEGORY</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((cat) => (
              <Pressable
                key={cat}
                style={[
                  styles.categoryPill, { backgroundColor: theme.background, borderColor: theme.border },
                  packageCategory === cat && [styles.categoryPillActive, { borderColor: theme.primary, backgroundColor: theme.primary + '1A' }],
                ]}
                onPress={() => setPackageCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryText, { color: theme.muted },
                    packageCategory === cat && [styles.categoryTextActive, { color: theme.primary }],
                  ]}
                >
                  {cat.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={[styles.weightControlGroup, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.inputLabel, { color: theme.muted }]}>WEIGHT (KG)</Text>
              <Text style={[styles.weightValueText, styles.monoText, { color: theme.text }]}>
                {weight.toFixed(1)} KG
              </Text>
            </View>
            <View style={styles.weightButtons}>
              <Pressable
                style={[styles.weightAdjustButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => adjustWeight(-0.5)}
              >
                <Text style={[styles.weightAdjustText, { color: theme.text }]}>-</Text>
              </Pressable>
              <Pressable
                style={[styles.weightAdjustButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => adjustWeight(0.5)}
              >
                <Text style={[styles.weightAdjustText, { color: theme.text }]}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.muted }]}>SPECIAL INSTRUCTIONS</Text>
            <TextInput
              style={[
                styles.textInput, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text },
                styles.textAreaInput,
                activeInput === "notes" && [styles.textInputActive, { borderColor: theme.primary }],
              ]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add loading notes, gate codes, or handling warnings"
              placeholderTextColor={theme.muted}
              multiline
              numberOfLines={3}
              onFocus={() => setActiveInput("notes")}
              onBlur={() => setActiveInput(null)}
            />
          </View>
        </View>

        {/* Pricing Summary Card */}
        <View style={[styles.priceCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View>
            <Text style={[styles.priceLabel, { color: theme.text }]}>ESTIMATED ROUTE TARIFF</Text>
            <Text style={[styles.priceSubtext, { color: theme.muted }]}>
              Calculated on Category & Cargo Weight
            </Text>
          </View>
          <Text style={[styles.priceValueText, styles.monoText, { color: theme.primary }]}>
            ${estimatedPrice.toFixed(2)}
          </Text>
        </View>

        {/* Action Button */}
        <Pressable style={[styles.submitButton, { backgroundColor: theme.primary }]} onPress={handleBook}>
          <IconSymbol name="plus.circle.fill" size={20} color={theme.primaryText} />
          <Text style={[styles.submitButtonText, { color: theme.primaryText }]}>DISPATCH LOGISTICS ROUTE</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1,
  },
  closeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
  },
  closeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  sectionCard: {
    borderRadius: 8,
    borderCurve: "continuous",
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 4,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 6,
    borderCurve: "continuous",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textInputActive: {
  },
  textAreaInput: {
    height: 70,
    textAlignVertical: "top",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 6,
  },
  categoryPill: {
    borderWidth: 1,
    borderRadius: 6,
    borderCurve: "continuous",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  categoryPillActive: {
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
  },
  categoryTextActive: {
  },
  weightControlGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 6,
    borderCurve: "continuous",
    padding: 12,
  },
  weightValueText: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 4,
  },
  weightButtons: {
    flexDirection: "row",
    gap: 8,
  },
  weightAdjustButton: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 6,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  weightAdjustText: {
    fontSize: 22,
    fontWeight: "700",
  },
  priceCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 8,
    borderCurve: "continuous",
    padding: 16,
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  priceSubtext: {
    fontSize: 10,
    marginTop: 2,
  },
  priceValueText: {
    fontSize: 22,
    fontWeight: "900",
  },
  monoText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontVariant: ["tabular-nums"],
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 8,
    borderCurve: "continuous",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  submitButtonText: {
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
