import type { CalculatorMeta, ScoreDefinition } from "../types";
import { nihss } from "./nihss";
import { mrs } from "./mrs";
import { abcd2 } from "./abcd2";
import { ich } from "./ich";

export interface ScoreEntry extends CalculatorMeta {
  kind: "score";
  definition: ScoreDefinition;
  hideNumbers?: boolean;
}

export interface CustomEntry extends CalculatorMeta {
  kind: "custom";
}

export type CalcEntry = ScoreEntry | CustomEntry;

export const calculators: CalcEntry[] = [
  {
    kind: "score",
    slug: "nihss",
    badge: "NIHSS",
    shortName: "NIHSS",
    name: "NIH Stroke Scale (NIHSS)",
    category: "Stroke severity",
    description:
      "Quantifies stroke-related neurologic deficit across 15 items. Used to gauge severity, guide treatment decisions, and track change over time.",
    reference: "Brott T, et al. Stroke 1989 (NINDS)",
    sourceUrl: "https://www.mdcalc.com/calc/715/nih-stroke-scale-score-nihss",
    chips: ["15 items", "0–42 points"],
    definition: nihss,
  },
  {
    kind: "score",
    slug: "mrs",
    badge: "mRS",
    shortName: "mRS",
    name: "Modified Rankin Scale (mRS)",
    category: "Functional outcome",
    description:
      "Measures the degree of disability or dependence in daily activities of people who have suffered a stroke or other neurologic disability.",
    reference: "van Swieten JC, et al. Stroke 1988",
    sourceUrl:
      "https://www.mdcalc.com/calc/1890/modified-rankin-scale-neurologic-disability",
    chips: ["0–6 scale", "Outcome"],
    definition: mrs,
    hideNumbers: true,
  },
  {
    kind: "score",
    slug: "abcd2",
    badge: "ABCD²",
    shortName: "ABCD2",
    name: "ABCD² Score for TIA",
    category: "Risk stratification",
    description:
      "Estimates the risk of stroke after a transient ischemic attack (TIA) to help triage patients for urgent evaluation.",
    reference: "Johnston SC, et al. Lancet 2007",
    sourceUrl: "https://www.mdcalc.com/calc/357/abcd2-score-tia",
    chips: ["5 factors", "0–7 points"],
    definition: abcd2,
  },
  {
    kind: "score",
    slug: "ich",
    badge: "ICH",
    shortName: "ICH Score",
    name: "Intracerebral Hemorrhage (ICH) Score",
    category: "Risk stratification",
    description:
      "Predicts 30-day mortality after spontaneous intracerebral hemorrhage using GCS, ICH volume, IVH, location, and age.",
    reference: "Hemphill JC, et al. Stroke 2001",
    sourceUrl:
      "https://www.mdcalc.com/calc/402/intracerebral-hemorrhage-ich-score",
    chips: ["5 factors", "0–6 points"],
    definition: ich,
  },
  {
    kind: "custom",
    slug: "sahvai",
    badge: "SAHVAI",
    shortName: "SAHVAI",
    name: "SAHVAI Lab Calculators",
    category: "Neurocritical care",
    description:
      "SAH volume (ABC/2), eSAH score, Modified Graeb IVH grading, CHESS shunt risk, and neutrophil-to-lymphocyte ratio from the Mayo Clinic SAHVAI Lab.",
    reference: "Föttinger & Freeman, JAHA 2024; Sharma et al., Sci Rep 2024",
    sourceUrl: "https://sahvai-lab.github.io/SAHVAI-Calculator/",
    chips: ["5 tools", "SAH / NCC"],
    premium: true,
  },
];

export function getCalculator(slug: string): CalcEntry | undefined {
  return calculators.find((c) => c.slug === slug);
}
