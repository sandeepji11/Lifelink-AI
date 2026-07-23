import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  QueryConstraint,
  DocumentData,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBdtLv13cFzgn4Ccx8tQTNx3IBpWMVF0Lw',
  authDomain: 'lifelink-ai-5bf0e.firebaseapp.com',
  projectId: 'lifelink-ai-5bf0e',
  storageBucket: 'lifelink-ai-5bf0e.firebasestorage.app',
  messagingSenderId: '409440726399',
  appId: '1:409440726399:web:42e03989526505db527e4a',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const AMBULANCE_ID = 'ambulance-007';
export const VOLUNTEER_ID = 'volunteer-042';

export type Emergency = {
  id: string;
  patientName?: string;
  location?: string;
  emergencyType?: string;
  aiSeverity?: string;
  description?: string;
  status?: string;
  volunteerId?: string;
  volunteerStatus?: string;
  ambulanceId?: string;
  distance?: string;
  eta?: string;
  coords?: { x: number; y: number };
};

export function subscribeEmergencies(
  statuses: string[],
  onData: (items: Emergency[]) => void,
  onError: (err: Error) => void,
): () => void {
  const constraints: QueryConstraint[] = [where('status', 'in', statuses)];
  const q = query(collection(db, 'emergencies'), ...constraints);

  return onSnapshot(
    q,
    (snap) => {
      const items: Emergency[] = [];
      snap.forEach((d) => {
        const data = d.data() as DocumentData;
        items.push({ id: d.id, ...data } as Emergency);
      });
      onData(items);
    },
    (err) => onError(err as Error),
  );
}

export async function updateEmergency(
  id: string,
  updates: Record<string, unknown>,
): Promise<void> {
  await updateDoc(doc(db, 'emergencies', id), updates);
}
