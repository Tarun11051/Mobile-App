

import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type TimeSlot = {
  id: string;
  label: string;
  available: boolean;
};

export type SlotGroup = {
  title: string;
  icon: string;
  slots: TimeSlot[];
};

type Props = {
  dateKey: string;
  mode: string;
  selectedSlotId: string | null;
  onSelectSlot: (slot: TimeSlot | null) => void;
};

const INITIAL_VISIBLE = 3; // slots shown before "Show more"

/* ---------- Mock generator (deterministic per date + mode) ---------- */

const buildSlots = (
  startHour: number,
  endHour: number,
  prefix: string,
  seed: number
): TimeSlot[] => {
  const out: TimeSlot[] = [];
  let idx = 0;
  for (let h = startHour; h < endHour; h++) {
    [0, 30].forEach((min) => {
      const hour12 = ((h + 11) % 12) + 1;
      const ampm = h < 12 ? "AM" : "PM";
      const label = `${String(hour12).padStart(2, "0")}:${String(min).padStart(2, "0")} ${ampm}`;
      const available = ((seed + idx * 7) % 5) !== 0;
      out.push({ id: `${prefix}-${h}-${min}`, label, available });
      idx++;
    });
  }
  return out;
};

const hashString = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

const getMockGroups = (dateKey: string, mode: string): SlotGroup[] => {
  const seed = hashString(`${dateKey}|${mode}`);
  return [
    { title: "Morning",   icon: "☀",  slots: buildSlots(9,  12, "m", seed) },
    { title: "Afternoon", icon: "🌤", slots: buildSlots(12, 16, "a", seed + 3) },
    { title: "Evening",   icon: "🌙", slots: buildSlots(16, 20, "e", seed + 7) },
  ];
};

/* ---------- Component ---------- */

const TimeSlotsGrid = ({ dateKey, mode, selectedSlotId, onSelectSlot }: Props) => {
  const groups = useMemo(() => getMockGroups(dateKey, mode), [dateKey, mode]);

  // track which groups are expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const totalAvailable = useMemo(
    () => groups.reduce((acc, g) => acc + g.slots.filter((s) => s.available).length, 0),
    [groups]
  );

  const toggleGroup = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Available Slots</Text>
        <View style={styles.countPill}>
          <Text style={styles.countTxt}>{totalAvailable} open</Text>
        </View>
      </View>

      {groups.map((g) => {
        const openCount = g.slots.filter((s) => s.available).length;
        const isExpanded = !!expanded[g.title];
        const visibleSlots = isExpanded ? g.slots : g.slots.slice(0, INITIAL_VISIBLE);
        const hiddenCount = g.slots.length - INITIAL_VISIBLE;

        return (
          <View key={g.title} style={styles.group}>
            <View style={styles.groupHead}>
              <Text style={styles.groupIcon}>{g.icon}</Text>
              <Text style={styles.groupTitle}>{g.title}</Text>
              <Text style={styles.groupCount}>{openCount} slots</Text>
            </View>

            <View style={styles.slotsWrap}>
              {visibleSlots.map((s) => {
                const isSelected = s.id === selectedSlotId;
                const disabled = !s.available;
                return (
                  <TouchableOpacity
                    key={s.id}
                    disabled={disabled}
                    onPress={() => onSelectSlot(isSelected ? null : s)}
                    activeOpacity={0.8}
                    style={[
                      styles.slotChip,
                      disabled && styles.slotChipDisabled,
                      isSelected && styles.slotChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.slotTxt,
                        disabled && styles.slotTxtDisabled,
                        isSelected && styles.slotTxtSelected,
                      ]}
                    >
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {hiddenCount > 0 && (
              <TouchableOpacity
                onPress={() => toggleGroup(g.title)}
                activeOpacity={0.7}
                style={styles.showMoreBtn}
              >
                <Text style={styles.showMoreTxt}>
                  {isExpanded ? "Show less" : `Show more (+${hiddenCount})`}
                </Text>
                <Text style={styles.showMoreChevron}>
                  {isExpanded ? "▲" : "▼"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default TimeSlotsGrid;

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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  title: { fontSize: 15, fontWeight: "700", color: "#111827" },
  countPill: {
    backgroundColor: "#EFF6FF",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  countTxt: { color: "#2563EB", fontWeight: "700", fontSize: 11 },

  group: { marginTop: 12 },
  groupHead: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  groupIcon: { fontSize: 14 },
  groupTitle: { fontSize: 13, fontWeight: "700", color: "#374151", flex: 1 },
  groupCount: { fontSize: 11, color: "#6B7280" },

  slotsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  slotChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    minWidth: 84,
    alignItems: "center",
  },
  slotChipSelected: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  slotChipDisabled: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  slotTxt: { fontSize: 13, color: "#111827", fontWeight: "600" },
  slotTxtSelected: { color: "#FFFFFF" },
  slotTxtDisabled: { color: "#9CA3AF", textDecorationLine: "line-through" },

  showMoreBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#EFF6FF",
    gap: 6,
  },
  showMoreTxt: { color: "#2563EB", fontSize: 12, fontWeight: "700" },
  showMoreChevron: { color: "#2563EB", fontSize: 10, fontWeight: "700" },
});