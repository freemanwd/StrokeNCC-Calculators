import { useMemo, useState } from "react";
import {
  axialRegions,
  cisternalRegions,
  emptyMeasurement,
  eSahScore,
  measurementVolume,
  type Measurement,
  type RegionDef,
} from "./sahvaiVolume";

type MeasureState = Record<string, Measurement>;

type TabId = "volume" | "esah" | "graeb" | "chess" | "nlr";

const TABS: { id: TabId; label: string }[] = [
  { id: "volume", label: "SAHV Volume (ABC/2)" },
  { id: "esah", label: "eSAH Score" },
  { id: "graeb", label: "Modified Graeb (IVH)" },
  { id: "chess", label: "CHESS" },
  { id: "nlr", label: "NLR" },
];

function keyFor(regionId: string, side: string) {
  return `${regionId}:${side}`;
}

export function Sahvai() {
  const [tab, setTab] = useState<TabId>("volume");
  const [measures, setMeasures] = useState<MeasureState>({});

  const sahvTotal = useMemo(
    () => sumRegions(measures, cisternalRegions),
    [measures]
  );

  return (
    <div>
      <div className="calc-head">
        <h1>SAHVAI Lab Calculators</h1>
        <p className="subtitle">
          Quantitative subarachnoid hemorrhage volume (SAHV) and neurocritical
          care outcome tools from the Mayo Clinic SAHVAI Laboratory — ABC/2
          volumetrics, the eSAH score, Modified Graeb IVH grading, CHESS shunt
          risk, and the neutrophil-to-lymphocyte ratio.
        </p>
        <a
          className="ref-link"
          href="https://sahvai-lab.github.io/SAHVAI-Calculator/"
          target="_blank"
          rel="noreferrer"
        >
          Reference: SAHVAI Calculator (Freeman &amp; Föttinger) ↗
        </a>
      </div>

      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={tab === t.id ? "tab active" : "tab"}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "volume" && (
        <VolumeTab measures={measures} setMeasures={setMeasures} sahvTotal={sahvTotal} />
      )}
      {tab === "esah" && <ESahTab sahvTotal={sahvTotal} />}
      {tab === "graeb" && <GraebTab />}
      {tab === "chess" && <ChessTab />}
      {tab === "nlr" && <NlrTab />}
    </div>
  );
}

/* ---------------- SAHV Volume (ABC/2) ---------------- */

function sumRegions(measures: MeasureState, regions: RegionDef[]): number {
  return regions.reduce((sum, r) => sum + regionVolume(measures, r), 0);
}

function regionVolume(measures: MeasureState, region: RegionDef): number {
  const sides = region.bilateral ? ["right", "left"] : ["single"];
  return sides.reduce((sum, side) => {
    const m = measures[keyFor(region.id, side)];
    return sum + (m ? measurementVolume(m, region.halve) : 0);
  }, 0);
}

