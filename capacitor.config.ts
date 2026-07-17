import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.strokencc.calculator",
  appName: "StrokeNCC Calculator",
  webDir: "dist",
  ios: {
    contentInset: "automatic",
  },
};

export default config;
