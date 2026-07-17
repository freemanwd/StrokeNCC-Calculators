import { Link, Outlet } from "react-router-dom";
import { HeaderAuth } from "../lib/auth";
import { useAdBanner } from "../lib/ads";

export function Layout() {
  useAdBanner();
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden>
              <svg viewBox="0 0 64 64" fill="none">
                <path
                  d="M6 34h11l4-12 7 24 6-16 3 8h18"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>
              StrokeNCC<span className="brand-sub"> Calculator</span>
            </span>
          </Link>
          <div className="header-spacer" />
          <span className="header-tag">Stroke &amp; Neurocritical Care</span>
          <HeaderAuth />
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <div className="app-footer-inner">
          <span>
            StrokeNCC Calculator — educational decision-support tool. Not a
            substitute for clinical judgment.
          </span>
          <span>Built with React + Vite</span>
        </div>
      </footer>
    </div>
  );
}
