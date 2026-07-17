import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "/workspace/screenshots";
mkdirSync(OUT, { recursive: true });
const base = "http://localhost:5173";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });

async function shot(name) {
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log("saved", name);
}

async function pickNth(itemIndex, optIndex) {
  const items = page.locator(".item");
  const opts = items.nth(itemIndex).locator(".option");
  await opts.nth(optIndex).click();
}

// Home
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await shot("01-home");

// NIHSS — answer all 15 items so the interpretation shows
await page.goto(`${base}/calc/nihss`, { waitUntil: "networkidle" });
const nihssPicks = [1, 1, 0, 1, 1, 2, 2, 0, 1, 0, 1, 1, 1, 1, 1];
for (let i = 0; i < nihssPicks.length; i++) await pickNth(i, nihssPicks[i]);
await shot("02-nihss");

// mRS
await page.goto(`${base}/calc/mrs`, { waitUntil: "networkidle" });
await page.locator(".item").nth(0).locator(".option").nth(3).click();
await shot("03-mrs");

// ABCD2
await page.goto(`${base}/calc/abcd2`, { waitUntil: "networkidle" });
const abcd = [1, 1, 2, 2, 1];
for (let i = 0; i < abcd.length; i++) await pickNth(i, abcd[i]);
await shot("04-abcd2");

// ICH
await page.goto(`${base}/calc/ich`, { waitUntil: "networkidle" });
const ichp = [1, 0, 0, 1, 1];
for (let i = 0; i < ichp.length; i++) await pickNth(i, ichp[i]);
await shot("05-ich");

// SAHVAI tabs — requires the dev server to run with VITE_PREMIUM_PREVIEW=true
await page.goto(`${base}/calc/sahvai`, { waitUntil: "networkidle" });
const onPaywall = await page.locator(".paywall").count();
if (onPaywall === 0) {
  const inputs = page.locator(".volume-table input");
  const vals = ["25", "8", "6", "5", "18", "6", "5", "5"];
  for (let i = 0; i < vals.length; i++) await inputs.nth(i).fill(vals[i]);
  await shot("06-sahvai-volume");

  await page.getByRole("tab", { name: /eSAH/ }).click();
  await page.locator(".field input").nth(0).fill("64");
  await page.locator(".field input").nth(1).fill("11");
  await shot("07-sahvai-esah");

  await page.getByRole("tab", { name: /Graeb/ }).click();
  await shot("08-sahvai-graeb");
} else {
  console.log("SAHVAI is paywalled — run dev server with VITE_PREMIUM_PREVIEW=true for tabs 06-08");
}

await browser.close();
console.log("done");
