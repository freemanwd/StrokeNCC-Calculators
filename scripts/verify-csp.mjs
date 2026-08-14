// Serves dist/ with the production security headers and checks the app
// renders without CSP violations. Requires: npm i -D --no-save playwright
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { chromium } from "playwright";

const DIST = "/workspace/dist";
const CSP =
  "default-src 'self'; script-src 'self' https://*.clerk.accounts.dev https://challenges.cloudflare.com; connect-src 'self' https://*.clerk.accounts.dev https://clerk-telemetry.com; img-src 'self' https://img.clerk.com data:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-src https://challenges.cloudflare.com; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'";

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};

const server = createServer((req, res) => {
  let path = join(DIST, req.url.split("?")[0]);
  if (!existsSync(path) || extname(path) === "") path = join(DIST, "index.html");
  res.setHeader("Content-Security-Policy", CSP);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Content-Type", MIME[extname(path)] ?? "application/octet-stream");
  res.end(readFileSync(path));
});

await new Promise((r) => server.listen(4874, r));

const browser = await chromium.launch();
const page = await browser.newPage();
const violations = [];
page.on("console", (msg) => {
  if (/content security policy/i.test(msg.text())) violations.push(msg.text());
});

for (const route of ["/", "/calc/nihss", "/calc/sahvai"]) {
  await page.goto(`http://localhost:4874${route}`, { waitUntil: "networkidle" });
  const heading = await page.locator("h1, h2").first().textContent();
  console.log(`${route} -> "${heading?.trim()}"`);
}

console.log(violations.length === 0 ? "PASS: no CSP violations" : `FAIL:\n${violations.join("\n")}`);
await browser.close();
server.close();
process.exit(violations.length === 0 ? 0 : 1);
