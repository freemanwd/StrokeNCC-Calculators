export type Severity = "low" | "moderate" | "high" | "critical" | "neutral";

export interface ScoreOption {
  label: string;
  value: number;
  description?: string;
}

export interface ScoreItem {
  id: string;
  title: string;
  help?: string;
  options: ScoreOption[];
  layout?: "vertical" | "horizontal";
}

export interface Interpretation {
  severity: Severity;
  headline: string;
  detail?: string;
  bullets?: string[];
}

export interface SubScore {
  label: string;
  value: string;
}

export interface ScoreDefinition {
  items: ScoreItem[];
  unit?: string;
  interpret: (total: number, answers: Record<string, number>) => Interpretation;
  subScores?: (answers: Record<string, number>) => SubScore[];
}

export interface CalculatorMeta {
  slug: string;
  badge: string;
  shortName: string;
  name: string;
  category: string;
  description: string;
  reference: string;
  sourceUrl?: string;
  chips: string[];
}
