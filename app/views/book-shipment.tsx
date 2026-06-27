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
      className="flex-1"
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 gap-4 pb-12"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center justify-between py-2 border-b border-border border-b-border">
          <Text className="text-base font-black tracking-widest text-foreground text-foreground">BOOK LOGISTICS ROUTE</Text>
          <Pressable onPress={() => router.back()} className="py-1.5 px-3 rounded border bg-card border-border bg-card border-border">
            <Text className="text-[10px] font-extrabold tracking-wider text-muted text-muted">CANCEL</Text>
          </Pressable>
        </View>

        {/* Sender Section */}
        <View className="rounded-lg border p-4 gap-3.5 bg-card border-border bg-card border-border">
          <Text className="text-xs font-black tracking-widest mb-1 text-primary text-primary">SENDER ORIGIN</Text>
          <View className="gap-1.5">
            <Text className="text-[10px] font-extrabold tracking-wider text-muted text-muted">SENDER NAME</Text>
            <TextInput
              className={`border rounded-md px-3 py-2.5 text-sm bg-background border-border text-foreground ${activeInput === "senderName" ? 'border-primary' : ''}`}
              value={senderName}
              onChangeText={setSenderName}
              placeholder="Full Name / Company"
              placeholderTextColor={theme.muted}
              onFocus={() => setActiveInput("senderName")}
              onBlur={() => setActiveInput(null)}
            />
          </View>

          <View className="gap-1.5">
            <Text className="text-[10px] font-extrabold tracking-wider text-muted text-muted">ORIGIN ADDRESS</Text>
            <TextInput
              className={`border rounded-md px-3 py-2.5 text-sm bg-background border-border text-foreground ${activeInput === "senderAddress" ? 'border-primary' : ''}`}
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
        <View className="rounded-lg border p-4 gap-3.5 bg-card border-border bg-card border-border">
          <Text className="text-xs font-black tracking-widest mb-1 text-primary text-primary">RECIPIENT DESTINATION</Text>
          <View className="gap-1.5">
            <Text className="text-[10px] font-extrabold tracking-wider text-muted text-muted">RECIPIENT NAME</Text>
            <TextInput
              className={`border rounded-md px-3 py-2.5 text-sm bg-background border-border text-foreground ${activeInput === "recipientName" ? 'border-primary' : ''}`}
              value={recipientName}
              onChangeText={setRecipientName}
              placeholder="Full Name / Clinic / Facility"
              placeholderTextColor={theme.muted}
              onFocus={() => setActiveInput("recipientName")}
              onBlur={() => setActiveInput(null)}
            />
          </View>

          <View className="gap-1.5">
            <Text className="text-[10px] font-extrabold tracking-wider text-muted text-muted">DESTINATION ADDRESS</Text>
            <TextInput
              className={`border rounded-md px-3 py-2.5 text-sm bg-background border-border text-foreground ${activeInput === "recipientAddress" ? 'border-primary' : ''}`}
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
        <View className="rounded-lg border p-4 gap-3.5 bg-card border-border bg-card border-border">
          <Text className="text-xs font-black tracking-widest mb-1 text-primary text-primary">CARGO SPECIFICATIONS</Text>

          <Text className="text-[10px] font-extrabold tracking-wider text-muted text-muted">CATEGORY</Text>
          <View className="flex-row flex-wrap gap-2 mb-1.5">
            {categories.map((cat) => (
              <Pressable
                key={cat}
                className={`border rounded-md py-2 px-3 bg-background border-border ${packageCategory === cat ? 'border-primary bg-primary/10' : ''}`}
                onPress={() => setPackageCategory(cat)}
              >
                <Text
                  className={`text-[11px] font-bold text-muted ${packageCategory === cat ? 'text-primary' : ''}`}
                >
                  {cat.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="flex-row items-center border rounded-md p-3 bg-background border-border bg-background border-border">
            <View style={{ flex: 1 }}>
              <Text className="text-[10px] font-extrabold tracking-wider text-muted text-muted">WEIGHT (KG)</Text>
              <Text className="text-lg font-black mt-1 text-foreground font-mono tabular-nums text-foreground">
                {weight.toFixed(1)} KG
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Pressable
                className="w-11 h-11 border rounded-md items-center justify-center bg-card border-border bg-card border-border"
                onPress={() => adjustWeight(-0.5)}
              >
                <Text className="text-[22px] font-bold text-foreground text-foreground">-</Text>
              </Pressable>
              <Pressable
                className="w-11 h-11 border rounded-md items-center justify-center bg-card border-border bg-card border-border"
                onPress={() => adjustWeight(0.5)}
              >
                <Text className="text-[22px] font-bold text-foreground text-foreground">+</Text>
              </Pressable>
            </View>
          </View>

          <View className="gap-1.5">
            <Text className="text-[10px] font-extrabold tracking-wider text-muted text-muted">SPECIAL INSTRUCTIONS</Text>
            <TextInput
              className={`border rounded-md px-3 py-2.5 text-sm bg-background border-border text-foreground h-[70px] text-top ${activeInput === "notes" ? 'border-primary' : ''}`}
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
        <View className="flex-row items-center justify-between border rounded-lg p-4 bg-card border-border bg-card border-border">
          <View>
            <Text className="text-xs font-extrabold tracking-wider text-foreground text-foreground">ESTIMATED ROUTE TARIFF</Text>
            <Text className="text-[10px] mt-0.5 text-muted text-muted">
              Calculated on Category & Cargo Weight
            </Text>
          </View>
          <Text className="text-[22px] font-black text-primary font-mono tabular-nums text-primary">
            ${estimatedPrice.toFixed(2)}
          </Text>
        </View>

        {/* Action Button */}
        <Pressable className="py-3.5 rounded-lg flex-row items-center justify-center gap-2 mt-2 bg-primary bg-primary" onPress={handleBook}>
          <IconSymbol name="plus.circle.fill" size={20} color={theme.primaryText} />
          <Text className="font-black text-sm tracking-wider text-[#18181B] text-[#18181B]">DISPATCH LOGISTICS ROUTE</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

