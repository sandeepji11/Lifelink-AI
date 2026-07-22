import {
  CarFront,
  HeartPulse,
  Flame,
  ShieldAlert,
  Stethoscope,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export type Screen = "home" | "select" | "sending" | "help";

export interface EmergencyType {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  eta: number;
  responder: string;
}

export const EMERGENCY_TYPES: EmergencyType[] = [
  {
    id: "road",
    label: "Road Accident",
    description: "Vehicle collision or crash",
    icon: CarFront,
    accent: "from-amber-500 to-orange-600",
    eta: 8,
    responder: "Ambulance",
  },
  {
    id: "heart",
    label: "Heart Attack",
    description: "Cardiac emergency",
    icon: HeartPulse,
    accent: "from-rose-500 to-red-600",
    eta: 6,
    responder: "Ambulance",
  },
  {
    id: "fire",
    label: "Fire",
    description: "Structural or wildfire",
    icon: Flame,
    accent: "from-orange-500 to-red-600",
    eta: 10,
    responder: "Fire Brigade",
  },
  {
    id: "crime",
    label: "Crime",
    description: "Violent or suspicious activity",
    icon: ShieldAlert,
    accent: "from-slate-700 to-slate-900",
    eta: 7,
    responder: "Police",
  },
  {
    id: "medical",
    label: "Medical Emergency",
    description: "Other urgent medical need",
    icon: Stethoscope,
    accent: "from-sky-500 to-blue-600",
    eta: 9,
    responder: "Paramedics",
  },
  {
    id: "other",
    label: "Other",
    description: "Any other emergency",
    icon: HelpCircle,
    accent: "from-violet-500 to-purple-600",
    eta: 12,
    responder: "Response Team",
  },
];
