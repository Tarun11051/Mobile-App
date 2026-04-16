import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Doctorcard from "../components/Doctorcard";
import { sampleDoctors } from "../data/doctors";
import type { Doctor } from "../data/doctors";

type DoctorsProfileProps = {
  navigation: {
    navigate: (screen: string, params?: object) => void;
  };
};

const DoctorsProfile = ({ navigation }: DoctorsProfileProps) => {
  const [searchText, setSearchText] = useState("");
  const { width } = useWindowDimensions();
  const isDesktopLike = width >= 920;

  const filteredDoctors = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return sampleDoctors;

    return sampleDoctors.filter((doctor) => {
      const name = doctor.name?.toLowerCase() ?? "";
      const specialty = doctor.specialty?.toLowerCase() ?? "";
      return name.includes(query) || specialty.includes(query);
    });
  }, [searchText]);

  const renderDoctor = ({ item }: { item: Doctor }) => {
    return (
      <Doctorcard
        doctor={item}
        isDesktopLike={isDesktopLike}
        onPressAvailability={(doctor) => navigation.navigate("Availability", { doctor })}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.pageInner, isDesktopLike && styles.pageInnerDesktop]}>
        <Text style={[styles.screenTitle, isDesktopLike && styles.screenTitleDesktop]}>
          {filteredDoctors.length} doctors available
        </Text>
        <Text style={styles.screenSubtitle}>Book appointments with experienced doctors</Text>

        <View style={styles.searchRow}>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search by doctor name or specialization"
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
          <TouchableOpacity style={styles.searchButton} activeOpacity={0.85}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredDoctors}
          keyExtractor={(item) => item.id}
          renderItem={renderDoctor}
          contentContainerStyle={[styles.listContent, isDesktopLike && styles.listContentDesktop]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No doctors found for this search.</Text>}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  pageInner: {
    flex: 1,
  },
  pageInnerDesktop: {
    maxWidth: 860,
    width: "100%",
    alignSelf: "center",
  },
  screenTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#111827",
  },
  screenTitleDesktop: {
    fontSize: 32,
  },
  screenSubtitle: {
    marginTop: 2,
    color: "#6B7280",
    fontSize: 12,
    marginBottom: 14,
  },
  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    color: "#0F172A",
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: "#2563EB",
    borderRadius: 22,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },
  listContent: {
    paddingBottom: 28,
    gap: 0,
  },
  listContentDesktop: {
    paddingBottom: 26,
  },
  emptyText: {
    textAlign: "center",
    color: "#64748B",
    fontSize: 14,
    marginTop: 20,
  },
});

export default DoctorsProfile;
