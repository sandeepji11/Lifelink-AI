import { ArrowLeft, Activity, Droplet, AlertTriangle, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { User } from '../types';

interface Props {
  user: User;
  onBack: () => void;
}

// Lightweight deterministic QR-style pattern (visual placeholder, not scannable).
function usePattern(seed: string) {
  const [grid, setGrid] = useState<boolean[][]>([]);
  useEffect(() => {
    const size = 21;
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    const rand = () => {
      h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
      return ((h >>> 0) % 1000) / 1000;
    };
    const g: boolean[][] = [];
    for (let y = 0; y < size; y++) {
      const row: boolean[] = [];
      for (let x = 0; x < size; x++) {
        const finder = (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
        if (finder) {
          const lx = x < 7 ? x : x - (size - 7);
          const ly = y < 7 ? y : y - (size - 7);
          row.push(lx === 0 || ly === 0 || lx === 6 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4));
        } else {
          row.push(rand() > 0.5);
        }
      }
      g.push(row);
    }
    setGrid(g);
  }, [seed]);
  return grid;
}

export default function QRMedicalID({ user, onBack }: Props) {
  const payload = `LIFELINK|${user.fullName}|${user.medical.bloodGroup}|${user.medical.allergies.slice(0, 3).join(';')}`;
  const grid = usePattern(payload);
  const topAllergy = user.medical.allergies[0] ?? 'None';

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 to-red-700 flex flex-col">
      <header className="px-4 h-14 flex items-center justify-between text-white">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          <span className="font-bold">My QR Medical ID</span>
        </div>
        <button className="text-white/80 hover:text-white">
          <Share2 className="w-4 h-4" />
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 pb-10">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-6 pt-6 pb-3 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold tracking-wide">
              <Activity className="w-3.5 h-3.5" />
              EMERGENCY MEDICAL ID
            </div>
            <h1 className="mt-3 text-xl font-bold text-gray-900">{user.fullName}</h1>
          </div>

          <div className="px-8 py-6 flex justify-center">
            <div className="relative">
              <div className="p-4 bg-white rounded-2xl border-4 border-red-100 shadow-inner">
                {grid.length > 0 && (
                  <svg width="220" height="220" viewBox={`0 0 ${grid.length} ${grid.length}`} className="block">
                    {grid.map((row, y) =>
                      row.map((on, x) =>
                        on ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#1f2937" /> : null
                      )
                    )}
                  </svg>
                )}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-md ring-2 ring-red-100">
                    <Activity className="w-6 h-6 text-red-600" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-2 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50">
              <Droplet className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Blood Group</p>
                <p className="text-base font-bold text-red-700">{user.medical.bloodGroup}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div className="min-w-0">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Top Allergy</p>
                <p className="text-base font-bold text-amber-700 truncate">{topAllergy}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 mt-1 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Scan to view emergency medical information. If found unresponsive, show this to first responders.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
