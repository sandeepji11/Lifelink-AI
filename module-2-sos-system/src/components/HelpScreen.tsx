import { Clock, MapPin, Phone, X, Zap, Brain, Building2 } from "lucide-react";
import type { EmergencyRecord } from "@/lib/emergency";
import type { EmergencyType } from "@/types";

interface HelpScreenProps {
  type: EmergencyType;
  record: EmergencyRecord;
  onCancel: () => void;
}

const SEVERITY_STYLES: Record<
  string,
  { label: string; classes: string; ring: string }
> = {
  low: {
    label: "Low",
    classes: "bg-emerald-500/15 text-emerald-400",
    ring: "ring-emerald-500/30",
  },
  medium: {
    label: "Medium",
    classes: "bg-amber-500/15 text-amber-400",
    ring: "ring-amber-500/30",
  },
  high: {
    label: "High",
    classes: "bg-orange-500/15 text-orange-400",
    ring: "ring-orange-500/30",
  },
  critical: {
    label: "Critical",
    classes: "bg-red-500/15 text-red-400",
    ring: "ring-red-500/30",
  },
};

export function HelpScreen({ type, record, onCancel }: HelpScreenProps) {
  const Icon = type.icon;
  const ticketId = record.id.slice(0, 8).toUpperCase();
  const severity = record.severity ?? "medium";
  const sevStyle = SEVERITY_STYLES[severity] ?? SEVERITY_STYLES.medium;
  const eta = record.eta ?? type.eta;

  return (
    <div className="flex min-h-full flex-col items-center px-6 pb-8 pt-10 animate-fade-in">
      {/* Green check */}
      <div className="relative mt-4 flex h-32 w-32 items-center justify-center">
        <span className="absolute h-32 w-32 rounded-full bg-emerald-500/20 animate-ping-slow" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-2xl shadow-emerald-900/40 animate-pop-in">
          <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <h1 className="mt-7 text-3xl font-black text-white">Help is on the way</h1>
      <p className="mt-1 text-sm text-white/60">
        Stay calm. Responders have been dispatched.
      </p>

      {/* AI severity card */}
      <div className="mt-6 w-full rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-violet-400" />
          <p className="text-xs font-bold uppercase tracking-widest text-violet-400">
            AI Severity Assessment
          </p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${type.accent}`}
            >
              <Icon className="h-6 w-6 text-white" />
            </span>
            <div>
              <p className="text-sm font-bold text-white">{type.responder}</p>
              <p className="text-xs text-white/50">{type.label}</p>
            </div>
          </div>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider ring-1 ${sevStyle.classes} ${sevStyle.ring}`}
          >
            {sevStyle.label}
          </span>
        </div>
        {record.severityReason && (
          <p className="mt-3 rounded-2xl bg-white/5 px-3 py-2 text-xs text-white/70">
            "{record.severityReason}"
          </p>
        )}
      </div>

      {/* ETA card */}
      <div className="mt-4 w-full rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-4 rounded-2xl bg-emerald-500/10 p-4">
          <Clock className="h-8 w-8 text-emerald-400" />
          <div>
            <p className="text-3xl font-black leading-none text-white">
              {eta} min
            </p>
            <p className="mt-1 text-xs text-white/60">Estimated arrival time</p>
          </div>
          <span className="ml-auto rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Dispatched
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3 text-sm text-white/70">
          <MapPin className="h-4 w-4 text-red-400" />
          <span className="truncate">
            {record.latitude.toFixed(4)}, {record.longitude.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Hospital recommendation card */}
      <div className="mt-4 w-full rounded-3xl border border-white/10 bg-white/5 p-5">
        {record.recommendedHospital ? (
          <>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-sky-400" />
              <p className="text-xs font-bold uppercase tracking-widest text-sky-400">
                Recommended Hospital
              </p>
            </div>
            <div className="mt-3 rounded-2xl bg-sky-500/10 p-4">
              <p className="text-base font-bold text-white">
                {record.recommendedHospital}
              </p>
              {record.hospitalRecommendationReason && (
                <p className="mt-1 text-xs text-white/70">
                  {record.hospitalRecommendationReason}
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-white/40" />
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                Recommended Hospital
              </p>
            </div>
            <p className="mt-3 rounded-2xl bg-white/5 px-3 py-3 text-sm text-white/50">
              Hospital recommendation unavailable
            </p>
          </>
        )}
      </div>

      <p className="mt-4 text-xs text-white/40">
        Reference: <span className="font-mono text-white/60">{ticketId}</span>
      </p>

      <div className="mt-6 flex w-full gap-3">
        <a
          href="tel:911"
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-bold text-slate-900 transition active:scale-95"
        >
          <Phone className="h-4 w-4" />
          Call 911
        </a>
        <button
          onClick={onCancel}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 py-3.5 text-sm font-bold text-red-400 transition hover:bg-red-500/20 active:scale-95"
        >
          <X className="h-4 w-4" />
          Cancel SOS
        </button>
      </div>
    </div>
  );
}
