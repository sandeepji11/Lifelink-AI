import { useCallback, useEffect, useRef, useState } from "react";
import { HomeScreen } from "@/components/HomeScreen";
import { SelectScreen } from "@/components/SelectScreen";
import { SendingScreen } from "@/components/SendingScreen";
import { HelpScreen } from "@/components/HelpScreen";
import type { EmergencyType, Screen } from "@/types";
import {
  cancelEmergency,
  createEmergency,
  subscribeToEmergency,
  type EmergencyRecord,
} from "@/lib/emergency";
import { runAiTriage } from "@/lib/aiTriage";

const USER_ID = "test-user-123";
const DUMMY_LAT = 28.6139;
const DUMMY_LNG = 77.209;

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [type, setType] = useState<EmergencyType | null>(null);
  const [record, setRecord] = useState<EmergencyRecord | null>(null);
  const unsubRef = useRef<(() => void) | null>(null);

  const cleanup = useCallback(() => {
    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }
  }, []);

  const goHome = useCallback(() => {
    cleanup();
    setScreen("home");
    setType(null);
    setRecord(null);
  }, [cleanup]);

  const handleTrigger = useCallback(() => {
    setScreen("select");
  }, []);

  const handleSelect = useCallback(
    async (t: EmergencyType, description: string) => {
      setType(t);
      setRecord(null);
      setScreen("sending");
      try {
        const id = await createEmergency({
          userId: USER_ID,
          emergencyType: t.label,
          description,
          latitude: DUMMY_LAT,
          longitude: DUMMY_LNG,
        });

        unsubRef.current = subscribeToEmergency(id, (rec) => {
          if (!rec) return;
          setRecord(rec);
          if (rec.status === "dispatched" && rec.severity) {
            setScreen("help");
          }
        });

        runAiTriage(id, t, description).catch((err) => {
          console.error("AI triage failed:", err);
        });
      } catch (err) {
        console.error("Failed to create emergency", err);
        goHome();
      }
    },
    [goHome]
  );

  const handleCancel = useCallback(async () => {
    if (record) {
      try {
        await cancelEmergency(record.id);
      } catch {
        // ignore — still return home
      }
    }
    goHome();
  }, [record, goHome]);

  useEffect(() => () => cleanup(), [cleanup]);

  return (
    <div className="relative min-h-full w-full bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-red-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        {screen === "home" && <HomeScreen onTrigger={handleTrigger} />}
        {screen === "select" && (
          <SelectScreen onSelect={handleSelect} onBack={goHome} />
        )}
        {screen === "sending" && type && (
          <SendingScreen type={type} record={record} onCancel={handleCancel} />
        )}
        {screen === "help" && type && record && (
          <HelpScreen type={type} record={record} onCancel={handleCancel} />
        )}
      </div>
    </div>
  );
}
