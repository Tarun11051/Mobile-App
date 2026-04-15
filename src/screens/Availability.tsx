import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ConsultMode = "Video" | "In-Clinic" | "At-Home";
type SlotStatus = "available" | "limited" | "unavailable";
type SlotGroup = "Morning" | "Afternoon" | "Evening";

type Slot = {
  id: string;
  time: string;
  status: SlotStatus;
  group: SlotGroup;
};

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  fee: number;
  experience: {
    years: number;
    months?: number;
  };
  slotsByDate: Record<string, Slot[]>;
};

const DAYS_TO_SHOW = 7;

const getDateLabel = (date: Date) => {
  const day = date.toLocaleDateString("en-US", { weekday: "short" });
  const dayNum = date.getDate();
  return { day, dayNum, key: date.toISOString().split("T")[0] };
};

const buildUpcomingDates = () => {
  const now = new Date();
  return Array.from({ length: DAYS_TO_SHOW }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    return getDateLabel(d);
  });
};

const upcomingDates = buildUpcomingDates();

const sampleDoctors: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Sheryas",
    specialty: "General Physician",
    rating: 4.8,
    fee: 499,
    experience: {
      years: 4,
      months: 6,
    },
    slotsByDate: {
      [upcomingDates[0].key]: [
        { id: "1", time: "09:00 AM", status: "available", group: "Morning" },
        { id: "2", time: "09:30 AM", status: "limited", group: "Morning" },
        { id: "3", time: "11:00 AM", status: "unavailable", group: "Morning" },
        { id: "4", time: "02:00 PM", status: "available", group: "Afternoon" },
        { id: "5", time: "06:30 PM", status: "available", group: "Evening" },
      ],
      [upcomingDates[1].key]: [
        { id: "6", time: "10:00 AM", status: "available", group: "Morning" },
        { id: "7", time: "12:30 PM", status: "limited", group: "Afternoon" },
        { id: "8", time: "07:00 PM", status: "available", group: "Evening" },
      ],
    },
  },

  {
    id: "doc-2",
    name: "Dr.Rohit",
    specialty: "Dermatologist",
    rating: 4.6,
    fee: 699,
    experience: {
      years: 2,
      months: 6,
    },
    slotsByDate: {
      [upcomingDates[0].key]: [
        { id: "9", time: "08:30 AM", status: "available", group: "Morning" },
        { id: "10", time: "03:00 PM", status: "available", group: "Afternoon" },
        { id: "11", time: "04:00 PM", status: "unavailable", group: "Afternoon" },
      ],
      [upcomingDates[2].key]: [
        { id: "12", time: "09:30 AM", status: "limited", group: "Morning" },
        { id: "13", time: "05:30 PM", status: "available", group: "Evening" },
      ],
    },
  },

  {
    id: "doc-3",
    name: "Dr.Bharath",
    specialty: "Dermatologist",
    rating: 4.6,
    fee: 699,
    experience: {
      years: 10,
      months: 0,
    },
    slotsByDate: {
      [upcomingDates[0].key]: [
        { id: "9", time: "08:30 AM", status: "available", group: "Morning" },
        { id: "10", time: "03:00 PM", status: "available", group: "Afternoon" },
        { id: "11", time: "04:00 PM", status: "unavailable", group: "Afternoon" },
      ],
      [upcomingDates[2].key]: [
        { id: "12", time: "09:30 AM", status: "limited", group: "Morning" },
        { id: "13", time: "05:30 PM", status: "available", group: "Evening" },
      ],
    },
  },

  {
    id: "doc-4",
    name: "Dr.Chandrashekar",
    specialty: "Cardiologist",
    rating: 4.6,
    fee: 699,
    experience: {
      years: 8,
      months: 6,
    },
    slotsByDate: {
      [upcomingDates[0].key]: [
        { id: "9", time: "08:30 AM", status: "available", group: "Morning" },
        { id: "10", time: "03:00 PM", status: "available", group: "Afternoon" },
        { id: "11", time: "04:00 PM", status: "unavailable", group: "Afternoon" },
      ],
      [upcomingDates[2].key]: [
        { id: "12", time: "09:30 AM", status: "limited", group: "Morning" },
        { id: "13", time: "05:30 PM", status: "available", group: "Evening" },
      ],
    },
  },

  {
    id: "doc-5",
    name: "Dr.Soujanya",
    specialty: "General Physician",
    rating: 4.6,
    fee: 699,
    experience: {
      years: 10,
      months: 6,
    },
    slotsByDate: {
      [upcomingDates[0].key]: [
        { id: "9", time: "08:30 AM", status: "available", group: "Morning" },
        { id: "10", time: "03:00 PM", status: "available", group: "Afternoon" },
        { id: "11", time: "04:00 PM", status: "unavailable", group: "Afternoon" },
      ],
      [upcomingDates[2].key]: [
        { id: "12", time: "09:30 AM", status: "limited", group: "Morning" },
        { id: "13", time: "05:30 PM", status: "available", group: "Evening" },
      ],
    },
  },

  {
    id: "doc-6",
    name: "Dr.Neah Naidu",
    specialty: "General Physician",
    rating: 4.6,
    fee: 699,
    experience: {
      years: 12,
      months: 6,
    },
    slotsByDate: {
      [upcomingDates[0].key]: [
        { id: "9", time: "08:30 AM", status: "available", group: "Morning" },
        { id: "10", time: "03:00 PM", status: "available", group: "Afternoon" },
        { id: "11", time: "04:00 PM", status: "unavailable", group: "Afternoon" },
      ],
      [upcomingDates[2].key]: [
        { id: "12", time: "09:30 AM", status: "limited", group: "Morning" },
        { id: "13", time: "05:30 PM", status: "available", group: "Evening" },
      ],
    },
  },

  {
    id: "doc-7",
    name: "Dr.Hemanth",
    specialty: "General Physician",
    rating: 4.6,
    fee: 699,
    experience: {
      years: 8,
      months: 6,
    },
    slotsByDate: {
      [upcomingDates[0].key]: [
        { id: "9", time: "08:30 AM", status: "available", group: "Morning" },
        { id: "10", time: "03:00 PM", status: "available", group: "Afternoon" },
        { id: "11", time: "04:00 PM", status: "unavailable", group: "Afternoon" },
      ],
      [upcomingDates[2].key]: [
        { id: "12", time: "09:30 AM", status: "limited", group: "Morning" },
        { id: "13", time: "05:30 PM", status: "available", group: "Evening" },
      ],
    },
  },

  {
    id: "doc-8",
    name: "Dr.Anudeep",
    specialty: "General Physician",
    rating: 4.6,
    fee: 699,
    experience: {
      years: 6,
      months: 6,
    },
    slotsByDate: {
      [upcomingDates[0].key]: [
        { id: "9", time: "08:30 AM", status: "available", group: "Morning" },
        { id: "10", time: "03:00 PM", status: "available", group: "Afternoon" },
        { id: "11", time: "04:00 PM", status: "unavailable", group: "Afternoon" },
      ],
      [upcomingDates[2].key]: [
        { id: "12", time: "09:30 AM", status: "limited", group: "Morning" },
        { id: "13", time: "05:30 PM", status: "available", group: "Evening" },
      ],
    },
  },
];

