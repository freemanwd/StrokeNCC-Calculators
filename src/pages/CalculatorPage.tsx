import { Link, useParams } from "react-router-dom";
import { getCalculator } from "../calculators/registry";
import { ScoreCalculator } from "../components/ScoreCalculator";
import { Sahvai } from "../calculators/Sahvai";

export function CalculatorPage() {
  const { slug } = useParams();
  const calc = slug ? getCalculator(slug) : undefined;

  if (!calc) {
    return (
      <div>
        <p>Calculator not found.</p>
        <Link to="/">← Back to all calculators</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="breadcrumb">
        <Link to="/">All calculators</Link>
        <span>/</span>
        <span>{calc.shortName}</span>
      </div>

      {calc.kind === "score" ? (
        <ScoreCalculator
          meta={calc}
          definition={calc.definition}
          hideNumbers={calc.hideNumbers}
        />
      ) : (
        <Sahvai />
      )}

      <div className="disclaimer">
        <b>Disclaimer:</b> For educational and decision-support use only. Verify
        all results and interpret within the complete clinical picture.
      </div>
    </div>
  );
}
