import { useState } from "react";
import type { PurchasesPackage } from "@revenuecat/purchases-capacitor";
import { usePremium } from "../lib/premium";
import { authEnabled, HeaderAuth } from "../lib/auth";

/** Static fallback shown when store offerings can't be loaded (e.g. web). */
const FALLBACK_PLANS = [
  { id: "monthly", title: "Monthly", price: "$0.99 / month", note: "Cancel anytime" },
  { id: "annual", title: "Annual", price: "$10 / year", note: "Save ~$2 vs monthly" },
];

export function Paywall({ featureName }: { featureName: string }) {
  const { native, purchasesReady, packages, purchase, restore } = usePremium();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buy = async (pkg: PurchasesPackage) => {
    setBusy(true);
    setError(null);
    try {
      await purchase(pkg);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      // User cancellation is not an error worth surfacing.
      if (!/cancel/i.test(message)) setError(message);
    } finally {
      setBusy(false);
    }
  };

  const doRestore = async () => {
    setBusy(true);
    setError(null);
    try {
      await restore();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="paywall">
      <div className="paywall-badge">Premium</div>
      <h2>{featureName} is a Premium feature</h2>
      <p className="muted">
        The core calculators are free — with StrokeNCC Premium you unlock the
        SAHVAI quantitative suite and advanced tools, and remove all ads.
      </p>

      <ul className="paywall-benefits">
        <li>SAHVAI SAH volumetrics (ABC/2, 5 cisternal spaces + IPH/SDH)</li>
        <li>eSAH score, Modified Graeb, CHESS, and NLR</li>
        <li>Ad-free experience</li>
        <li>All future premium calculators included</li>
      </ul>

      {purchasesReady && packages.length > 0 ? (
        <div className="plan-grid">
          {packages.map((pkg) => (
            <button
              key={pkg.identifier}
              type="button"
              className="plan-card"
              disabled={busy}
              onClick={() => buy(pkg)}
            >
              <span className="plan-title">
                {pkg.product.title || pkg.packageType}
              </span>
              <span className="plan-price">{pkg.product.priceString}</span>
              <span className="plan-cta">{busy ? "…" : "Subscribe"}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="plan-grid">
          {FALLBACK_PLANS.map((plan) => (
            <div key={plan.id} className="plan-card static">
              <span className="plan-title">{plan.title}</span>
              <span className="plan-price">{plan.price}</span>
              <span className="muted">{plan.note}</span>
            </div>
          ))}
        </div>
      )}

      {!native && (
        <p className="muted" style={{ marginTop: "0.75rem" }}>
          Subscriptions are purchased in the StrokeNCC iOS app via the App
          Store.
        </p>
      )}

      {native && purchasesReady && (
        <button
          type="button"
          className="reset-link"
          disabled={busy}
          onClick={doRestore}
          style={{ marginTop: "0.75rem" }}
        >
          Restore purchases
        </button>
      )}

      {error && <p className="paywall-error">{error}</p>}

      {authEnabled && (
        <div className="paywall-auth">
          <span className="muted">
            Sign in so your subscription follows you across devices:
          </span>
          <HeaderAuth />
        </div>
      )}
    </div>
  );
}
