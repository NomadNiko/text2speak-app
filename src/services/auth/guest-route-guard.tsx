"use client";
import useAuth from "./use-auth";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
import useLanguage from "../i18n/use-language";
import useGlobalLoading from "../loading/use-global-loading";

function GuestRouteGuard({ children }: PropsWithChildren<{}>) {
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  const language = useLanguage();
  const { setLoading } = useGlobalLoading();

  useEffect(() => {
    // Set global loading state while checking auth
    if (!isLoaded) {
      setLoading(true);
      return;
    }

    // Auth check is complete
    setLoading(false);

    // Redirect to home if authenticated
    if (user) {
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("returnTo") ?? `/${language}`;
      router.replace(returnTo);
    }
  }, [user, isLoaded, router, language, setLoading]);

  // Only render children if not authenticated
  return isLoaded && !user ? <>{children}</> : null;
}

export default GuestRouteGuard;
