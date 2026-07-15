import type { ScoreDefinition } from "../types";

export const abcd2: ScoreDefinition = {
  items: [
    {
      id: "age",
      title: "Age ≥ 60 years",
      layout: "horizontal",
      options: [
        { value: 0, label: "No" },
        { value: 1, label: "Yes" },
      ],
    },
    {
      id: "bp",
      title: "Blood pressure ≥ 140/90 mmHg",
      help: "At initial evaluation; either systolic ≥140 or diastolic ≥90.",
      layout: "horizontal",
      options: [
        { value: 0, label: "No" },
        { value: 1, label: "Yes" },
      ],
    },
    {
      id: "clinical",
      title: "Clinical features of the TIA",
      options: [
        { value: 0, label: "Other symptoms" },
        { value: 1, label: "Speech disturbance without weakness" },
        { value: 2, label: "Unilateral weakness (with or without speech disturbance)" },
      ],
    },
    {
      id: "duration",
      title: "Duration of symptoms",
      options: [
        { value: 0, label: "< 10 minutes" },
        { value: 1, label: "10–59 minutes" },
        { value: 2, label: "≥ 60 minutes" },
      ],
    },
    {
      id: "diabetes",
      title: "History of diabetes",
      layout: "horizontal",
      options: [
        { value: 0, label: "No" },
        { value: 1, label: "Yes" },
      ],
    },
  ],
  interpret(total) {
    if (total <= 3)
      return {
        severity: "low",
        headline: "Low risk (score 0–3)",
        detail: "2-day stroke risk approximately 1.0%.",
        bullets: ["7-day risk ~1.2%", "90-day risk ~3.1%"],
      };
    if (total <= 5)
      return {
        severity: "moderate",
        headline: "Moderate risk (score 4–5)",
        detail: "2-day stroke risk approximately 4.1%.",
        bullets: ["7-day risk ~5.9%", "90-day risk ~9.8%"],
      };
    return {
      severity: "high",
      headline: "High risk (score 6–7)",
      detail: "2-day stroke risk approximately 8.1%.",
      bullets: ["7-day risk ~11.7%", "90-day risk ~17.8%"],
    };
  },
};
