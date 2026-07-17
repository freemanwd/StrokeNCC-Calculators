import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "/workspace/screenshots";
mkdirSync(OUT, { recursive: true });
const base = "http://localhost:5173";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });

await page.goto(`${base}/calc/sahvai`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/09-paywall.png`, fullPage: true });
console.log("saved 09-paywall");

await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/10-home-premium-chip.png`, fullPage: true });
console.log("saved 10-home-premium-chip");

await browser.close();
