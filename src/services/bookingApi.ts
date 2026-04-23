import { Platform } from "react-native";

const API_BASE_URL = Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://127.0.0.1:8000";

type BackendDoctor = {
  id: string;
  name: string;
};

const normalizeName = (value: string) => value.toLowerCase().replace(/[^a-z]/g, "");

export type CreateBookingPayload = {
  doctorId: string;
  doctorName: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  date: string;
  slot: string;
  mode: string;
};

export const getAvailableSlots = async (doctorId: string, date: string): Promise<string[]> => {
  const res = await fetch(
    `${API_BASE_URL}/api/doctors/${encodeURIComponent(doctorId)}/available-slots?date=${encodeURIComponent(date)}`
  );
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body?.detail ?? "Failed to load available slots");
  }
  return Array.isArray(body?.slots) ? body.slots : [];
};

export const createBooking = async (payload: CreateBookingPayload) => {
  let resolvedDoctorId = payload.doctorId;

  const doctorsRes = await fetch(`${API_BASE_URL}/api/doctors`);
  if (doctorsRes.ok) {
    const doctorsPayload = await doctorsRes.json();
    const doctorsList: BackendDoctor[] = Array.isArray(doctorsPayload?.doctors)
      ? doctorsPayload.doctors
      : [];
    const byName = doctorsList.find(
      (d) => normalizeName(d.name) === normalizeName(payload.doctorName)
    );
    if (byName?.id) resolvedDoctorId = byName.id;
  }

  const res = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      doctor_id: resolvedDoctorId,
      patient_name: payload.patientName.trim(),
      patient_phone: payload.patientPhone.trim(),
      patient_email: payload.patientEmail.trim(),
      date: payload.date,
      slot: payload.slot,
      mode: payload.mode,
    }),
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body?.detail ?? "Booking failed");
  }
  return body;
};

export const getBookingApiBaseUrl = () => API_BASE_URL;
