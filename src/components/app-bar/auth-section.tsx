"use client";
import { useState } from "react";
import { useTranslation } from "@/services/i18n/client";
import { Box, Avatar, Menu, Button, Group, Loader, Text } from "@mantine/core";
import Link from "@/components/link";
import useAuth from "@/services/auth/use-auth";
import useAuthActions from "@/services/auth/use-auth-actions";
import { IS_SIGN_UP_ENABLED } from "@/services/auth/config";

const AuthSection = () => {
  const { t } = useTranslation("common");
  const { user, isLoaded } = useAuth();
  const { logOut } = useAuthActions();
  const [menuOpened, setMenuOpened] = useState(false);

  if (!isLoaded) {
    return <Loader color="inherit" />;
  }

  if (user) {
    return (
      <Box>
        <Menu
          opened={menuOpened}
          onChange={setMenuOpened}
          position="bottom-end"
          offset={5}
        >
          <Menu.Target>
            <Avatar
              src={user.photo?.path}
              alt={user?.firstName + " " + user?.lastName}
              radius="xl"
              size="md"
              style={{ cursor: "pointer" }}
              data-testid="profile-menu-item"
            />
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              component={Link}
              href="/profile"
              data-testid="user-profile"
            >
              <Text>{t("common:navigation.profile")}</Text>
            </Menu.Item>
            <Menu.Item onClick={() => logOut()} data-testid="logout-menu-item">
              <Text>{t("common:navigation.logout")}</Text>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>
    );
  }

  // Guest user - show login/signup buttons
  return (
    <Box style={{ display: "flex" }}>
      <Group>
        <Button
          component={Link}
          href="/sign-in"
          variant="subtle"
          size="compact-sm"
        >
          {t("common:navigation.signIn")}
        </Button>
        {IS_SIGN_UP_ENABLED && (
          <Button
            component={Link}
            href="/sign-up"
            variant="filled"
            size="compact-sm"
          >
            {t("common:navigation.signUp")}
          </Button>
        )}
      </Group>
    </Box>
  );
};

export default AuthSection;
