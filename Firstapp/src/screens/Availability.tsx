import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import ConsultationModeToggle, { ConsultMode } from "../components/ConsultationMode";
import DateSelector from "../components/Dateselector";
import DoctorCard from "../components/DoctorCard";
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
  AvailabilityDetails: {
    doctor?: Doctor;
  };
};

type DoctorAvailabilityScreenProps = {
  route?: RouteProp<AvailabilityRouteParams, "AvailabilityDetails">;
};

const DoctorAvailabilityScreen = ({ route }: DoctorAvailabilityScreenProps) => {
  const [mode, setMode] = useState<ConsultMode>("Video");
  const [selectedDateKey, setSelectedDateKey] = useState(upcomingDates[0].key);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const selectedDoctor = route?.params?.doctor ?? null;

  useEffect(() => {
    let cancelled = false;

    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        setLoadingError(null);

        const response = await fetch(
          `${API_BASE_URL}/api/doctors?date=${selectedDateKey}&mode=${encodeURIComponent(mode)}`
        );
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.detail ?? "Failed to load doctors.");
        }

        if (!cancelled) {
          setDoctors(payload.doctors ?? []);
        }
      } catch (error) {
        if (!cancelled) {
          setDoctors([]);
          setLoadingError(error instanceof Error ? error.message : "Unable to fetch doctors.");
        }
      } finally {
        if (!cancelled) {
          setLoadingDoctors(false);
        }
      }
    };

    fetchDoctors();

    return () => {
      cancelled = true;
    };
  }, [mode, selectedDateKey]);

  const selectedSummary = useMemo(() => {
    const dayObj = upcomingDates.find((d) => d.key === selectedDateKey);
    if (!dayObj) return null;
    return `${dayObj.day}, ${dayObj.dayNum} • ${mode}`;
  }, [mode, selectedDateKey]);

  const onChangeDate = (dateKey: string) => {
    setSelectedDateKey(dateKey);
  };

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
        onSelectDate={onChangeDate}
      />

      {selectedDoctor ? (
        <View style={styles.selectedDoctorBlock}>
          <DoctorCard doctor={selectedDoctor} showAvailabilityButton={false} />
        </View>
      ) : null}

      {loadingDoctors ? (
        <View style={styles.feedbackBox}>
          <ActivityIndicator size="small" color="#2563EB" />
          <Text style={styles.feedbackText}>Loading doctors...</Text>
        </View>
      ) : loadingError ? (
        <View style={styles.feedbackBox}>
          <Text style={styles.errorText}>{loadingError}</Text>
        </View>
      ) : doctors.length === 0 ? (
        <View style={styles.feedbackBox}>
          <Text style={styles.feedbackText}>No doctors available for this date and mode.</Text>
        </View>
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            return (
              <DoctorCard
                doctor={item}
                showAvailabilityButton={false}
              />
            );
          }}
        />
      )}

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
  container: { flex: 1, backgroundColor: "#F7F8FC", paddingBottom: 110 },
  header: { paddingHorizontal: 16, paddingTop: 10 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  subtitle: { marginTop: 4, color: "#6B7280", fontSize: 13 },
  selectedDoctorBlock: { paddingHorizontal: 16, paddingTop: 0, paddingBottom: 0 },

  listContent: { paddingHorizontal: 16, paddingTop: 0, paddingBottom: 120, gap: 0 },
  feedbackBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 0,
    marginBottom: 0,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 6,
  },
  feedbackText: { color: "#6B7280", fontSize: 13, textAlign: "center" },
  errorText: { color: "#B91C1C", fontSize: 13, textAlign: "center" },
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
