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

## Monetization & accounts (freemium)

The app is freemium: the core calculators (NIHSS, mRS, ABCD², ICH) are free;
the **SAHVAI suite is Premium**, unlocked by an auto-renewing subscription
(monthly / annual) purchased through Apple In-App Purchase. Free users can be
shown an AdMob banner; Premium removes ads.

Integration is driven entirely by environment variables (see `.env.example`,
copy to `.env.local`). With no keys set, the app runs in free mode with no
auth and no ads — nothing breaks in development.

| Variable | Service | Purpose |
| --- | --- | --- |
| `VITE_CLERK_PUBLISHABLE_KEY` | [Clerk](https://clerk.com) | Sign-in / user accounts (header button + modal) |
| `VITE_REVENUECAT_APPLE_API_KEY` | [RevenueCat](https://revenuecat.com) | Subscription entitlement (`premium`) and paywall packages |
| `VITE_ADMOB_BANNER_AD_ID` | AdMob | Bottom banner for free-tier users (native app only) |
| `VITE_PREMIUM_PREVIEW` | — | Set `true` to preview Premium features in dev/web builds |

Setup checklist:

1. **Clerk** — create the app, enable the **Native API** (Dashboard →
   Native Applications), and enable **Sign in with Apple** (required by Apple
   if any other social login is offered). Enable user-initiated account
   deletion (Apple requirement for apps with accounts).
2. **App Store Connect** — create the app, then two auto-renewable
   subscriptions in one group (e.g. `premium_monthly` at $0.99/mo,
   `premium_annual` at $10/yr). Generate an In-App Purchase key for
   RevenueCat. Consider enrolling in the App Store **Small Business Program**
   (15% instead of 30% commission).
3. **RevenueCat** — add the App Store app with the IAP key, attach both
   products to an entitlement named **`premium`**, and put them in the
   default Offering. The paywall lists whatever packages the offering
   returns, so plans can change without an app update.
4. **AdMob** (optional) — create a banner ad unit; add your AdMob App ID to
   `ios/App/App/Info.plist` under `GADApplicationIdentifier`. If serving
   personalized ads, implement the App Tracking Transparency prompt and
   matching App Privacy labels.

## iOS build (Capacitor)

The web app ships to the App Store inside a Capacitor shell. On a Mac with
Xcode:

```bash
npm install
npm run build
npx cap sync ios      # copies dist/ into the native project
npx cap open ios      # opens ios/App in Xcode
```

In Xcode: set your signing team, enable the **In-App Purchase** capability,
then archive and upload via Organizer. The `ios/` directory is committed, so
no regeneration is needed.

## Project structure

```
src/
  calculators/       # score definitions + the SAHVAI multi-tool component
    registry.ts      # metadata + list of all calculators (premium flag lives here)
    nihss.ts mrs.ts abcd2.ts ich.ts
    Sahvai.tsx sahvaiVolume.ts
  components/        # shared UI (Layout, OptionGroup, ResultCard, ScoreCalculator, Paywall)
  lib/               # auth (Clerk), premium entitlement (RevenueCat), ads (AdMob)
  pages/             # Home + CalculatorPage
ios/                 # Capacitor iOS native project (open in Xcode)
```

Additive scores (NIHSS, mRS, ABCD², ICH) are fully data-driven: a
`ScoreDefinition` lists the items, options, point values, and an `interpret()`
function, and the generic `ScoreCalculator` renders and scores them.

## Disclaimer

For educational and clinical decision-support purposes only. These tools do not
replace professional medical judgment; always interpret results in the full
clinical context.