const slotGroups: SlotGroup[] = ["Morning", "Afternoon", "Evening"];

const DoctorAvailabilityScreen = () => {
  const [mode, setMode] = useState<ConsultMode>("Video");
  const [selectedDateKey, setSelectedDateKey] = useState(upcomingDates[0].key);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const selectedSummary = useMemo(() => {
    if (!selectedDoctorId || !selectedSlotId) return null;

    const doctor = sampleDoctors.find((d) => d.id === selectedDoctorId);
    const dayObj = upcomingDates.find((d) => d.key === selectedDateKey);
    const slot = doctor?.slotsByDate[selectedDateKey]?.find((s) => s.id === selectedSlotId);
    if (!doctor || !dayObj || !slot) return null;

    return `${doctor.name} • ${dayObj.day}, ${dayObj.dayNum} • ${slot.time} • ${mode}`;
  }, [mode, selectedDateKey, selectedDoctorId, selectedSlotId]);

  const onChangeDate = (dateKey: string) => {
    setSelectedDateKey(dateKey);
    setSelectedDoctorId(null);
    setSelectedSlotId(null);
  };

  const onSelectSlot = (doctorId: string, slot: Slot) => {
    if (slot.status === "unavailable") return;
    setSelectedDoctorId(doctorId);
    setSelectedSlotId(slot.id);
  };

  const renderSlot = (doctorId: string, slot: Slot) => {
    const isSelected = selectedDoctorId === doctorId && selectedSlotId === slot.id;
    const isDisabled = slot.status === "unavailable";

    return (
      <TouchableOpacity
        key={slot.id}
        style={[
          styles.slotChip,
          slot.status === "limited" && styles.slotChipLimited,
          isDisabled && styles.slotChipDisabled,
          isSelected && styles.slotChipSelected,
        ]}
        disabled={isDisabled}
        onPress={() => onSelectSlot(doctorId, slot)}
      >
        <Text
          style={[
            styles.slotText,
            isDisabled && styles.slotTextDisabled,
            isSelected && styles.slotTextSelected,
          ]}
        >
          {slot.time}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Doctor Availability</Text>
        <Text style={styles.subtitle}>Choose your doctor, date, and time slot</Text>
      </View>

      <View style={styles.modeToggle}>
        {(["Video", "In-Clinic","At-Home"] as ConsultMode[]).map((m) => {
          const active = mode === m;
          return (
            <TouchableOpacity
              key={m}
              style={[styles.modeBtn, active && styles.modeBtnActive]}
              onPress={() => setMode(m)}
            >
              <Text style={[styles.modeBtnText, active && styles.modeBtnTextActive]}>{m}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dateScroll}
        contentContainerStyle={styles.dateRow}
      >
        {upcomingDates.map((d) => {
          const isSelected = d.key === selectedDateKey;
          return (
            <TouchableOpacity
              key={d.key}
              style={[styles.dateChip, isSelected && styles.dateChipSelected]}
              onPress={() => onChangeDate(d.key)}
            >
              <Text style={[styles.dateChipDay, isSelected && styles.dateChipTextSelected]}>{d.day}</Text>
              <Text style={[styles.dateChipNum, isSelected && styles.dateChipTextSelected]}>{d.dayNum}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={sampleDoctors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const slots = item.slotsByDate[selectedDateKey] ?? [];
          return (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.docName}>{item.name}</Text>
                  <Text style={styles.docMeta}>{item.specialty}</Text>
                  <Text style={styles.docMeta}>⭐ {item.rating}  •  ₹{item.fee} • {item.experience.years} yrs </Text>
                </View>
                <Text style={styles.modeBadge}>{mode}</Text>
              </View>

              {slots.length === 0 ? (
                <Text style={styles.noSlots}>No slots available on this day</Text>
              ) : (
                slotGroups.map((group) => {
                  const groupedSlots = slots.filter((s) => s.group === group);
                  if (groupedSlots.length === 0) return null;
                  return (
                    <View key={group} style={styles.groupSection}>
                      <Text style={styles.groupTitle}>{group}</Text>
                      <View style={styles.slotWrap}>
                        {groupedSlots.map((slot) => renderSlot(item.id, slot))}
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          );
        }}
      />

      <View style={styles.bottomBar}>
        <Text style={styles.selectionText}>
          {selectedSummary ?? "Select a slot to continue"}
        </Text>
        <TouchableOpacity style={[styles.bookBtn, !selectedSummary && styles.bookBtnDisabled]} disabled={!selectedSummary}>
          <Text style={styles.bookBtnText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FC" },
  header: { paddingHorizontal: 16, paddingTop: 10 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  subtitle: { marginTop: 4, color: "#6B7280", fontSize: 13 },

  modeToggle: {
    flexDirection: "row",
    backgroundColor: "#EDEFF5",
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 12,
    padding: 4,
  },
  modeBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  modeBtnActive: { backgroundColor: "#2563EB" },
  modeBtnText: { color: "#374151", fontWeight: "600" },
  modeBtnTextActive: { color: "#FFFFFF" },

  dateScroll: { minHeight: 104 },
  dateRow: { paddingHorizontal: 16, paddingVertical: 14, gap: 10, alignItems: "center" },

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
  dateChipDay: { fontSize: 12, color: "#6B7280" },
  dateChipNum: { fontSize: 20, fontWeight: "700", color: "#111827", marginTop: 2 },
  dateChipTextSelected: { color: "#FFFFFF" },

  listContent: { paddingHorizontal: 16, paddingBottom: 120, gap: 12 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop:15,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  docName: { fontSize: 16, fontWeight: "700", color: "#111827" },
  docMeta: { marginTop: 2, color: "#6B7280", fontSize: 13 },
  modeBadge: {
    backgroundColor: "#EFF6FF",
    color: "#2563EB",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    overflow: "hidden",
    fontWeight: "600",
    fontSize: 12,
  },

  groupSection: { marginTop: 12 },
  groupTitle: { fontWeight: "600", color: "#374151", marginBottom: 8 },
  slotWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  slotChip: {
    borderWidth: 1,
    borderColor: "#BFDBFE",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  slotChipLimited: {
    backgroundColor: "#FEF3C7",
    borderColor: "#FCD34D",
  },
  slotChipDisabled: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  slotChipSelected: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  slotText: { fontWeight: "600", color: "#1D4ED8", fontSize: 12 },
  slotTextDisabled: { color: "#9CA3AF" },
  slotTextSelected: { color: "#FFFFFF" },
  noSlots: { marginTop: 12, color: "#9CA3AF", fontSize: 13 },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  selectionText: { color: "#374151", marginBottom: 10, fontSize: 13 },
  bookBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
  },
  bookBtnDisabled: { backgroundColor: "#93C5FD" },
  bookBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
});

export default DoctorAvailabilityScreen;
