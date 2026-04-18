import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

export type DateItem = {
  day: string;
  dayNum: number;
  key: string;
};

type DateSelectorProps = {
  dates: DateItem[];
  selectedDateKey: string;
  onSelectDate: (dateKey: string) => void;
};

const DateSelector = ({ dates, selectedDateKey, onSelectDate }: DateSelectorProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.dateScroll}
      contentContainerStyle={styles.dateRow}
    >
      {dates.map((d) => {
        const isSelected = d.key === selectedDateKey;
        return (
          <TouchableOpacity
            key={d.key}
            style={[styles.dateChip, isSelected && styles.dateChipSelected]}
            onPress={() => onSelectDate(d.key)}
          >
            <Text style={[styles.dateChipDay, isSelected && styles.dateChipTextSelected]}>{d.day}</Text>
            <Text style={[styles.dateChipNum, isSelected && styles.dateChipTextSelected]}>{d.dayNum}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Fix height so ScrollView doesn't take extra vertical space on some RN layouts.
  dateScroll: { height: 76, marginTop: 15 },
  dateRow: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "flex-start",
    gap: 10,
  },
  dateChip: {
    width: 64,
    height: 76,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  dateChipSelected: { backgroundColor: "#2563EB", borderColor: "#2563EB" },
  dateChipDay: { fontSize: 12, lineHeight: 14, color: "#6B7280" },
  dateChipNum: { fontSize: 20, lineHeight: 24, fontWeight: "700", color: "#111827", marginTop: 2 },
  dateChipTextSelected: { color: "#FFFFFF" },
});

export default DateSelector;
