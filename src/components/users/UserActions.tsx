"use client";
import { User } from "@/services/api/types/user";
import useAuth from "@/services/auth/use-auth";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import { useDeleteUsersService } from "@/services/api/services/users";
import { usersQueryKeys } from "@/app/[language]/admin-panel/users/queries/queries";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/services/i18n/client";
import { Button, Group, Text } from "@mantine/core";
import { IconTrash, IconEdit, IconLock } from "@tabler/icons-react";
import Link from "@/components/link";
import { useResponsive } from "@/services/responsive/use-responsive";

interface UserActionsProps {
  user: User;
}

function UserActions({ user }: UserActionsProps) {
  const { user: authUser } = useAuth();
  const { confirmDialog } = useConfirmDialog();
  const fetchUserDelete = useDeleteUsersService();
  const queryClient = useQueryClient();
  const canDelete = user.id !== authUser?.id;
  const { t: tUsers } = useTranslation("admin-panel-users");
  const { isMobile } = useResponsive();

  const handleDelete = async () => {
    const isConfirmed = await confirmDialog({
      title: tUsers("admin-panel-users:confirm.delete.title"),
      message: tUsers("admin-panel-users:confirm.delete.message"),
    });
    if (isConfirmed) {
      // Define the type for user query data
      type UsersQueryData = InfiniteData<{ nextPage: number; data: User[] }>;
      // Get the base query key for users
      const baseQueryKey = usersQueryKeys.list().key;
      // Cancel any in-flight queries
      await queryClient.cancelQueries({ queryKey: baseQueryKey });
      // Update all matching queries in the cache regardless of filters or sorting
      // This approach ensures consistency across all views of user data
      queryClient.setQueriesData(
        { queryKey: [baseQueryKey[0]] },
        (oldData: UsersQueryData | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.filter((item) => item.id !== user.id),
            })),
          };
        }
      );
      // Perform the actual delete operation
      await fetchUserDelete({
        id: user.id,
      });
      // Instead of invalidating queries, we've already updated the cache
      // This avoids unnecessary refetching while maintaining data consistency
    }
  };

  // Mobile view styling
  const mobileButtonStyle = {
    width: "auto",
    overflow: "hidden",
    whiteSpace: "nowrap" as const,
    textOverflow: "ellipsis",
  };

  // Desktop view styling - reduced dimensions as requested
  const desktopButtonStyle = {
    width: "88px",
    height: "24px",
    padding: "0 6px",
    overflow: "hidden",
    whiteSpace: "nowrap" as const,
    textOverflow: "ellipsis",
  };

  // Use appropriate styling based on device type
  const buttonStyle = isMobile ? mobileButtonStyle : desktopButtonStyle;

  // Font size adjustment specifically for desktop
  const textSize = isMobile ? "xs" : "xs"; // Smaller text size for desktop

  // Mobile view with all actions as buttons
  if (isMobile) {
    return (
      <Group gap="xs" wrap="nowrap">
        <Button
          size="xs"
          variant="light"
          component={Link}
          href={`/admin-panel/users/edit/${user.id}`}
          style={buttonStyle}
        >
          <Group gap={4} align="center" wrap="nowrap">
            <IconEdit size={14} />
            <Text size={textSize} truncate>
              {tUsers("admin-panel-users:actions.edit")}
            </Text>
          </Group>
        </Button>
        <Button
          size="xs"
          variant="light"
          component={Link}
          href={`/admin-panel/users/edit-password/${user.id}`}
          style={buttonStyle}
        >
          <Group gap={4} align="center" wrap="nowrap">
            <IconLock size={14} />
            <Text size={textSize} truncate>
              {tUsers("admin-panel-users:actions.changePassword")}
            </Text>
          </Group>
        </Button>
        {canDelete && (
          <Button
            size="xs"
            variant="light"
            color="red"
            onClick={handleDelete}
            style={buttonStyle}
          >
            <Group gap={4} align="center" wrap="nowrap">
              <IconTrash size={14} />
              <Text size={textSize} truncate>
                {tUsers("admin-panel-users:actions.delete")}
              </Text>
            </Group>
          </Button>
        )}
      </Group>
    );
  }

  // Desktop view - with more compact buttons
  return (
    <Group gap="xs">
      <Button
        size="xs"
        component={Link}
        href={`/admin-panel/users/edit/${user.id}`}
        style={buttonStyle}
        styles={{
          inner: {
            fontSize: "12px", // Smaller font size for desktop
            height: "100%",
          },
        }}
      >
        <Group gap={4} align="center" wrap="nowrap">
          <IconEdit size={12} />
          <Text size="xs" truncate>
            {tUsers("admin-panel-users:actions.edit")}
          </Text>
        </Group>
      </Button>
      <Button
        size="xs"
        variant="light"
        component={Link}
        href={`/admin-panel/users/edit-password/${user.id}`}
        style={buttonStyle}
        styles={{
          inner: {
            fontSize: "12px", // Smaller font size for desktop
            height: "100%",
          },
        }}
      >
        <Group gap={4} align="center" wrap="nowrap">
          <IconLock size={12} />
          <Text size="xs" truncate>
            {tUsers("admin-panel-users:actions.changePassword")}
          </Text>
        </Group>
      </Button>
      {canDelete && (
        <Button
          size="xs"
          variant="light"
          color="red"
          onClick={handleDelete}
          style={buttonStyle}
          styles={{
            inner: {
              fontSize: "12px", // Smaller font size for desktop
              height: "100%",
            },
          }}
        >
          <Group gap={4} align="center" wrap="nowrap">
            <IconTrash size={12} />
            <Text size="xs" truncate>
              {tUsers("admin-panel-users:actions.delete")}
            </Text>
          </Group>
        </Button>
      )}
    </Group>
  );
}

export default UserActions;
