# StrokeNCC Calculator

A fast, modern web app of validated **stroke and neurocritical care** bedside
calculators, inspired by MDCalc. Built with React, TypeScript, and Vite.

## Included calculators

| Calculator | What it does |
| --- | --- |
| **NIHSS** — NIH Stroke Scale | 15-item quantification of stroke severity (0–42) with severity banding. |
| **mRS** — Modified Rankin Scale | Degree of disability / dependence after stroke (0–6). |
| **ABCD²** — TIA Score | Risk of stroke after a transient ischemic attack (0–7) with 2/7/90-day risk. |
| **ICH Score** | 30-day mortality after intracerebral hemorrhage (0–6). |
| **SAHVAI Lab tools** | A tabbed suite: SAH volume via ABC/2 (5 cisternal spaces + IPH/SDH), the eSAH score, Modified Graeb IVH grading, CHESS shunt-dependency risk, and neutrophil-to-lymphocyte ratio. |

Each score calculator shows a live total, clinical interpretation with severity
color-coding, per-item breakdown, and a one-click **Copy result** for
documentation.

## Sources

- NIHSS — https://www.mdcalc.com/calc/715/nih-stroke-scale-score-nihss
- mRS — https://www.mdcalc.com/calc/1890/modified-rankin-scale-neurologic-disability
- ABCD² — https://www.mdcalc.com/calc/357/abcd2-score-tia
- ICH Score — https://www.mdcalc.com/calc/402/intracerebral-hemorrhage-ich-score
- SAHVAI Lab — https://sahvai-lab.github.io/SAHVAI-Calculator/

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check and produce a production build in dist/
npm run preview  # preview the production build
npm run lint     # run oxlint
```

## Project structure

```
src/
  calculators/       # score definitions + the SAHVAI multi-tool component
    registry.ts      # metadata + list of all calculators
    nihss.ts mrs.ts abcd2.ts ich.ts
    Sahvai.tsx sahvaiVolume.ts
  components/         # shared UI (Layout, OptionGroup, ResultCard, ScoreCalculator)
  pages/             # Home + CalculatorPage
```

Additive scores (NIHSS, mRS, ABCD², ICH) are fully data-driven: a
`ScoreDefinition` lists the items, options, point values, and an `interpret()`
function, and the generic `ScoreCalculator` renders and scores them.

## Disclaimer

For educational and clinical decision-support purposes only. These tools do not
replace professional medical judgment; always interpret results in the full
clinical context.
