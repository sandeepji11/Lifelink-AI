import { SosButton } from "@/components/SosButton";
import { VoiceSosButton } from "@/components/VoiceSosButton";
import { TopBar } from "@/components/TopBar";
import { MapPin, ShieldCheck, Users } from "lucide-react";

interface HomeScreenProps {
  onTrigger: () => void;
}

export function HomeScreen({ onTrigger }: HomeScreenProps) {
  return (
    <div className="flex min-h-full flex-col animate-fade-in">
      <TopBar title="LifeLink AI" subtitle="Smart SOS" />

      <div className="px-5 pt-2">
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <p className="text-xs font-medium text-emerald-300">
            System ready · GPS locked
          </p>
        </div>
      </div>

      {/* Hero / SOS */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <SosButton onTrigger={onTrigger} />

        <p className="mt-8 text-center text-sm font-medium text-white/70">
          Press and hold for 3 seconds to send SOS
        </p>
        <p className="mt-1 text-center text-xs text-white/40">
          or double-tap to trigger emergency
        </p>

        <div className="mt-6">
          <VoiceSosButton />
        </div>
      </div>

      {/* Info strip */}
      <div className="grid grid-cols-3 gap-3 px-5 pb-6">
        <InfoTile icon={MapPin} label="Location" value="Shared" />
        <InfoTile icon={Users} label="Contacts" value="5 notified" />
        <InfoTile icon={ShieldCheck} label="Status" value="Active" />
      </div>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-2 py-3">
      <Icon className="h-5 w-5 text-red-400" />
      <p className="text-[10px] uppercase tracking-wider text-white/40">
        {label}
      </p>
      <p className="text-xs font-semibold text-white">{value}</p>
    </div>
  );
}
