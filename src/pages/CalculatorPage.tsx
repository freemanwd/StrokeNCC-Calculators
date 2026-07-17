import { Link, useParams } from "react-router-dom";
import { getCalculator } from "../calculators/registry";
import { ScoreCalculator } from "../components/ScoreCalculator";
import { Sahvai } from "../calculators/Sahvai";
import { Paywall } from "../components/Paywall";
import { usePremium } from "../lib/premium";

export function CalculatorPage() {
  const { slug } = useParams();
  const calc = slug ? getCalculator(slug) : undefined;
  const { isPremium } = usePremium();

  if (!calc) {
    return (
      <div>
        <p>Calculator not found.</p>
        <Link to="/">← Back to all calculators</Link>
      </div>
    );
  }

  if (calc.premium && !isPremium) {
    return (
      <div>
        <div className="breadcrumb">
          <Link to="/">All calculators</Link>
          <span>/</span>
          <span>{calc.shortName}</span>
        </div>
        <Paywall featureName={calc.name} />
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
