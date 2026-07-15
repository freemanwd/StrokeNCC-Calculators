import type { ScoreDefinition } from "../types";

export const ich: ScoreDefinition = {
  items: [
    {
      id: "gcs",
      title: "Glasgow Coma Scale (GCS) score",
      help: "GCS on initial presentation.",
      options: [
        { value: 0, label: "GCS 13–15" },
        { value: 1, label: "GCS 5–12" },
        { value: 2, label: "GCS 3–4" },
      ],
    },
    {
      id: "age",
      title: "Age ≥ 80 years",
      layout: "horizontal",
      options: [
        { value: 0, label: "No" },
        { value: 1, label: "Yes" },
      ],
    },
    {
      id: "infratentorial",
      title: "Infratentorial origin of hemorrhage",
      help: "Brainstem or cerebellar location.",
      layout: "horizontal",
      options: [
        { value: 0, label: "No" },
        { value: 1, label: "Yes" },
      ],
    },
    {
      id: "volume",
      title: "ICH volume ≥ 30 cm³",
      help: "Estimate with the ABC/2 method on non-contrast CT.",
      layout: "horizontal",
      options: [
        { value: 0, label: "< 30 cm³" },
        { value: 1, label: "≥ 30 cm³" },
      ],
    },
    {
      id: "ivh",
      title: "Intraventricular hemorrhage",
      layout: "horizontal",
      options: [
        { value: 0, label: "No" },
        { value: 1, label: "Yes" },
      ],
    },
  ],
  interpret(total) {
    const mortality: Record<number, string> = {
      0: "0%",
      1: "13%",
      2: "26%",
      3: "72%",
      4: "97%",
      5: "100%",
      6: "100%",
    };
    const severity =
      total <= 1 ? "low" : total <= 2 ? "moderate" : total <= 3 ? "high" : "critical";
    return {
      severity,
      headline: `Estimated 30-day mortality: ${mortality[total] ?? "—"}`,
      detail:
        "Observed 30-day mortality from Hemphill et al. (Stroke 2001). No patient with an ICH score of 0 died; all with a score ≥5 died in the original cohort.",
    };
  },
};
