// src/components/users/UserCard.tsx
import {
  Card,
  Text,
  Group,
  Stack,
  Badge,
  Box,
  useMantineColorScheme,
  Avatar, // Import Avatar directly from Mantine
} from "@mantine/core";
import { User } from "@/services/api/types/user";
import UserActions from "./UserActions";
import { useTranslation } from "@/services/i18n/client";

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const { t: tRoles } = useTranslation("admin-panel-roles");
  const { colorScheme } = useMantineColorScheme();

  // Use the correct colorScheme from hook
  const shadowColor =
    colorScheme === "dark"
      ? "rgba(126, 178, 236, 0.47)" // Light blue for dark mode
      : "rgba(61, 106, 255, 0.4)"; // Darker blue for light mode

  return (
    <Card shadow="sm" p="md" radius="md" withBorder mb="sm">
      <Group align="flex-start" wrap="nowrap">
        <Box p="xs">
          <Avatar
            src={user?.photo?.path}
            alt={`${user?.firstName} ${user?.lastName}`}
            size="lg"
            radius="xl"
            style={{
              margin: "2px",
              boxShadow: `0 0 10px ${shadowColor}`,
            }}
          />
        </Box>
        <Stack gap="xs">
          <Text size="lg" fw={500}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text size="sm" c="dimmed">
            {user?.email}
          </Text>
          <Badge size="sm" w="fit-content">
            {tRoles(`role.${user?.role?.id}`)}
          </Badge>
        </Stack>
      </Group>
      <Group justify="flex-end" mt="md">
        <UserActions user={user} />
      </Group>
    </Card>
  );
}
