import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type ConsultMode = "Video" | "In-Clinic" | "At-Home";

type ConsultationModeToggleProps = {
  value: ConsultMode;
  onChange: (mode: ConsultMode) => void;
};

const MODE_OPTIONS: ConsultMode[] = ["Video", "In-Clinic", "At-Home"];

const ConsultationModeToggle = ({ value, onChange }: ConsultationModeToggleProps) => {
  return (
    <View style={styles.modeToggle}>
      {MODE_OPTIONS.map((mode) => {
        const active = value === mode;
        return (
          <TouchableOpacity
            key={mode}
            style={[styles.modeBtn, active && styles.modeBtnActive]}
            onPress={() => onChange(mode)}
          >
            <Text style={[styles.modeBtnText, active && styles.modeBtnTextActive]}>{mode}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  modeToggle: {
    flexDirection: "row",
    backgroundColor: "#EDEFF5",
    marginHorizontal: 10,
    marginTop: 0,
    borderRadius: 20,
    padding: 4,
  },
  modeBtn: { flex: 1, paddingVertical: 18, alignItems: "center", borderRadius: 10 },
  modeBtnActive: { backgroundColor: "#2563EB" },
  modeBtnText: { color: "#374151", fontWeight: "600" },
  modeBtnTextActive: { color: "#FFFFFF" },
});

export default ConsultationModeToggle;
