import { ShieldCheck, Signal, BatteryFull } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="flex items-center justify-between px-5 pt-5 pb-3">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-600/30">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-extrabold tracking-tight text-white">
            LifeLink <span className="text-red-400">AI</span>
          </p>
          <p className="text-[10px] uppercase tracking-widest text-white/50">
            Smart SOS
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-white/70">
        <Signal className="h-4 w-4" />
        <BatteryFull className="h-4 w-4" />
      </div>
    </header>
  );
}
