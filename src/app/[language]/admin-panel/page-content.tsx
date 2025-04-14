"use client";
import { RoleEnum } from "@/services/api/types/role";
import { useTranslation } from "@/services/i18n/client";
import { Container, Stack, Title, Text } from "@mantine/core";
import RouteGuard from "@/services/auth/route-guard";

function AdminPanel() {
  const { t } = useTranslation("admin-panel-home");

  return (
    <RouteGuard roles={[RoleEnum.ADMIN]}>
      <Container size="md">
        <Stack gap="md" pt="md">
          <Title order={3} data-testid="home-title">
            {t("title")}
          </Title>
          <Text>{t("description")}</Text>
        </Stack>
      </Container>
    </RouteGuard>
  );
}

export default AdminPanel;
