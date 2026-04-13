const BASE_URL = "http://192.168.29.58:8000"; // emulator

export const getPatient = async (id: number) => {
  const res = await fetch(`${BASE_URL}/patients/${id}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};