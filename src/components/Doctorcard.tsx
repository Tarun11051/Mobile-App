import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Doctor } from "../data/doctors";

type DoctorCardProps = {
  doctor: Doctor;
  isDesktopLike?: boolean;
  onPressAvailability?: (doctor: Doctor) => void;
};

const getExperienceLabel = (experience: Doctor["experience"]) => {
  const years = experience?.years ?? 0;
  const months = experience?.months ?? 0;
  if (months > 0) return `${years} yrs ${months} months`;
  return `${years} yrs`;
};

const getDoctorPhotoUri = (doctor: Doctor) => {
  if (doctor.photo) return doctor.photo;
  const encodedName = encodeURIComponent(doctor.name ?? "Doctor");
  return `https://ui-avatars.com/api/?name=${encodedName}&background=DBEAFE&color=2563EB&size=256&rounded=true`;
};

const getAvailabilityLabel = (doctor: Doctor) => {
  const entries = Object.entries(doctor.slotsByDate ?? {});
  if (entries.length === 0) return "Slots open this week";
  const firstDateSlots = entries[0]?.[1] ?? [];
  if (firstDateSlots.length === 0) return "Slots open this week";
  return firstDateSlots.slice(0, 2).map((slot) => slot.time).join(", ");
};

const getRecommendationLabel = (rating: Doctor["rating"]) => {
  if (typeof rating !== "number") return "95%";
  const percentage = Math.min(99, Math.max(90, Math.round(rating * 20)));
  return `${percentage}%`;
};

export default function Doctorcard({ doctor, isDesktopLike, onPressAvailability }: DoctorCardProps) {
  const specialization = doctor.specialty ?? "-";
  const rating = doctor.rating ?? "-";
  const fee =
    doctor.fee !== undefined && doctor.fee !== null ? `Rs ${doctor.fee}` : "-";
  const experience = getExperienceLabel(doctor.experience);
  const availability = getAvailabilityLabel(doctor);
  const recommendation = getRecommendationLabel(doctor.rating);

  return (
    <View style={[styles.card, isDesktopLike && styles.cardDesktop]}>
      <View style={[styles.contentRow, isDesktopLike && styles.contentRowDesktop]}>
        <Image
          source={{ uri: getDoctorPhotoUri(doctor) }}
          style={[styles.photo, isDesktopLike && styles.photoDesktop]}
        />

        <View style={styles.profileTextWrap}>
          <Text style={[styles.name, isDesktopLike && styles.nameDesktop]}>{doctor.name ?? "-"}</Text>
          <Text style={[styles.subLine, isDesktopLike && styles.subLineDesktop]}>{specialization}</Text>
          <Text style={[styles.subLine, isDesktopLike && styles.subLineDesktop]}>
            {experience} experience overall
          </Text>
          <Text style={[styles.subLine, isDesktopLike && styles.subLineDesktop]}>cuure.health</Text>

          <Text style={[styles.feeLine, isDesktopLike && styles.feeLineDesktop]}>
            <Text style={styles.feeValue}>{fee}</Text>
            <Text style={styles.feeMeta}> consultation fee at clinic</Text>
          </Text>
          <Text style={[styles.availableLine, isDesktopLike && styles.availableLineDesktop]}>
            <Text style={styles.availableLabel}>Available: </Text>
            {availability}
          </Text>
        </View>

        {isDesktopLike ? (
          <TouchableOpacity
            style={[styles.button, styles.buttonDesktop]}
            onPress={() => onPressAvailability?.(doctor)}
          >
            <Text style={styles.buttonText}>Check Availability →</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {!isDesktopLike ? (
        <TouchableOpacity style={styles.button} onPress={() => onPressAvailability?.(doctor)}>
          <Text style={styles.buttonText}>Check Availability →</Text>
        </TouchableOpacity>
      ) : null}

      <View style={[styles.badgesRow, isDesktopLike && styles.badgesRowDesktop]}>
        <View style={styles.badge}>
          <Text style={styles.badgeValue}>{recommendation}</Text>
          <Text style={[styles.badgeLabel, isDesktopLike && styles.badgeLabelDesktop]}>
            Patient Recommendation
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeValue}>{rating}</Text>
          <Text style={[styles.badgeLabel, isDesktopLike && styles.badgeLabelDesktop]}>Patient Rating</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  cardDesktop: {
    borderRadius: 0,
    paddingVertical: 22,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 18,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  contentRowDesktop: {
    alignItems: "center",
  },
  profileTextWrap: {
    flex: 1,
    marginLeft: 16,
  },
  photo: {
    width: 118,
    height: 128,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#E5E7EB",
  },
  photoDesktop: {
    width: 132,
    height: 140,
    borderRadius: 16,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    lineHeight: 20,
  },
  nameDesktop: {
    fontSize: 26,
    lineHeight: 31,
  },
  subLine: {
    marginTop: 3,
    fontSize: 11,
    color: "#475569",
  },
  subLineDesktop: {
    fontSize: 12,
  },
  feeLine: {
    marginTop: 8,
    color: "#1F2937",
    fontSize: 11,
  },
  feeLineDesktop: {
    fontSize: 12,
  },
  feeValue: {
    color: "#111827",
    fontWeight: "700",
  },
  feeMeta: {
    color: "#475569",
  },
  availableLine: {
    marginTop: 8,
    fontSize: 11,
    color: "#334155",
  },
  availableLineDesktop: {
    fontSize: 12,
  },
  availableLabel: {
    color: "#2563EB",
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginTop: 14,
    width: "auto",
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDesktop: {
    width: 138,
    marginTop: 0,
    borderRadius: 14,
    marginLeft: 22,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  badgesRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 10,
  },
  badgesRowDesktop: {
    gap: 20,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badgeValue: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
    backgroundColor: "#2563EB",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    overflow: "hidden",
  },
  badgeLabel: {
    color: "#475569",
    fontSize: 11,
  },
  badgeLabelDesktop: {
    fontSize: 12,
  },
});
