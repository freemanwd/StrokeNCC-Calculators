import { useEffect, type ReactNode } from "react";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { usePremium } from "./premium";

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const authEnabled = !!CLERK_KEY;

/** Wraps the app in ClerkProvider when a publishable key is configured. */
export function AuthProvider({ children }: { children: ReactNode }) {
  if (!authEnabled) return <>{children}</>;
  return (
    <ClerkProvider publishableKey={CLERK_KEY!} afterSignOutUrl="/">
      <PurchasesIdentitySync />
      {children}
    </ClerkProvider>
  );
}

/** Keeps the RevenueCat app user ID in sync with the Clerk user. */
function PurchasesIdentitySync() {
  const { isLoaded, user } = useUser();
  const { identify, purchasesReady } = usePremium();

  useEffect(() => {
    if (!isLoaded || !purchasesReady) return;
    identify(user?.id ?? null);
  }, [isLoaded, user?.id, purchasesReady, identify]);

  return null;
}

/** Sign-in button / user avatar for the header. Renders nothing when auth is not configured. */
export function HeaderAuth() {
  if (!authEnabled) return null;
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button type="button" className="btn btn-primary btn-compact">
            Sign in
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}
