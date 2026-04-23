import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  onApply: (value: string) => void;
  disabled?: boolean;
};

const CustomTimeSlotPicker = ({ onApply, disabled = false }: Props) => {
  const [value, setValue] = useState("");

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Custom Time Slot</Text>
      <Text style={styles.hint}>Use format like 10:00 AM</Text>
      <View style={styles.row}>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder="HH:MM AM/PM"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          autoCapitalize="characters"
          editable={!disabled}
        />
        <TouchableOpacity
          style={[styles.btn, disabled && styles.btnDisabled]}
          onPress={() => onApply(value)}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginTop: 14,
    marginHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
  },
  title: { fontSize: 15, fontWeight: "700", color: "#111827" },
  hint: { marginTop: 4, color: "#6B7280", fontSize: 12 },
  row: { marginTop: 10, flexDirection: "row", gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#111827",
  },
  btn: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    minWidth: 78,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  btnDisabled: { backgroundColor: "#93C5FD" },
  btnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
});

export default CustomTimeSlotPicker;
