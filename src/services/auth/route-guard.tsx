"use client";
import { RoleEnum } from "@/services/api/types/role";
import useAuth from "./use-auth";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
import useLanguage from "../i18n/use-language";
import useGlobalLoading from "../loading/use-global-loading";

type RouteGuardProps = {
  roles?: RoleEnum[];
};

const allRoles = Object.values(RoleEnum).filter(
  (value) => !Number.isNaN(Number(value))
) as RoleEnum[];

function RouteGuard({
  children,
  roles = allRoles,
}: PropsWithChildren<RouteGuardProps>) {
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

    // Check if user has required role
    const hasRequiredRole =
      user && user.role?.id && roles.includes(Number(user.role.id));

    if (!hasRequiredRole) {
      // Redirect to sign-in if not authenticated or profile if authenticated but wrong role
      const currentLocation = window.location.toString();
      const returnToPath =
        currentLocation.replace(new URL(currentLocation).origin, "") ||
        `/${language}`;

      let redirectTo: string;
      if (!user) {
        const params = new URLSearchParams({ returnTo: returnToPath });
        redirectTo = `/${language}/sign-in?${params.toString()}`;
      } else {
        redirectTo = `/${language}`;
      }

      router.replace(redirectTo);
    }
  }, [user, isLoaded, router, language, roles, setLoading]);

  // Only render children if authenticated and has required role
  const hasRequiredRole =
    user && user.role?.id && roles.includes(Number(user.role.id));
  return isLoaded && hasRequiredRole ? <>{children}</> : null;
}

export default RouteGuard;
