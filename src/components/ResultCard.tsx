import { useState } from "react";
import type { Interpretation, Severity, SubScore } from "../types";

interface Props {
  scoreLabel?: string;
  scoreDisplay: string;
  maxDisplay?: string;
  unit?: string;
  interpretation: Interpretation | null;
  subScores?: SubScore[];
  copyText: string;
  onReset: () => void;
  complete: boolean;
  incompleteMessage?: string;
}

const sevClass: Record<Severity, string> = {
  low: "sev-low",
  moderate: "sev-moderate",
  high: "sev-high",
  critical: "sev-critical",
  neutral: "sev-neutral",
};

export function ResultCard({
  scoreLabel = "Total score",
  scoreDisplay,
  maxDisplay,
  unit,
  interpretation,
  subScores,
  copyText,
  onReset,
  complete,
  incompleteMessage,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <aside className="result-panel">
      <div className="result-card">
        <div className="result-score">
          <div className="label">{scoreLabel}</div>
          <div className="value">
            {scoreDisplay}
            {maxDisplay && <small> / {maxDisplay}</small>}
          </div>
          {unit && <div className="unit">{unit}</div>}
        </div>

        {interpretation && (
          <div className={`severity-banner ${sevClass[interpretation.severity]}`}>
            {interpretation.headline}
          </div>
        )}

        {interpretation?.detail && (
          <div className="severity-detail">
            {interpretation.detail}
            {interpretation.bullets && (
              <ul>
                {interpretation.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {!complete && incompleteMessage && (
          <div className="severity-detail">{incompleteMessage}</div>
        )}

        {subScores && subScores.length > 0 && (
          <div className="subscore-list">
            {subScores.map((s) => (
              <div className="row" key={s.label}>
                <span>{s.label}</span>
                <b>{s.value}</b>
              </div>
            ))}
          </div>
        )}

        <div className="result-actions">
          <button type="button" className="btn btn-primary" onClick={handleCopy}>
            Copy result
          </button>
          <button type="button" className="btn" onClick={onReset}>
            Reset
          </button>
        </div>
        {copied && <div className="copied-flash">Copied to clipboard</div>}
      </div>
    </aside>
  );
}
