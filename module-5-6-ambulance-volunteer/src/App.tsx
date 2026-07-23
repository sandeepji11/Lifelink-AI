import { useState, useEffect } from 'react';
import {
  Ambulance,
  HeartPulse,
  MapPin,
  Navigation as NavIcon,
  Clock,
  CheckCircle2,
  XCircle,
  Shield,
  Award,
  Star,
  Users,
  ChevronLeft,
  Activity,
  Stethoscope,
  Truck,
  Cross,
  CircleDot,
  ArrowRight,
} from 'lucide-react';
import {
  subscribeEmergencies,
  updateEmergency,
  Emergency,
  AMBULANCE_ID,
  VOLUNTEER_ID,
} from './firebase';

type Mode = 'ambulance' | 'volunteer';

// ---------- Shared fallback data ----------
const EMERGENCY = {
  patientName: 'John D.',
  location: '221B Baker St, Downtown',
  emergencyType: 'Cardiac Arrest',
  distance: '1.2 km',
  eta: '4 min',
  coords: { x: 78, y: 62 },
};

const HOSPITAL = {
  name: 'St. Mary Regional Hospital',
  eta: '7 min',
  distance: '3.4 km',
  coords: { x: 22, y: 30 },
};

const TURN_INSTRUCTIONS = [
  { text: 'Head north on Main St', dist: '1.2 km' },
  { text: 'Turn right onto 5th Ave', dist: '600 m' },
  { text: 'Continue to Baker St', dist: '400 m' },
  { text: 'Arrive at destination on the left', dist: '50 m' },
];

const HOSPITAL_INSTRUCTIONS = [
  { text: 'Head south on Baker St', dist: '800 m' },
  { text: 'Turn left onto Highway 9', dist: '2.1 km' },
  { text: 'Exit onto Medical Center Dr', dist: '400 m' },
  { text: 'Arrive at St. Mary Regional Hospital', dist: '100 m' },
];

const VOLUNTEER_INSTRUCTIONS = [
  { text: 'Head east on Park Ln', dist: '450 m' },
  { text: 'Turn left onto Elm St', dist: '300 m' },
  { text: 'Arrive at patient location', dist: '50 m' },
];

const VOLUNTEER_PROFILE = {
  level: 'Level 2 Responder',
  peopleHelped: 12,
  responseCount: 18,
  badges: [
    { name: 'First Aid Certified', icon: Shield },
    { name: 'Quick Responder', icon: Activity },
    { name: 'Community Hero', icon: Star },
  ],
};

// ---------- Theme ----------
const THEME = {
  ambulance: {
    primary: 'orange',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    textDark: 'text-orange-700',
    btn: 'bg-orange-500 hover:bg-orange-600',
    btnSoft: 'bg-orange-100 text-orange-700',
    ring: 'ring-orange-400',
    border: 'border-orange-200',
    solid: 'bg-orange-500',
    gradient: 'from-orange-500 to-orange-600',
  },
  volunteer: {
    primary: 'teal',
    bg: 'bg-teal-50',
    text: 'text-teal-600',
    textDark: 'text-teal-700',
    btn: 'bg-teal-500 hover:bg-teal-600',
    btnSoft: 'bg-teal-100 text-teal-700',
    ring: 'ring-teal-400',
    border: 'border-teal-200',
    solid: 'bg-teal-500',
    gradient: 'from-teal-500 to-teal-600',
  },
};

