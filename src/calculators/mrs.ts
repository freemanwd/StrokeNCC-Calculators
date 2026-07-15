import type { ScoreDefinition } from "../types";

export const mrs: ScoreDefinition = {
  items: [
    {
      id: "grade",
      title: "Patient's functional status",
      help: "Select the single statement that best describes the patient's current level of disability.",
      options: [
        { value: 0, label: "0 — No symptoms at all" },
        {
          value: 1,
          label: "1 — No significant disability despite symptoms",
          description: "Able to carry out all usual duties and activities.",
        },
        {
          value: 2,
          label: "2 — Slight disability",
          description:
            "Unable to carry out all previous activities but able to look after own affairs without assistance.",
        },
        {
          value: 3,
          label: "3 — Moderate disability",
          description:
            "Requires some help, but able to walk without assistance.",
        },
        {
          value: 4,
          label: "4 — Moderately severe disability",
          description:
            "Unable to walk and attend to bodily needs without assistance.",
        },
        {
          value: 5,
          label: "5 — Severe disability",
          description:
            "Bedridden, incontinent, and requiring constant nursing care and attention.",
        },
        { value: 6, label: "6 — Dead" },
      ],
    },
  ],
  interpret(total) {
    if (total <= 2)
      return {
        severity: "low",
        headline: "Favorable outcome (mRS 0–2)",
        detail:
          "Functionally independent. mRS 0–2 is the conventional threshold for a good outcome in stroke trials.",
      };
    if (total <= 3)
      return {
        severity: "moderate",
        headline: "Moderate disability (mRS 3)",
        detail: "Requires some help but remains able to walk unassisted.",
      };
    if (total <= 5)
      return {
        severity: "high",
        headline: "Severe disability (mRS 4–5)",
        detail: "Dependent for ambulation and/or daily bodily needs.",
      };
    return {
      severity: "critical",
      headline: "Death (mRS 6)",
    };
  },
};
