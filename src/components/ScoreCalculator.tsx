import { useMemo, useState } from "react";
import type { CalculatorMeta, ScoreDefinition } from "../types";
import { OptionGroup } from "./OptionGroup";
import { ResultCard } from "./ResultCard";

interface Props {
  meta: CalculatorMeta;
  definition: ScoreDefinition;
  /** When true, item numbers are hidden (e.g. single-item scales like mRS). */
  hideNumbers?: boolean;
}

export function ScoreCalculator({ meta, definition, hideNumbers }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const maxTotal = useMemo(
    () =>
      definition.items.reduce(
        (sum, item) => sum + Math.max(...item.options.map((o) => o.value)),
        0
      ),
    [definition.items]
  );

  const complete = definition.items.every((item) => item.id in answers);
  const total = definition.items.reduce(
    (sum, item) => sum + (answers[item.id] ?? 0),
    0
  );

  const interpretation = complete ? definition.interpret(total, answers) : null;
  const subScores =
    complete && definition.subScores ? definition.subScores(answers) : undefined;

  const copyText = useMemo(() => {
    const lines = [`${meta.name}`];
    definition.items.forEach((item, i) => {
      const val = answers[item.id];
      if (val == null) return;
      const opt = item.options.find((o) => o.value === val);
      const prefix = hideNumbers ? "" : `${i + 1}. `;
      lines.push(`${prefix}${item.title}: ${opt?.label ?? val} (${val})`);
    });
    lines.push(`Total: ${total}${definition.unit ? " " + definition.unit : ""} / ${maxTotal}`);
    if (interpretation) lines.push(`Interpretation: ${interpretation.headline}`);
    return lines.join("\n");
  }, [answers, definition, hideNumbers, interpretation, maxTotal, meta.name, total]);

  return (
    <div className="calc-page">
      <div>
        <div className="calc-head">
          <h1>{meta.name}</h1>
          <p className="subtitle">{meta.description}</p>
          {meta.sourceUrl && (
            <a
              className="ref-link"
              href={meta.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              Reference: {meta.reference} ↗
            </a>
          )}
        </div>

        <div style={{ marginTop: "1.25rem" }}>
          {definition.items.map((item, i) => (
            <OptionGroup
              key={item.id}
              item={item}
              index={hideNumbers ? undefined : i + 1}
              selected={answers[item.id]}
              onSelect={(value) =>
                setAnswers((prev) => ({ ...prev, [item.id]: value }))
              }
            />
          ))}
        </div>
      </div>

      <ResultCard
        scoreDisplay={complete ? String(total) : "—"}
        maxDisplay={String(maxTotal)}
        unit={definition.unit}
        interpretation={interpretation}
        subScores={subScores}
        copyText={copyText}
        complete={complete}
        incompleteMessage="Answer every item to see the score interpretation."
        onReset={() => setAnswers({})}
      />
    </div>
  );
}
