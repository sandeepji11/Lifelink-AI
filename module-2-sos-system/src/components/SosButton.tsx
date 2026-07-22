import { useEffect, useRef, useState } from "react";

interface SosButtonProps {
  onTrigger: () => void;
}

const HOLD_MS = 3000;

export function SosButton({ onTrigger }: SosButtonProps) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const firedRef = useRef(false);

  const cancelHold = () => {
    setHolding(false);
    setProgress(0);
    startRef.current = null;
    firedRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const tick = () => {
    if (startRef.current === null) return;
    const elapsed = performance.now() - startRef.current;
    const pct = Math.min(1, elapsed / HOLD_MS);
    setProgress(pct);
    if (pct >= 1) {
      if (!firedRef.current) {
        firedRef.current = true;
        onTrigger();
      }
      cancelHold();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  };

  const beginHold = () => {
    firedRef.current = false;
    startRef.current = performance.now();
    setHolding(true);
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * progress;

  return (
    <div className="relative flex items-center justify-center select-none">
      {/* Ambient pulsing rings while idle */}
      {!holding && (
        <>
          <span className="absolute h-64 w-64 rounded-full bg-red-500/20 animate-pulse-ring" />
          <span
            className="absolute h-64 w-64 rounded-full bg-red-500/20 animate-pulse-ring"
            style={{ animationDelay: "0.9s" }}
          />
        </>
      )}

      <button
        type="button"
        aria-label="Press and hold to send SOS"
        onPointerDown={(e) => {
          e.preventDefault();
          beginHold();
        }}
        onPointerUp={cancelHold}
        onPointerLeave={cancelHold}
        onPointerCancel={cancelHold}
        onDoubleClick={(e) => {
          e.preventDefault();
          onTrigger();
        }}
        className="group relative h-64 w-64 rounded-full bg-gradient-to-b from-red-500 to-red-700 shadow-2xl shadow-red-900/40 transition-transform active:scale-95 touch-none outline-none"
      >
        {/* Inner gloss */}
        <span className="pointer-events-none absolute inset-3 rounded-full bg-gradient-to-b from-white/25 to-transparent" />
        {/* Progress ring */}
        <svg
          className="pointer-events-none absolute inset-0 -rotate-90"
          viewBox="0 0 256 256"
        >
          <circle
            cx="128"
            cy="128"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="10"
          />
          <circle
            cx="128"
            cy="128"
            r={radius}
            fill="none"
            stroke="white"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            className="transition-[stroke-dasharray] duration-75"
          />
        </svg>
        {/* Label */}
        <span className="relative flex flex-col items-center justify-center">
          <span className="text-6xl font-black tracking-tight text-white drop-shadow">
            SOS
          </span>
          <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-white/80">
            {holding ? "Sending..." : "Hold 3s"}
          </span>
        </span>
      </button>
    </div>
  );
}
