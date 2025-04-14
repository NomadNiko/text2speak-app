// src/components/users/UserTableRow.tsx
import { Avatar } from "@mantine/core"; // Import Avatar directly from Mantine
import { User } from "@/services/api/types/user";
import { useTranslation } from "@/services/i18n/client";
import { Box, useMantineColorScheme } from "@mantine/core";
import UserActions from "./UserActions";

interface UserTableRowProps {
  user: User;
}

function UserTableRow({ user }: UserTableRowProps) {
  const { t: tRoles } = useTranslation("admin-panel-roles");
  const { colorScheme } = useMantineColorScheme();

  // Use the correct colorScheme from hook
  const shadowColor =
    colorScheme === "dark"
      ? "rgba(114, 180, 255, 0.4)" // Light blue for dark mode
      : "rgba(0, 100, 255, 0.4)"; // Darker blue for light mode

  return (
    <>
      <td style={{ width: 60, textAlign: "left" }}>
        <Box p="xs">
          <Avatar
            alt={user?.firstName + " " + user?.lastName}
            src={user?.photo?.path}
            size="md"
            style={{
              margin: "2px",
              boxShadow: `0 0 10px ${shadowColor}`,
            }}
          />
        </Box>
      </td>
      <td style={{ width: 200, textAlign: "left" }}>
        {user?.firstName} {user?.lastName}
      </td>
      <td style={{ width: 200, textAlign: "left" }}>{user?.email}</td>
      <td style={{ width: 100, textAlign: "left" }}>
        {tRoles(`role.${user?.role?.id}`)}
      </td>
      <td style={{ width: 375, textAlign: "right" }}>
        {user && <UserActions user={user} />}
      </td>
    </>
  );
}

export default UserTableRow;
