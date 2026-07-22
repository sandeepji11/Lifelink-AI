import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase";

export interface EmergencyRecord {
  id: string;
  userId: string;
  emergencyType: string;
  description: string;
  status: "pending" | "triaging" | "dispatched" | "resolved" | "cancelled";
  severity?: "low" | "medium" | "high" | "critical";
  severityReason?: string;
  eta?: number;
  recommendedHospital?: string;
  hospitalRecommendationReason?: string;
  latitude: number;
  longitude: number;
  createdAt: unknown;
}

export interface CreateEmergencyInput {
  userId: string;
  emergencyType: string;
  description?: string;
  latitude: number;
  longitude: number;
}

const COLLECTION = "emergencies";

export async function createEmergency(
  input: CreateEmergencyInput
): Promise<string> {
  const db = getDb();
  const ref = await addDoc(collection(db, COLLECTION), {
    userId: input.userId,
    emergencyType: input.emergencyType,
    description: input.description ?? "",
    status: "pending",
    latitude: input.latitude,
    longitude: input.longitude,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export function subscribeToEmergency(
  id: string,
  cb: (rec: EmergencyRecord | null) => void
): Unsubscribe {
  const db = getDb();
  return onSnapshot(doc(db, COLLECTION, id), (snap) => {
    if (!snap.exists()) {
      cb(null);
      return;
    }
    const data = snap.data() as Omit<EmergencyRecord, "id">;
    cb({ id: snap.id, ...data });
  });
}

export async function cancelEmergency(id: string): Promise<void> {
  const db = getDb();
  await updateDoc(doc(db, COLLECTION, id), {
    status: "cancelled",
  });
}
