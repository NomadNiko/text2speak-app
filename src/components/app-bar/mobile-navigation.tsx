"use client";
import { useTranslation } from "@/services/i18n/client";
import { Divider, Stack } from "@mantine/core";
import Link from "@/components/link";
import { getNavigationConfig } from "@/config/navigation";
import useAuth from "@/services/auth/use-auth";
import { IS_SIGN_UP_ENABLED } from "@/services/auth/config";
import { Button } from "@mantine/core";

interface MobileNavigationProps {
  onCloseMenu?: () => void;
}

const MobileNavigation = ({ onCloseMenu }: MobileNavigationProps) => {
  const { t } = useTranslation("common");
  const { user, isLoaded } = useAuth();
  const navItems = getNavigationConfig();

  // Check if the user has the required role to view the nav item
  const hasRequiredRole = (roles?: number[]): boolean => {
    if (!roles || roles.length === 0) return true;
    if (!user?.role?.id) return false;
    return roles.map(String).includes(String(user.role.id));
  };

  return (
    <Stack>
      {/* Navigation Items */}
      {navItems.map((item) => {
        if (item.desktopOnly || !hasRequiredRole(item.roles)) return null;
        return (
          <Button
            key={item.path}
            component={Link}
            href={item.path}
            variant="subtle"
            fullWidth
            onClick={onCloseMenu} // Add this handler to close menu on click
          >
            {t(item.label)}
          </Button>
        );
      })}
      {/* Authentication Items (mobile only) */}
      {isLoaded && !user && (
        <>
          <Divider />
          <Button
            component={Link}
            href="/sign-in"
            variant="subtle"
            fullWidth
            onClick={onCloseMenu}
          >
            {t("common:navigation.signIn")}
          </Button>
          {IS_SIGN_UP_ENABLED && (
            <Button
              component={Link}
              href="/sign-up"
              variant="subtle"
              fullWidth
              onClick={onCloseMenu}
            >
              {t("common:navigation.signUp")}
            </Button>
          )}
        </>
      )}
    </Stack>
  );
};

export default MobileNavigation;
