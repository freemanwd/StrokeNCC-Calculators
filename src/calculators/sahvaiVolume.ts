export interface Measurement {
  a: string; // length (mm)
  b: string; // thickness (mm)
  c: string; // number of slices
  slice: string; // slice thickness (mm)
}

export const emptyMeasurement = (): Measurement => ({
  a: "",
  b: "",
  c: "",
  slice: "5",
});

/**
 * ABC/2-derived volume in mL.
 * V(mL) = (A × B × C × sliceThickness) / 2 × 10^-3
 * where A, B, sliceThickness are in mm and C is the slice count.
 * When `halve` is true (SDH) the result is divided by 2 again.
 */
export function measurementVolume(m: Measurement, halve = false): number {
  const a = parseFloat(m.a);
  const b = parseFloat(m.b);
  const c = parseFloat(m.c);
  const slice = parseFloat(m.slice);
  if ([a, b, c, slice].some((v) => !isFinite(v) || v <= 0)) return 0;
  let vol = (a * b * c * slice) / 2 / 1000;
  if (halve) vol /= 2;
  return vol;
}

export interface RegionDef {
  id: string;
  label: string;
  bilateral: boolean;
  halve?: boolean;
}

export const cisternalRegions: RegionDef[] = [
  { id: "sstv", label: "1. Suprasellar cistern (SSTV)", bilateral: false },
  { id: "pmtv", label: "2. Perimesencephalic cistern (PMTV)", bilateral: true },
  { id: "pptv", label: "3. Prepontine cistern (PPTV)", bilateral: false },
  { id: "sytv", label: "4. Sylvian cistern (SYTV)", bilateral: true },
  { id: "itv", label: "5. Interhemispheric fissure (ITV)", bilateral: false },
];

export const axialRegions: RegionDef[] = [
  { id: "iph", label: "6. Intraparenchymal hemorrhage (IPH)", bilateral: true },
  { id: "sdh", label: "Subdural hematoma (SDH, ÷2)", bilateral: true, halve: true },
];

export function eSahScore(
  age: number | null,
  gcs: number | null,
  sahv: number | null
): { score: number; complete: boolean; agePts: number; gcsPts: number; sahvPts: number } {
  const agePts = age == null ? 0 : age > 55 ? 1 : 0;
  const gcsPts = gcs == null ? 0 : gcs <= 7 ? 2 : gcs <= 12 ? 1 : 0;
  const sahvPts = sahv == null ? 0 : sahv > 20 ? 2 : sahv > 10 ? 1 : 0;
  return {
    score: agePts + gcsPts + sahvPts,
    complete: age != null && gcs != null && sahv != null,
    agePts,
    gcsPts,
    sahvPts,
  };
}
