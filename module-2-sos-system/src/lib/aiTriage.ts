import { doc, updateDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import type { EmergencyType } from "@/types";

type Severity = "low" | "medium" | "critical";

const WORD_TO_SEVERITY: Record<string, Severity> = {
  critical: "critical",
  moderate: "medium",
  low: "low",
};

const ETA_BY_SEVERITY: Record<Severity, number> = {
  critical: 5,
  medium: 8,
  low: 12,
};

const REASON_BY_SEVERITY: Record<Severity, string> = {
  critical:
    "AI flagged this as Critical — dispatching the nearest responders with highest priority.",
  medium:
    "AI flagged this as Moderate — dispatching responders with standard priority.",
  low:
    "AI flagged this as Low — dispatching responders for assessment and support.",
};

interface Hospital {
  name: string;
  distanceKm: number;
  icuBedsAvailable: number;
  emergencyBedsAvailable: number;
}

const HOSPITALS: Hospital[] = [
  {
    name: "St. Mary's Medical Center",
    distanceKm: 3.2,
    icuBedsAvailable: 4,
    emergencyBedsAvailable: 7,
  },
  {
    name: "Riverside General Hospital",
    distanceKm: 7.8,
    icuBedsAvailable: 1,
    emergencyBedsAvailable: 12,
  },
  {
    name: "Apex Trauma Center",
    distanceKm: 12.4,
    icuBedsAvailable: 8,
    emergencyBedsAvailable: 3,
  },
  {
    name: "Lakeside Community Hospital",
    distanceKm: 5.6,
    icuBedsAvailable: 0,
    emergencyBedsAvailable: 9,
  },
];

function parseSeverity(raw: string): Severity {
  const cleaned = raw.trim().toLowerCase().replace(/[^a-z]/g, "");
  return WORD_TO_SEVERITY[cleaned] ?? "medium";
}

async function callGroq(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_GROQ_API_KEY is not configured");
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Groq API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string") {
    throw new Error(`Groq response missing text: ${JSON.stringify(data)}`);
  }
  return text;
}

async function classifyWithGemini(
  emergencyType: string,
  description: string
): Promise<Severity> {
  const prompt =
    `You are an emergency triage assistant. Given the emergency type and an ` +
    `optional description from the person in distress, assess the severity.\n\n` +
    `Emergency type: ${emergencyType}\n` +
    `Description: ${description || "(none provided)"}\n\n` +
    `Respond with ONLY one word: "Critical", "Moderate", or "Low". ` +
    `No punctuation, no explanation.`;

  return parseSeverity(await callGroq(prompt));
}

function extractJson(text: string): { hospitalName: string; reason: string } {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in Groq response");
  }
  const parsed = JSON.parse(text.slice(start, end + 1));
  if (typeof parsed.hospitalName !== "string" || typeof parsed.reason !== "string") {
    throw new Error("Groq response missing hospitalName or reason");
  }
  return { hospitalName: parsed.hospitalName, reason: parsed.reason };
}

async function recommendHospitalWithGemini(
  severity: Severity
): Promise<{ hospitalName: string; reason: string }> {
  const hospitalList = HOSPITALS.map(
    (h) =>
      `- ${h.name}: ${h.distanceKm} km away, ${h.icuBedsAvailable} ICU beds available, ${h.emergencyBedsAvailable} emergency beds available`
  ).join("\n");

  const prompt =
    `Given this emergency severity: ${severity}, and these hospitals:\n` +
    `${hospitalList}\n\n` +
    `Recommend the single best hospital by name and explain briefly why (1 sentence). ` +
    `Respond in JSON format: {"hospitalName": "...", "reason": "..."}.`;

  return extractJson(await callGroq(prompt));
}

/**
 * Calls the Groq API to assess emergency severity, then patches
 * the Firestore emergency document with status, severity, eta, and a
 * human-readable reason. Then calls Groq again to recommend the best
 * hospital for the severity and stores that recommendation too.
 * The rest of the app reacts to these fields.
 */
export async function runAiTriage(
  emergencyId: string,
  type: EmergencyType,
  description: string
): Promise<void> {
  const db = getDb();

  await updateDoc(doc(db, "emergencies", emergencyId), {
    status: "triaging",
  });

  const severity = await classifyWithGemini(type.label, description);

  await updateDoc(doc(db, "emergencies", emergencyId), {
    status: "dispatched",
    severity,
    severityReason: REASON_BY_SEVERITY[severity],
    eta: ETA_BY_SEVERITY[severity],
  });

  try {
    const rec = await recommendHospitalWithGemini(severity);
    await updateDoc(doc(db, "emergencies", emergencyId), {
      recommendedHospital: rec.hospitalName,
      hospitalRecommendationReason: rec.reason,
    });
  } catch (err) {
    console.error("Hospital recommendation failed:", err);
  }
}
