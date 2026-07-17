import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { usePremium } from "./premium";

const BANNER_AD_ID = import.meta.env.VITE_ADMOB_BANNER_AD_ID;

/**
 * Shows an AdMob banner pinned to the bottom of the screen for free-tier
 * users in the native app. No-ops on web, for premium subscribers, or when
 * no ad unit ID is configured.
 */
export function useAdBanner() {
  const { isPremium } = usePremium();
  const enabled =
    Capacitor.isNativePlatform() && !!BANNER_AD_ID && !isPremium;

  useEffect(() => {
    if (!enabled) return;
    let shown = false;
    (async () => {
      try {
        const { AdMob, BannerAdPosition, BannerAdSize } = await import(
          "@capacitor-community/admob"
        );
        await AdMob.initialize({});
        await AdMob.showBanner({
          adId: BANNER_AD_ID!,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
        });
        shown = true;
      } catch (err) {
        console.warn("AdMob banner failed", err);
      }
    })();
    return () => {
      if (!shown) return;
      import("@capacitor-community/admob")
        .then(({ AdMob }) => AdMob.removeBanner())
        .catch(() => {});
    };
  }, [enabled]);
}
