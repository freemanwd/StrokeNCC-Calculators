/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Clerk publishable key. Auth UI is hidden when unset. */
  readonly VITE_CLERK_PUBLISHABLE_KEY?: string;
  /** RevenueCat public Apple API key. Purchases are disabled when unset. */
  readonly VITE_REVENUECAT_APPLE_API_KEY?: string;
  /** AdMob banner ad unit ID. Ads are disabled when unset. */
  readonly VITE_ADMOB_BANNER_AD_ID?: string;
  /** Set to "true" to preview premium features in web/dev builds. */
  readonly VITE_PREMIUM_PREVIEW?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
