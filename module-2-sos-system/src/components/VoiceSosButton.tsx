import { Mic, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

export function VoiceSosButton() {
  const [open, setOpen] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!open) {
      setSeconds(0);
      return;
    }
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-white backdrop-blur transition hover:bg-white/10 active:scale-95"
      >
        <span className="relative flex h-6 w-6 items-center justify-center">
          <Mic className="h-5 w-5 text-red-400" />
        </span>
        <span className="text-sm font-semibold tracking-wide">Voice SOS</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900 p-7 text-center shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-600/20">
              <Volume2 className="h-9 w-9 animate-pulse text-red-400" />
            </div>
            <p className="text-xl font-bold text-white">Listening...</p>
            <p className="mt-1 text-sm text-white/60">
              Say <span className="font-semibold text-red-400">"Help me"</span>{" "}
              to trigger SOS
            </p>

            {/* Fake waveform */}
            <div className="mt-5 flex h-12 items-center justify-center gap-1">
              {Array.from({ length: 18 }).map((_, i) => (
                <span
                  key={i}
                  className="w-1 rounded-full bg-red-400/80"
                  style={{
                    height: `${20 + Math.abs(Math.sin((i + seconds) * 0.7)) * 80}%`,
                    animation: `breathe 0.8s ease-in-out ${i * 0.05}s infinite`,
                  }}
                />
              ))}
            </div>

            <p className="mt-4 text-xs text-white/40">
              Listening for {seconds}s · tap anywhere to close
            </p>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-5 w-full rounded-2xl bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
