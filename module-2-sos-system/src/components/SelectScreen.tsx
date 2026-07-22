import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { EMERGENCY_TYPES, type EmergencyType } from "@/types";

interface SelectScreenProps {
  onSelect: (type: EmergencyType, description: string) => void;
  onBack: () => void;
}

export function SelectScreen({ onSelect, onBack }: SelectScreenProps) {
  const [description, setDescription] = useState("");

  return (
    <div className="flex min-h-full flex-col animate-fade-in">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15 active:scale-95"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-xs font-semibold uppercase tracking-widest text-red-400">
          Emergency
        </span>
        <span className="h-10 w-10" />
      </div>

      <div className="px-5 pb-3">
        <h1 className="text-2xl font-black text-white">What's the emergency?</h1>
        <p className="mt-1 text-sm text-white/60">
          Select a type so responders know what to prepare for.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 pb-4 pt-2">
        {EMERGENCY_TYPES.map((type, i) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => onSelect(type, description.trim())}
              style={{ animationDelay: `${i * 60}ms` }}
              className="group flex flex-col items-start gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/10 active:scale-95 animate-fade-in"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${type.accent} shadow-lg`}
              >
                <Icon className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-base font-bold leading-tight text-white">
                  {type.label}
                </p>
                <p className="mt-0.5 text-xs text-white/50">
                  {type.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Optional description */}
      <div className="px-5 pb-8 pt-2">
        <label
          htmlFor="desc"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/40"
        >
          Add details (optional)
        </label>
        <textarea
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          maxLength={200}
          placeholder="e.g. Two-car collision on the highway, someone is trapped."
          className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-red-400/50 focus:bg-white/10"
        />
        <p className="mt-1 text-right text-[10px] text-white/30">
          {description.length}/200
        </p>
      </div>
    </div>
  );
}