function VolumeTab({
  measures,
  setMeasures,
  sahvTotal,
}: {
  measures: MeasureState;
  setMeasures: React.Dispatch<React.SetStateAction<MeasureState>>;
  sahvTotal: number;
}) {
  const iphTotal = regionVolume(measures, axialRegions[0]);
  const sdhTotal = regionVolume(measures, axialRegions[1]);
  const sixSpace = sahvTotal + iphTotal + sdhTotal;

  const update = (regionId: string, side: string, field: keyof Measurement, value: string) => {
    setMeasures((prev) => {
      const k = keyFor(regionId, side);
      const current = prev[k] ?? emptyMeasurement();
      return { ...prev, [k]: { ...current, [field]: value } };
    });
  };

  const renderRegion = (region: RegionDef) => {
    const sides = region.bilateral ? ["right", "left"] : ["single"];
    return (
      <div className="item" key={region.id}>
        <div className="item-head">
          <div className="item-title">{region.label}</div>
          <div className="item-points">
            {regionVolume(measures, region).toFixed(3)} mL
          </div>
        </div>
        <table className="volume-table">
          <thead>
            <tr>
              {region.bilateral && <th>Side</th>}
              <th>A — length (mm)</th>
              <th>B — thickness (mm)</th>
              <th>C — slices (#)</th>
              <th>Slice (mm)</th>
              <th>Volume (mL)</th>
            </tr>
          </thead>
          <tbody>
            {sides.map((side) => {
              const m = measures[keyFor(region.id, side)] ?? emptyMeasurement();
              return (
                <tr key={side}>
                  {region.bilateral && (
                    <td style={{ textTransform: "capitalize" }}>{side}</td>
                  )}
                  {(["a", "b", "c", "slice"] as (keyof Measurement)[]).map((f) => (
                    <td key={f}>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        inputMode="decimal"
                        value={m[f]}
                        onChange={(e) => update(region.id, side, f, e.target.value)}
                      />
                    </td>
                  ))}
                  <td className="vol-out">
                    {measurementVolume(m, region.halve).toFixed(3)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="calc-page">
      <div>
        <div className="info-box">
          Volume via the Freeman &amp; Föttinger ABC/2 method:{" "}
          <b>V (mL) = (A × B × C × slice thickness) / 2 × 10⁻³</b>, where A and B
          are in mm, C is the number of slices with blood, and slice thickness is
          in mm. Bilateral compartments are measured on each side and summed. SDH
          uses an additional ÷2 correction.
        </div>
        <div className="subhead">Cisternal spaces (5-space SAHV)</div>
        {cisternalRegions.map(renderRegion)}
        <div className="subhead">Intra-axial &amp; extra-axial blood</div>
        {axialRegions.map(renderRegion)}
      </div>

      <aside className="result-panel">
        <div className="result-card">
          <div className="result-score">
            <div className="label">5-space cisternal SAHV</div>
            <div className="value">
              {sahvTotal.toFixed(2)}
              <small> mL</small>
            </div>
          </div>
          <div
            className={
              "severity-banner " +
              (sahvTotal > 20
                ? "sev-critical"
                : sahvTotal > 10
                  ? "sev-high"
                  : "sev-low")
            }
          >
            {sahvTotal > 10
              ? "SAHV > 10 mL — higher risk of delayed cerebral ischemia"
              : "SAHV ≤ 10 mL — lower DCI risk"}
          </div>
          <div className="severity-detail">
            SAHV &gt; 10 mL is associated with delayed cerebral ischemia and poor
            outcome (Föttinger &amp; Freeman, JAHA 2024).
          </div>
          <div className="subscore-list">
            <div className="row">
              <span>IPH total</span>
              <b>{iphTotal.toFixed(3)} mL</b>
            </div>
            <div className="row">
              <span>SDH total (÷2)</span>
              <b>{sdhTotal.toFixed(3)} mL</b>
            </div>
            <div className="row">
              <span>6-space total (all + IPH + SDH)</span>
              <b>{sixSpace.toFixed(3)} mL</b>
            </div>
          </div>
          <div className="result-actions">
            <button
              type="button"
              className="btn"
              onClick={() => setMeasures({})}
            >
              Reset all
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ---------------- eSAH Score ---------------- */

function ESahTab({ sahvTotal }: { sahvTotal: number }) {
  const [age, setAge] = useState("");
  const [gcs, setGcs] = useState("");
  const [sahvOverride, setSahvOverride] = useState("");

  const sahvValue =
    sahvOverride !== ""
      ? parseFloat(sahvOverride)
      : sahvTotal > 0
        ? sahvTotal
        : NaN;

  const ageNum = age === "" ? null : parseFloat(age);
  const gcsNum = gcs === "" ? null : parseFloat(gcs);
  const sahvNum = isFinite(sahvValue) ? sahvValue : null;

  const { score, complete, agePts, gcsPts, sahvPts } = eSahScore(
    ageNum,
    gcsNum,
    sahvNum
  );

  const severity =
    score <= 1 ? "low" : score <= 2 ? "moderate" : score <= 3 ? "high" : "critical";
  const headline = complete
    ? `eSAH ${score} / 5 — each +1 point ≈ OR 2.14 for poor outcome`
    : "Enter age, GCS, and SAHV";

  return (
    <div className="calc-page">
      <div>
        <div className="info-box">
          Weighted 0–5 score combining age, admission GCS, and SAHV. AUC 0.89
          (mRS), 0.88 (mortality) — Sharma &amp; Freeman, Sci Rep 2024. SAHV is
          pulled from the Volume tab automatically; enter a value to override.
        </div>
        <div className="field">
          <label>Age (years)</label>
          <input
            type="number"
            min="0"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 62"
          />
          <span className="muted">≤55 = 0 pts, &gt;55 = 1 pt</span>
        </div>
        <div className="field">
          <label>Admission GCS (3–15)</label>
          <input
            type="number"
            min="3"
            max="15"
            value={gcs}
            onChange={(e) => setGcs(e.target.value)}
            placeholder="e.g. 13"
          />
          <span className="muted">13–15 = 0 pts, 8–12 = 1 pt, 3–7 = 2 pts</span>
        </div>
        <div className="field">
          <label>
            SAHV (mL){" "}
            <span className="field-help">
              {sahvTotal > 0 && sahvOverride === ""
                ? `auto-filled ${sahvTotal.toFixed(2)} mL from Volume tab`
                : "override"}
            </span>
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={sahvOverride}
            onChange={(e) => setSahvOverride(e.target.value)}
            placeholder={sahvTotal > 0 ? sahvTotal.toFixed(2) : "e.g. 15"}
          />
          <span className="muted">≤10 = 0 pts, 10–20 = 1 pt, &gt;20 = 2 pts</span>
        </div>
      </div>

      <aside className="result-panel">
        <div className="result-card">
          <div className="result-score">
            <div className="label">eSAH score</div>
            <div className="value">
              {complete ? score : "—"}
              <small> / 5</small>
            </div>
          </div>
          <div className={`severity-banner sev-${complete ? severity : "neutral"}`}>
            {headline}
          </div>
          <div className="subscore-list">
            <div className="row">
              <span>Age points</span>
              <b>{ageNum == null ? "—" : agePts}</b>
            </div>
            <div className="row">
              <span>GCS points</span>
              <b>{gcsNum == null ? "—" : gcsPts}</b>
            </div>
            <div className="row">
              <span>SAHV points</span>
              <b>{sahvNum == null ? "—" : sahvPts}</b>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ---------------- Modified Graeb (IVH) ---------------- */

const GRAEB_REGIONS = [
  "Left lateral ventricle (frontal horn)",
  "Right lateral ventricle (frontal horn)",
  "Left lateral ventricle (body)",
  "Right lateral ventricle (body)",
  "Left lateral ventricle (temporal horn)",
  "Right lateral ventricle (temporal horn)",
  "Third ventricle",
  "Fourth ventricle",
];

const GRAEB_OPTS = [
  { value: 0, label: "0 — No blood" },
  { value: 1, label: "1 — Trace" },
  { value: 2, label: "2 — <50% filled" },
  { value: 3, label: "3 — >50% filled" },
  { value: 4, label: "4 — Filled / cast" },
];

function GraebTab() {
  const [scores, setScores] = useState<Record<number, number>>({});
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const total = GRAEB_REGIONS.reduce((sum, _r, i) => {
    const base = scores[i] ?? 0;
    const exp = base > 0 && expanded[i] ? 1 : 0;
    return sum + base + exp;
  }, 0);

  return (
    <div className="calc-page">
      <div>
        <div className="info-box">
          Modified Graeb Score (Morgan et al., Stroke 2013). Range 0–32. Each
          ventricular region scores 0–4 for blood, plus 1 point if that region is
          expanded. Expansion only counts when the region contains blood.
        </div>
        {GRAEB_REGIONS.map((region, i) => (
          <div className="item" key={region}>
            <div className="item-head">
              <div className="item-title">{region}</div>
            </div>
            <div className="options horizontal">
              {GRAEB_OPTS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={scores[i] === opt.value ? "option selected" : "option"}
                  onClick={() => setScores((p) => ({ ...p, [i]: opt.value }))}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <label
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                marginTop: "0.6rem",
                fontSize: "0.86rem",
                opacity: (scores[i] ?? 0) > 0 ? 1 : 0.45,
              }}
            >
              <input
                type="checkbox"
                checked={!!expanded[i]}
                disabled={(scores[i] ?? 0) === 0}
                onChange={(e) =>
                  setExpanded((p) => ({ ...p, [i]: e.target.checked }))
                }
              />
              Region is expanded (+1)
            </label>
          </div>
        ))}
      </div>

      <aside className="result-panel">
        <div className="result-card">
          <div className="result-score">
            <div className="label">Modified Graeb score</div>
            <div className="value">
              {total}
              <small> / 32</small>
            </div>
          </div>
          <div
            className={
              "severity-banner " +
              (total >= 12 ? "sev-critical" : total >= 6 ? "sev-high" : "sev-low")
            }
          >
            {total >= 12
              ? "High IVH burden"
              : total >= 6
                ? "Moderate IVH burden"
                : "Low IVH burden"}
          </div>
          <div className="severity-detail">
            Higher scores indicate greater intraventricular hemorrhage burden and
            correlate with worse outcomes.
          </div>
          <div className="result-actions">
            <button
              type="button"
              className="btn"
              onClick={() => {
                setScores({});
                setExpanded({});
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ---------------- CHESS ---------------- */

interface ChessItem {
  id: string;
  title: string;
  options: { value: number; label: string }[];
}

const CHESS_ITEMS: ChessItem[] = [
  {
    id: "hh",
    title: "Hunt & Hess grade",
    options: [
      { value: 0, label: "I — Mild headache" },
      { value: 0, label: "II — Severe headache, nuchal rigidity" },
      { value: 0, label: "III — Drowsy, confusion" },
      { value: 1, label: "IV — Stupor, hemiparesis (+1)" },
      { value: 1, label: "V — Deep coma (+1)" },
    ],
  },
  {
    id: "location",
    title: "Aneurysm location",
    options: [
      { value: 0, label: "Anterior circulation" },
      { value: 1, label: "Posterior circulation (+1)" },
    ],
  },
  {
    id: "hydro",
    title: "Acute hydrocephalus",
    options: [
      { value: 0, label: "No" },
      { value: 4, label: "Yes (+4)" },
    ],
  },
  {
    id: "ivh",
    title: "Intraventricular hemorrhage",
    options: [
      { value: 0, label: "No" },
      { value: 1, label: "Yes (+1)" },
    ],
  },
  {
    id: "infarct",
    title: "Early cerebral infarction",
    options: [
      { value: 0, label: "No" },
      { value: 1, label: "Yes (+1)" },
    ],
  },
];

function ChessTab() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const complete = CHESS_ITEMS.every((it) => it.id in answers);
  const total = CHESS_ITEMS.reduce((s, it) => s + (answers[it.id] ?? 0), 0);
  const risk = total >= 6 ? "high" : total >= 3 ? "moderate" : "low";

  return (
    <div className="calc-page">
      <div>
        <div className="info-box">
          CHESS predicts shunt-dependent hydrocephalus after aneurysmal SAH
          (Diesing et al.). Range 0–8; higher scores indicate greater risk of
          requiring a permanent CSF shunt.
        </div>
        {CHESS_ITEMS.map((item) => (
          <div className="item" key={item.id}>
            <div className="item-head">
              <div className="item-title">{item.title}</div>
            </div>
            <div className="options">
              {item.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={
                    answers[item.id + ":sel"] === idx ? "option selected" : "option"
                  }
                  onClick={() =>
                    setAnswers((p) => ({
                      ...p,
                      [item.id]: opt.value,
                      [item.id + ":sel"]: idx,
                    }))
                  }
                >
                  <span className="option-label">
                    <span>{opt.label}</span>
                  </span>
                  <span className="option-pts">
                    {opt.value > 0 ? `+${opt.value}` : opt.value}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <aside className="result-panel">
        <div className="result-card">
          <div className="result-score">
            <div className="label">CHESS score</div>
            <div className="value">
              {complete ? total : "—"}
              <small> / 8</small>
            </div>
          </div>
          <div className={`severity-banner sev-${complete ? risk : "neutral"}`}>
            {complete
              ? `Shunt dependency risk: ${risk === "high" ? "High" : risk === "moderate" ? "Intermediate" : "Low"}`
              : "Answer all items"}
          </div>
          <div className="result-actions">
            <button type="button" className="btn" onClick={() => setAnswers({})}>
              Reset
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ---------------- NLR ---------------- */

function NlrTab() {
  const [neut, setNeut] = useState("");
  const [lymph, setLymph] = useState("");
  const n = parseFloat(neut);
  const l = parseFloat(lymph);
  const valid = isFinite(n) && isFinite(l) && l > 0;
  const nlr = valid ? n / l : null;
  const high = nlr != null && nlr > 12.03;

  return (
    <div className="calc-page">
      <div>
        <div className="info-box">
          Neutrophil-to-lymphocyte ratio is an inflammatory biomarker predicting
          delayed cerebral ischemia after SAH. A cutoff of NLR &gt; 12.03 has been
          associated with DCI (AUC 0.805).
        </div>
        <div className="field">
          <label>Neutrophil count (×10³/μL)</label>
          <input
            type="number"
            min="0"
            step="any"
            value={neut}
            onChange={(e) => setNeut(e.target.value)}
            placeholder="e.g. 9.5"
          />
        </div>
        <div className="field">
          <label>Lymphocyte count (×10³/μL)</label>
          <input
            type="number"
            min="0"
            step="any"
            value={lymph}
            onChange={(e) => setLymph(e.target.value)}
            placeholder="e.g. 1.2"
          />
        </div>
      </div>

      <aside className="result-panel">
        <div className="result-card">
          <div className="result-score">
            <div className="label">NLR</div>
            <div className="value">{nlr != null ? nlr.toFixed(2) : "—"}</div>
          </div>
          <div
            className={
              "severity-banner sev-" +
              (nlr == null ? "neutral" : high ? "high" : "low")
            }
          >
            {nlr == null
              ? "Enter both counts"
              : high
                ? "Above 12.03 cutoff — elevated DCI risk"
                : "Below 12.03 cutoff"}
          </div>
          <div className="result-actions">
            <button
              type="button"
              className="btn"
              onClick={() => {
                setNeut("");
                setLymph("");
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
