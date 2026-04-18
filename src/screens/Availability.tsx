
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import ConsultationModeToggle, { ConsultMode } from "../components/ConsultationMode";
import DateSelector from "../components/Dateselector";
import DoctorCard from "../components/Doctorcard";
import TimeSlotsGrid, { TimeSlot } from "../components/TimeSlot";
import type { Doctor } from "../data/doctors";

const API_BASE_URL = "http://10.0.2.2:8000";
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

type AvailabilityRouteParams = {
  AvailabilityDetails: { doctor?: Doctor };
};

type DoctorAvailabilityScreenProps = {
  route?: RouteProp<AvailabilityRouteParams, "AvailabilityDetails">;
};

const DoctorAvailabilityScreen = ({ route }: DoctorAvailabilityScreenProps) => {
  const [mode, setMode] = useState<ConsultMode>("Video");
  const [selectedDateKey, setSelectedDateKey] = useState(upcomingDates[0].key);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const selectedDoctor = route?.params?.doctor ?? null;

  // Reset slot when user changes date or consultation mode
  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDateKey, mode]);

  useEffect(() => {
    let cancelled = false;

    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const response = await fetch(
          `${API_BASE_URL}/api/doctors?date=${selectedDateKey}&mode=${encodeURIComponent(mode)}`
        );
        const payload = await response.json();
        if (!response.ok) throw new Error("Failed");
        if (!cancelled) setDoctors(payload.doctors ?? []);
      } catch {
        if (!cancelled) setDoctors([]);
      } finally {
        if (!cancelled) setLoadingDoctors(false);
      }
    };

    fetchDoctors();
    return () => {
      cancelled = true;
    };
  }, [mode, selectedDateKey]);

  const selectedSummary = useMemo(() => {
    const d = new Date(`${selectedDateKey}T12:00:00`);
    if (Number.isNaN(d.getTime())) return null;
    const day = d.toLocaleDateString("en-US", { weekday: "short" });
    const dayNum = d.getDate();
    const base = `${day}, ${dayNum} • ${mode}`;
    return selectedSlot ? `${base} • ${selectedSlot.label}` : base;
  }, [mode, selectedDateKey, selectedSlot]);

  const canBook = !!selectedSlot;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Doctor Availability</Text>
        <Text style={styles.subtitle}>Choose your doctor, date, and time slot</Text>
      </View>

      <ConsultationModeToggle value={mode} onChange={setMode} />

      <DateSelector
        dates={upcomingDates}
        selectedDateKey={selectedDateKey}
        onSelectDate={setSelectedDateKey}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {selectedDoctor ? (
          <View style={styles.selectedDoctorBlock}>
            <DoctorCard doctor={selectedDoctor} showAvailabilityButton={false} />
          </View>
        ) : null}

        {/* NEW: available time slots below the doctor card */}
        {selectedDoctor ? (
          <TimeSlotsGrid
            dateKey={selectedDateKey}
            mode={mode}
            selectedSlotId={selectedSlot?.id ?? null}
            onSelectSlot={setSelectedSlot}
          />
        ) : null}

        {loadingDoctors ? (
          <View style={styles.feedbackBox}>
            <ActivityIndicator size="small" color="#2563EB" />
            <Text style={styles.feedbackText}>Loading doctors...</Text>
          </View>
        ) : !selectedDoctor && doctors.length > 0 ? (
          doctors.map((doc) => (
            <View key={doc.id} style={styles.listItem}>
              <DoctorCard doctor={doc} showAvailabilityButton={false} />
            </View>
          ))
        ) : null}
      </ScrollView>

      <View style={styles.bottomBar}>
        <Text style={styles.selectionText}>
          {selectedSummary ?? "Select a slot to continue"}
        </Text>
        <TouchableOpacity
          style={[styles.bookBtn, !canBook && styles.bookBtnDisabled]}
          disabled={!canBook}
        >
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

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 140 },

  selectedDoctorBlock: { paddingHorizontal: 16, paddingTop: 20 },
  listItem: { paddingHorizontal: 16, paddingTop: 10 },

  feedbackBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    alignItems: "center",
    gap: 6,
  },
  feedbackText: { color: "#6B7280", fontSize: 13, textAlign: "center" },

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
