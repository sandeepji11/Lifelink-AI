import { MapPin, Navigation, Radio, Loader2 } from "lucide-react";
import type { EmergencyRecord } from "@/lib/emergency";
import type { EmergencyType } from "@/types";

interface SendingScreenProps {
  type: EmergencyType;
  record: EmergencyRecord | null;
  onCancel: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Waiting for AI triage...",
  triaging: "AI is assessing severity...",
};

export function SendingScreen({ type, record, onCancel }: SendingScreenProps) {
  const Icon = type.icon;
  const status = record?.status ?? "pending";
  const statusLabel = STATUS_LABELS[status] ?? "Sending SOS...";

  return (
    <div className="flex min-h-full flex-col items-center px-6 pb-8 pt-8 animate-fade-in">
      {/* Pulsing radar */}
      <div className="relative mt-6 flex h-44 w-44 items-center justify-center">
        <span className="absolute h-44 w-44 rounded-full bg-red-500/20 animate-pulse-ring" />
        <span
          className="absolute h-44 w-44 rounded-full bg-red-500/20 animate-pulse-ring"
          style={{ animationDelay: "0.6s" }}
        />
        <span
          className="absolute h-44 w-44 rounded-full bg-red-500/20 animate-pulse-ring"
          style={{ animationDelay: "1.2s" }}
        />
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-b from-red-500 to-red-700 shadow-2xl shadow-red-900/40">
          <Radio className="h-12 w-12 animate-pulse text-white" />
        </div>
      </div>

      <p className="mt-8 text-2xl font-black text-white">Sending SOS</p>
      <p className="mt-1 text-sm text-white/70">Sharing your live location...</p>

      {/* Selected type chip */}
      <div className="mt-5 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${type.accent}`}
        >
          <Icon className="h-4 w-4 text-white" />
        </span>
        <span className="text-sm font-semibold text-white">{type.label}</span>
      </div>

      {/* Fake map placeholder */}
      <div className="relative mt-7 w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-800/60">
        <div
          className="relative h-52 w-full"
          style={{
            backgroundColor: "#0f172a",
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        >
          <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 bg-slate-600/40" />
          <div className="absolute bottom-0 left-1/3 top-0 w-2 bg-slate-600/40" />
          <div className="absolute right-6 top-0 h-24 w-24 rounded-full bg-emerald-500/10" />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative flex flex-col items-center">
              <span className="absolute -bottom-1 h-4 w-4 animate-ping rounded-full bg-red-500/60" />
              <MapPin className="h-9 w-9 text-red-500 drop-shadow-lg" />
            </div>
          </div>

          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur">
            <Navigation className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[11px] font-medium text-white/80">
              Live location sharing
            </span>
          </div>
        </div>
      </div>

      {/* Live status */}
      <div className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <Loader2 className="h-5 w-5 animate-spin text-red-400" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{statusLabel}</p>
          <p className="text-xs text-white/40">
            Status: <span className="font-mono">{status}</span>
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs text-white/40">
        Connecting to nearest {type.responder.toLowerCase()}...
      </p>

      <button
        onClick={onCancel}
        className="mt-6 w-full rounded-2xl border border-white/15 bg-white/5 py-3.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 active:scale-95"
      >
        Cancel
      </button>
    </div>
  );
}
