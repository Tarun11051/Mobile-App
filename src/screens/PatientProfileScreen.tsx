import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, Image,
  ActivityIndicator, ScrollView
} from "react-native";
import InfoCard from "../components/InfoCard";
import { getPatient } from "../services/api";

const PatientProfileScreen = () => {
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatient(1)
      .then(setPatient)
      .catch((err) => {
        console.log("ERROR:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ LOADING
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  // ✅ ERROR STATE
  if (!patient) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>⚠️ Failed to load patient</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://bootdey.com/img/Content/avatar/avatar1.png" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{patient?.name}</Text>
        <Text style={styles.sub}>
          {patient?.age} yrs • {patient?.gender}
        </Text>
      </View>

      {/* MEDICAL */}
      <InfoCard title="Medical Info">
        <Text>Blood: {patient?.blood_group}</Text>
        <Text>Allergies: {patient?.allergies}</Text>
        <Text>Last Visit: {patient?.last_visit}</Text>
      </InfoCard>

      {/* CONTACT */}
      <InfoCard title="Contact">
        <Text>Phone: {patient?.phone}</Text>
        <Text>Email: {patient?.email}</Text>
      </InfoCard>

    </ScrollView>
  );
};

export default PatientProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fb" },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  header: {
    backgroundColor: "#6C63FF",
    alignItems: "center",
    padding: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  avatar: { width: 100, height: 100, borderRadius: 50 },
  name: { color: "#fff", fontSize: 24, fontWeight: "bold", marginTop: 10 },
  sub: { color: "#eee" },
});