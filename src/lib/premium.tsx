import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Capacitor } from "@capacitor/core";
import {
  Purchases,
  type CustomerInfo,
  type PurchasesPackage,
} from "@revenuecat/purchases-capacitor";

export const PREMIUM_ENTITLEMENT = "premium";

const REVENUECAT_KEY = import.meta.env.VITE_REVENUECAT_APPLE_API_KEY;
const PREVIEW = import.meta.env.VITE_PREMIUM_PREVIEW === "true";

export interface PremiumContextValue {
  /** True when running inside the native iOS/Android shell. */
  native: boolean;
  /** True when RevenueCat is configured and purchases can be made. */
  purchasesReady: boolean;
  isPremium: boolean;
  packages: PurchasesPackage[];
  purchase: (pkg: PurchasesPackage) => Promise<void>;
  restore: () => Promise<void>;
  /** Ties the RevenueCat identity to the signed-in user (Clerk user ID). */
  identify: (userId: string | null) => Promise<void>;
}

const PremiumContext = createContext<PremiumContextValue>({
  native: false,
  purchasesReady: false,
  isPremium: PREVIEW,
  packages: [],
  purchase: async () => {},
  restore: async () => {},
  identify: async () => {},
});

function hasEntitlement(info: CustomerInfo | undefined): boolean {
  return !!info?.entitlements.active[PREMIUM_ENTITLEMENT];
}

export function PremiumProvider({ children }: { children: ReactNode }) {
  const native = Capacitor.isNativePlatform();
  const enabled = native && !!REVENUECAT_KEY;

  const [purchasesReady, setPurchasesReady] = useState(false);
  const [isPremium, setIsPremium] = useState(PREVIEW);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    (async () => {
      try {
        await Purchases.configure({ apiKey: REVENUECAT_KEY! });
        await Purchases.addCustomerInfoUpdateListener((info) => {
          if (!cancelled) setIsPremium(PREVIEW || hasEntitlement(info));
        });
        const [{ customerInfo }, offerings] = await Promise.all([
          Purchases.getCustomerInfo(),
          Purchases.getOfferings(),
        ]);
        if (cancelled) return;
        setIsPremium(PREVIEW || hasEntitlement(customerInfo));
        setPackages(offerings.current?.availablePackages ?? []);
        setPurchasesReady(true);
      } catch (err) {
        console.warn("RevenueCat initialization failed", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const purchase = useCallback(async (pkg: PurchasesPackage) => {
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
    setIsPremium(PREVIEW || hasEntitlement(customerInfo));
  }, []);

  const restore = useCallback(async () => {
    const { customerInfo } = await Purchases.restorePurchases();
    setIsPremium(PREVIEW || hasEntitlement(customerInfo));
  }, []);

  const identify = useCallback(
    async (userId: string | null) => {
      if (!enabled || !purchasesReady) return;
      try {
        if (userId) {
          const { customerInfo } = await Purchases.logIn({ appUserID: userId });
          setIsPremium(PREVIEW || hasEntitlement(customerInfo));
        } else {
          const { customerInfo } = await Purchases.logOut();
          setIsPremium(PREVIEW || hasEntitlement(customerInfo));
        }
      } catch (err) {
        console.warn("RevenueCat identity sync failed", err);
      }
    },
    [enabled, purchasesReady]
  );

  return (
    <PremiumContext.Provider
      value={{ native, purchasesReady, isPremium, packages, purchase, restore, identify }}
    >
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium(): PremiumContextValue {
  return useContext(PremiumContext);
}
