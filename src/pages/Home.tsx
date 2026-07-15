import { Link } from "react-router-dom";
import { calculators } from "../calculators/registry";

export function Home() {
  const categories = Array.from(new Set(calculators.map((c) => c.category)));

  return (
    <div>
      <section className="hero">
        <h1>Stroke &amp; Neurocritical Care Calculators</h1>
        <p>
          A focused set of validated bedside tools for cerebrovascular disease
          and the neuro-ICU — stroke severity, functional outcome, TIA risk,
          intracerebral hemorrhage prognosis, and quantitative subarachnoid
          hemorrhage volumetrics.
        </p>
      </section>

      {categories.map((cat) => (
        <div key={cat}>
          <div className="section-label">{cat}</div>
          <div className="card-grid">
            {calculators
              .filter((c) => c.category === cat)
              .map((calc) => (
                <Link
                  key={calc.slug}
                  to={`/calc/${calc.slug}`}
                  className="calc-card"
                >
                  <div className="calc-card-top">
                    <div className="calc-badge">{calc.badge}</div>
                    <div>
                      <h3>{calc.shortName}</h3>
                      <div className="calc-full">{calc.name}</div>
                    </div>
                  </div>
                  <p>{calc.description}</p>
                  <div className="tag-row">
                    {calc.chips.map((chip) => (
                      <span className="chip" key={chip}>
                        {chip}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
          </div>
        </div>
      ))}

      <div className="disclaimer">
        <b>Disclaimer:</b> These calculators are provided for educational and
        clinical decision-support purposes only. They do not replace
        professional medical judgment, and results should always be interpreted
        in the full clinical context by a qualified clinician.
      </div>
    </div>
  );
}