// ---------- Map placeholder ----------
function MapView({
  theme,
  start = { x: 18, y: 78 },
  end = EMERGENCY.coords,
}: {
  theme: keyof typeof THEME;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}) {
  const t = THEME[theme];
  const pathD = `M ${start.x} ${start.y} C ${(start.x + end.x) / 2} ${start.y - 20}, ${
    (start.x + end.x) / 2
  } ${end.y + 20}, ${end.x} ${end.y}`;

  return (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 shadow-inner">
      {/* fake streets */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {/* horizontal roads */}
        <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#e2e8f0" strokeWidth="14" />
        <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#e2e8f0" strokeWidth="14" />
        <line x1="0" y1="30%" x2="100%" y2="30%" stroke="white" strokeWidth="2" strokeDasharray="10 8" />
        <line x1="0" y1="70%" x2="100%" y2="70%" stroke="white" strokeWidth="2" strokeDasharray="10 8" />
        {/* vertical roads */}
        <line x1="40%" y1="0" x2="40%" y2="100%" stroke="#e2e8f0" strokeWidth="14" />
        <line x1="75%" y1="0" x2="75%" y2="100%" stroke="#e2e8f0" strokeWidth="14" />
        <line x1="40%" y1="0" x2="40%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="10 8" />
        <line x1="75%" y1="0" x2="75%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="10 8" />
        {/* route line */}
        <path d={pathD} fill="none" stroke={theme === 'ambulance' ? '#f97316' : '#14b8a6'} strokeWidth="5" strokeLinecap="round" strokeDasharray="0" />
      </svg>

      {/* start marker */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${start.x}%`, top: `${start.y}%` }}
      >
        <div className={`w-5 h-5 rounded-full ${t.solid} border-2 border-white shadow-lg`} />
      </div>
      {/* end marker */}
      <div
        className="absolute -translate-x-1/2 -translate-y-full"
        style={{ left: `${end.x}%`, top: `${end.y}%` }}
      >
        <div className="flex flex-col items-center">
          <div className={`px-2 py-1 rounded-md ${t.solid} text-white text-xs font-bold shadow-lg flex items-center gap-1`}>
            <MapPin className="w-3 h-3" />
            Dest
          </div>
          <div className={`w-1 h-3 ${t.solid}`} />
          <div className={`w-3 h-3 rounded-full ${t.solid} border-2 border-white`} />
        </div>
      </div>

      {/* compass */}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-lg px-2 py-1 text-xs font-bold text-slate-600 shadow">
        N ↑
      </div>
    </div>
  );
}

// ---------- Toggle switch ----------
function Toggle({
  on,
  onChange,
  theme,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  theme: keyof typeof THEME;
  label: string;
}) {
  const t = THEME[theme];
  return (
    <button
      onClick={() => onChange(!on)}
      className={`flex items-center justify-between w-full px-5 py-4 rounded-2xl border transition ${
        on ? `${t.border} bg-white shadow-sm` : 'border-slate-200 bg-white shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            on ? t.btnSoft : 'bg-slate-100 text-slate-400'
          }`}
        >
          <CircleDot className="w-5 h-5" />
        </div>
        <div className="text-left">
          <div className="text-sm font-bold text-slate-800">{label}</div>
          <div className={`text-xs font-semibold ${on ? t.text : 'text-slate-400'}`}>
            {on ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>
      <div
        className={`relative w-14 h-8 rounded-full transition-colors ${on ? t.solid : 'bg-slate-300'}`}
      >
        <div
          className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
            on ? 'left-7' : 'left-1'
          }`}
        />
      </div>
    </button>
  );
}

// ---------- Top bar ----------
function TopBar({
  mode,
  setMode,
  onBack,
  title,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
  onBack?: () => void;
  title?: string;
}) {
  const t = THEME[mode];
  return (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-3 mb-3">
          {onBack ? (
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className={`w-9 h-9 rounded-xl ${t.solid} flex items-center justify-center text-white`}>
              {mode === 'ambulance' ? <Ambulance className="w-5 h-5" /> : <HeartPulse className="w-5 h-5" />}
            </div>
          )}
          <div className="flex-1">
            <div className="text-xs text-slate-500 font-semibold">LifeLink AI</div>
            <div className="text-sm font-bold text-slate-800">
              {title ?? (mode === 'ambulance' ? 'Ambulance Driver' : 'Volunteer')}
            </div>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setMode('ambulance')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition ${
              mode === 'ambulance' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Ambulance className="w-4 h-4" />
            Ambulance
          </button>
          <button
            onClick={() => setMode('volunteer')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition ${
              mode === 'volunteer' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            Volunteer
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Emergency card ----------
function EmergencyCard({
  mode,
  emergency,
  onAccept,
  onDecline,
}: {
  mode: Mode;
  emergency: Emergency;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const t = THEME[mode];
  return (
    <div className={`rounded-2xl bg-white border-2 ${t.border} shadow-lg overflow-hidden animate-[pulse_2s_ease-in-out_infinite]`}>
      <div className={`px-4 py-2 ${t.solid} text-white flex items-center justify-between`}>
        <div className="flex items-center gap-2 font-bold text-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          NEW EMERGENCY
        </div>
        <Clock className="w-4 h-4" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-xs text-slate-500 font-semibold">Patient</div>
            <div className="text-base font-bold text-slate-800">
              {emergency.patientName ?? 'Unknown'}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {emergency.emergencyType && (
              <div className={`px-3 py-1 rounded-full ${t.btnSoft} text-xs font-bold flex items-center gap-1`}>
                <HeartPulse className="w-3 h-3" />
                {emergency.emergencyType}
              </div>
            )}
            {emergency.aiSeverity && (
              <div className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                {emergency.aiSeverity}
              </div>
            )}
          </div>
        </div>

        {emergency.description && (
          <p className="text-sm text-slate-600 mb-3">{emergency.description}</p>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className={`w-4 h-4 ${t.text}`} />
            <span className="font-medium">{emergency.location ?? 'Location pending'}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {emergency.distance && (
              <div className="flex items-center gap-1.5 text-slate-600">
                <NavIcon className={`w-4 h-4 ${t.text}`} />
                <span className="font-semibold">{emergency.distance}</span>
              </div>
            )}
            {emergency.eta && (
              <div className="flex items-center gap-1.5 text-slate-600">
                <Clock className={`w-4 h-4 ${t.text}`} />
                <span className="font-semibold">ETA {emergency.eta}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onDecline}
            className="py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 flex items-center justify-center gap-1.5"
          >
            <XCircle className="w-4 h-4" />
            Decline
          </button>
          <button
            onClick={onAccept}
            className={`py-3 rounded-xl ${t.btn} text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-sm`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Turn-by-turn list ----------
function TurnList({ items, theme }: { items: { text: string; dist: string }[]; theme: keyof typeof THEME }) {
  const t = THEME[theme];
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className={`px-4 py-2 ${t.btnSoft} text-xs font-bold flex items-center gap-2`}>
        <NavIcon className="w-4 h-4" />
        TURN-BY-TURN
      </div>
      <ol className="divide-y divide-slate-100">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-3">
            <div className={`w-7 h-7 rounded-full ${t.btnSoft} flex items-center justify-center text-xs font-bold`}>
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-800">{it.text}</div>
              <div className="text-xs text-slate-500">{it.dist}</div>
            </div>
            {i === 0 && (
              <div className={`text-xs font-bold ${t.text} flex items-center gap-1`}>
                Now <ArrowRight className="w-3 h-3" />
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

// ---------- Primary action button ----------
function ActionButton({
  theme,
  onClick,
  children,
  icon: Icon,
}: {
  theme: keyof typeof THEME;
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const t = THEME[theme];
  return (
    <button
      onClick={onClick}
      className={`w-full py-4 rounded-2xl ${t.btn} text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition`}
    >
      <Icon className="w-5 h-5" />
      {children}
    </button>
  );
}

// ---------- Section header ----------
function SectionLabel({ children, theme }: { children: React.ReactNode; theme: keyof typeof THEME }) {
  const t = THEME[theme];
  return <div className={`text-xs font-bold ${t.text} uppercase tracking-wide`}>{children}</div>;
}

// ---------- Error banner ----------
function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}

// ============================================================
// AMBULANCE MODE
// ============================================================
type AmbulanceStage = 'home' | 'nav' | 'pickup' | 'toHospital' | 'done';

function AmbulanceMode() {
  const [online, setOnline] = useState(true);
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<Emergency | null>(null);
  const [stage, setStage] = useState<AmbulanceStage>('home');

  useEffect(() => {
    const unsub = subscribeEmergencies(
      ['accepted'],
      (items) => {
        setEmergencies(items);
        setError(null);
      },
      (err) => setError(err.message),
    );
    return () => unsub();
  }, []);

  const accept = async (em: Emergency) => {
    setActive(em);
    setStage('nav');
    try {
      await updateEmergency(em.id, {
        status: 'ambulance_dispatched',
        ambulanceId: AMBULANCE_ID,
      });
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const patch = async (updates: Record<string, unknown>) => {
    if (!active) return;
    try {
      await updateEmergency(active.id, updates);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (stage === 'home') {
    return (
      <div className="px-4 py-4 space-y-4">
        <Toggle on={online} onChange={setOnline} theme="ambulance" label="You are Online" />

        {error && <ErrorBanner message={error} />}

        {online &&
          emergencies.map((em) => (
            <EmergencyCard
              key={em.id}
              mode="ambulance"
              emergency={em}
              onAccept={() => accept(em)}
              onDecline={() => setEmergencies((prev) => prev.filter((p) => p.id !== em.id))}
            />
          ))}

        {online && emergencies.length === 0 && !error && (
          <div className="rounded-2xl bg-white border border-slate-200 p-6 text-center shadow-sm">
            <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
              <Ambulance className="w-7 h-7" />
            </div>
            <div className="font-bold text-slate-800">Waiting for emergencies</div>
            <div className="text-sm text-slate-500 mt-1">You'll be notified when a new call comes in.</div>
          </div>
        )}

        {!online && (
          <div className="rounded-2xl bg-white border border-slate-200 p-6 text-center shadow-sm">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Ambulance className="w-7 h-7" />
            </div>
            <div className="font-bold text-slate-800">You are Offline</div>
            <div className="text-sm text-slate-500 mt-1">Go online to receive emergency calls.</div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          <StatCard icon={Cross} label="Today" value="3" theme="ambulance" />
          <StatCard icon={Clock} label="On Duty" value="2h" theme="ambulance" />
          <StatCard icon={CheckCircle2} label="Saved" value="14" theme="ambulance" />
        </div>
      </div>
    );
  }

  if (stage === 'nav') {
    const em = active;
    return (
      <div className="px-4 py-4 space-y-4">
        <SectionLabel theme="ambulance">Navigating to Patient</SectionLabel>
        <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-semibold">Patient</div>
              <div className="font-bold text-slate-800">{em?.patientName ?? 'Unknown'}</div>
              {em?.emergencyType && (
                <div className="text-xs text-slate-500 mt-0.5">{em.emergencyType}</div>
              )}
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 font-semibold">ETA</div>
              <div className="font-bold text-orange-600">{em?.eta ?? EMERGENCY.eta}</div>
            </div>
          </div>
        </div>
        <MapView theme="ambulance" />
        <TurnList items={TURN_INSTRUCTIONS} theme="ambulance" />
        <ActionButton
          theme="ambulance"
          icon={CheckCircle2}
          onClick={() => {
            setStage('pickup');
            patch({ status: 'ambulance_arrived' });
          }}
        >
          Arrived at Scene
        </ActionButton>
      </div>
    );
  }

  if (stage === 'pickup') {
    const em = active;
    return (
      <div className="px-4 py-4 space-y-4">
        <SectionLabel theme="ambulance">Patient Pickup</SectionLabel>
        <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-slate-800">{em?.patientName ?? 'Unknown'}</div>
              <div className="text-sm text-slate-500">{em?.emergencyType ?? 'Emergency'}</div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <ChecklistItem label="Vitals assessed" done />
            <ChecklistItem label="Stretcher ready" done />
            <ChecklistItem label="Patient loaded" pending />
          </div>
        </div>
        <ActionButton
          theme="ambulance"
          icon={Stethoscope}
          onClick={() => {
            setStage('toHospital');
            patch({ status: 'patient_picked_up' });
          }}
        >
          Confirm Patient Picked Up
        </ActionButton>
      </div>
    );
  }

  if (stage === 'toHospital') {
    return (
      <div className="px-4 py-4 space-y-4">
        <SectionLabel theme="ambulance">Navigate to Hospital</SectionLabel>
        <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
              <Cross className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-800">{HOSPITAL.name}</div>
              <div className="text-sm text-slate-500">{HOSPITAL.distance} away</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 font-semibold">ETA</div>
              <div className="font-bold text-orange-600">{HOSPITAL.eta}</div>
            </div>
          </div>
        </div>
        <MapView theme="ambulance" start={{ x: 78, y: 62 }} end={HOSPITAL.coords} />
        <TurnList items={HOSPITAL_INSTRUCTIONS} theme="ambulance" />
        <ActionButton
          theme="ambulance"
          icon={CheckCircle2}
          onClick={() => {
            setStage('done');
            patch({ status: 'at_hospital' });
          }}
        >
          Arrived at Hospital
        </ActionButton>
      </div>
    );
  }

  // done
  return (
    <div className="px-4 py-4 space-y-4">
      <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="text-lg font-bold text-slate-800">Mission Complete</div>
        <div className="text-sm text-slate-500 mt-1">
          Patient {active?.patientName ?? 'Unknown'} delivered to {HOSPITAL.name}.
        </div>
        <button
          onClick={() => {
            setActive(null);
            setStage('home');
          }}
          className="mt-5 w-full py-3 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

function ChecklistItem({ label, done, pending }: { label: string; done?: boolean; pending?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center ${
          done ? 'bg-green-500 text-white' : pending ? 'border-2 border-slate-300' : 'bg-slate-200'
        }`}
      >
        {done && <CheckCircle2 className="w-3 h-3" />}
      </div>
      <span className={`${done ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>{label}</span>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  theme,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  theme: keyof typeof THEME;
}) {
  const t = THEME[theme];
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-3 text-center shadow-sm">
      <Icon className={`w-5 h-5 mx-auto mb-1 ${t.text}`} />
      <div className="font-bold text-slate-800">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

// ============================================================
// VOLUNTEER MODE
// ============================================================
type VolunteerStage = 'home' | 'nav' | 'status' | 'profile' | 'done';

function VolunteerMode() {
  const [available, setAvailable] = useState(true);
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<Emergency | null>(null);
  const [stage, setStage] = useState<VolunteerStage>('home');
  const [status, setStatus] = useState<'arrived' | 'aid' | 'handed' | null>(null);

  useEffect(() => {
    const unsub = subscribeEmergencies(
      ['pending', 'accepted'],
      (items) => {
        setEmergencies(items);
        setError(null);
      },
      (err) => setError(err.message),
    );
    return () => unsub();
  }, []);

  const accept = async (em: Emergency) => {
    setActive(em);
    setStage('nav');
    try {
      await updateEmergency(em.id, {
        volunteerId: VOLUNTEER_ID,
        volunteerStatus: 'en_route',
      });
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (stage === 'home') {
    return (
      <div className="px-4 py-4 space-y-4">
        <Toggle on={available} onChange={setAvailable} theme="volunteer" label="Available for First Aid" />

        {error && <ErrorBanner message={error} />}

        {available &&
          emergencies.map((em) => (
            <EmergencyCard
              key={em.id}
              mode="volunteer"
              emergency={em}
              onAccept={() => accept(em)}
              onDecline={() => setEmergencies((prev) => prev.filter((p) => p.id !== em.id))}
            />
          ))}

        {available && emergencies.length === 0 && !error && (
          <div className="rounded-2xl bg-white border border-slate-200 p-6 text-center shadow-sm">
            <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-3">
              <HeartPulse className="w-7 h-7" />
            </div>
            <div className="font-bold text-slate-800">Listening for nearby requests</div>
            <div className="text-sm text-slate-500 mt-1">You'll see first aid calls near you.</div>
          </div>
        )}

        {!available && (
          <div className="rounded-2xl bg-white border border-slate-200 p-6 text-center shadow-sm">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <HeartPulse className="w-7 h-7" />
            </div>
            <div className="font-bold text-slate-800">You're Unavailable</div>
            <div className="text-sm text-slate-500 mt-1">Toggle on to receive first aid requests.</div>
          </div>
        )}

        <button
          onClick={() => setStage('profile')}
          className="w-full rounded-2xl bg-white border border-slate-200 p-4 shadow-sm flex items-center gap-3 hover:bg-slate-50"
        >
          <div className="w-11 h-11 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-bold text-slate-800 text-sm">{VOLUNTEER_PROFILE.level}</div>
            <div className="text-xs text-slate-500">
              {VOLUNTEER_PROFILE.peopleHelped} people helped
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-slate-400 rotate-180" />
        </button>
      </div>
    );
  }

  if (stage === 'nav') {
    const em = active;
    return (
      <div className="px-4 py-4 space-y-4">
        <SectionLabel theme="volunteer">Navigating to Patient</SectionLabel>
        <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-semibold">Patient</div>
              <div className="font-bold text-slate-800">{em?.patientName ?? 'Unknown'}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 font-semibold">ETA</div>
              <div className="font-bold text-teal-600">{em?.eta ?? EMERGENCY.eta}</div>
            </div>
          </div>
        </div>
        <MapView theme="volunteer" />
        <TurnList items={VOLUNTEER_INSTRUCTIONS} theme="volunteer" />
        <ActionButton theme="volunteer" icon={CheckCircle2} onClick={() => setStage('status')}>
          Arrived at Patient
        </ActionButton>
      </div>
    );
  }

  if (stage === 'status') {
    const em = active;
    const steps: {
      key: 'arrived' | 'aid' | 'handed';
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      volStatus: string;
    }[] = [
      { key: 'arrived', label: 'Arrived', icon: MapPin, volStatus: 'arrived' },
      { key: 'aid', label: 'Providing First Aid', icon: Stethoscope, volStatus: 'providing_first_aid' },
      { key: 'handed', label: 'Handed to Ambulance', icon: Truck, volStatus: 'handed_to_ambulance' },
    ];
    const order = ['arrived', 'aid', 'handed'] as const;
    const currentIndex = status ? order.indexOf(status) : -1;

    return (
      <div className="px-4 py-4 space-y-4">
        <SectionLabel theme="volunteer">First Aid Status</SectionLabel>

        <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-slate-800">{em?.patientName ?? 'Unknown'}</div>
              <div className="text-sm text-slate-500">{em?.emergencyType ?? 'Emergency'}</div>
            </div>
          </div>

          {/* progress */}
          <div className="flex items-center mb-5">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center flex-1 last:flex-none">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${
                    currentIndex >= i ? 'bg-teal-500 border-teal-500 text-white' : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  <s.icon className="w-4 h-4" />
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-1 rounded ${currentIndex > i ? 'bg-teal-500' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {steps.map((s, i) => {
              const activeStep = status === s.key;
              const done = currentIndex > i;
              return (
                <button
                  key={s.key}
                  disabled={done || (i > 0 && currentIndex < i - 1)}
                  onClick={async () => {
                    setStatus(s.key);
                    if (em) {
                      try {
                        await updateEmergency(em.id, { volunteerStatus: s.volStatus });
                      } catch (e) {
                        setError((e as Error).message);
                      }
                    }
                    if (s.key === 'handed') setTimeout(() => setStage('done'), 400);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition text-left ${
                    activeStep
                      ? 'bg-teal-50 border-teal-400'
                      : done
                      ? 'bg-teal-50 border-teal-200 opacity-70'
                      : 'bg-white border-slate-200 hover:border-teal-300'
                  } ${i > 0 && currentIndex < i - 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      done ? 'bg-teal-500 text-white' : activeStep ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {done ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                  </div>
                  <span className="font-semibold text-sm text-slate-800">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'profile') {
    return (
      <div className="px-4 py-4 space-y-4">
        <SectionLabel theme="volunteer">Volunteer Profile</SectionLabel>

        <div className="rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 p-5 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <HeartPulse className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs font-semibold text-teal-100">Volunteer</div>
              <div className="text-xl font-bold">Alex Rivera</div>
              <div className="text-sm text-teal-100">{VOLUNTEER_PROFILE.level}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-white/15 backdrop-blur rounded-xl p-3">
              <div className="text-2xl font-bold">{VOLUNTEER_PROFILE.peopleHelped}</div>
              <div className="text-xs text-teal-100">People helped</div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl p-3">
              <div className="text-2xl font-bold">{VOLUNTEER_PROFILE.responseCount}</div>
              <div className="text-xs text-teal-100">Total responses</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
          <div className="text-sm font-bold text-slate-800 mb-3">Badges</div>
          <div className="grid grid-cols-3 gap-3">
            {VOLUNTEER_PROFILE.badges.map((b) => (
              <div key={b.name} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-2">
                  <b.icon className="w-7 h-7" />
                </div>
                <div className="text-xs font-semibold text-slate-700">{b.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-teal-600" />
            <div className="text-sm font-bold text-slate-800">Recent Activity</div>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-slate-600">First aid at Market St</span>
              <span className="text-slate-400 text-xs">2d ago</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600">Assisted at Park Ln</span>
              <span className="text-slate-400 text-xs">5d ago</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600">CPR support</span>
              <span className="text-slate-400 text-xs">1w ago</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // done
  return (
    <div className="px-4 py-4 space-y-4">
      <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="text-lg font-bold text-slate-800">Handover Complete</div>
        <div className="text-sm text-slate-500 mt-1">
          Patient {active?.patientName ?? 'Unknown'} handed to ambulance. Thank you for your help!
        </div>
        <button
          onClick={() => {
            setActive(null);
            setStatus(null);
            setStage('home');
          }}
          className="mt-5 w-full py-3 rounded-xl bg-teal-500 text-white font-bold text-sm hover:bg-teal-600"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

// ============================================================
// ROOT APP
// ============================================================
export default function App() {
  const [mode, setMode] = useState<Mode>('ambulance');

  return (
    <div className={`min-h-screen ${THEME[mode].bg}`}>
      <div className="max-w-md mx-auto min-h-screen bg-slate-50 shadow-xl relative">
        <TopBar
          mode={mode}
          setMode={(m) => setMode(m)}
          title={mode === 'ambulance' ? 'Ambulance Driver Mode' : 'Volunteer Mode'}
        />
        <div className="pb-10">
          {mode === 'ambulance' ? <AmbulanceMode /> : <VolunteerMode />}
        </div>
        <div className="text-center text-xs text-slate-400 pb-6">
          LifeLink AI · Live data from Firestore
        </div>
      </div>
    </div>
  );
}
