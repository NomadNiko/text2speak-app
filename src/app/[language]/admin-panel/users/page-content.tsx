// Updated page-content.tsx with type fixes

"use client";
import { RoleEnum } from "@/services/api/types/role";
import { useTranslation } from "@/services/i18n/client";
import { Container, Title, Grid, Group, Button, Box } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetUsersQuery } from "./queries/queries";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useRouter, useSearchParams } from "next/navigation";
import { SortEnum } from "@/services/api/types/sort-type";
import { User } from "@/services/api/types/user";
import Link from "@/components/link";
import UsersTable from "@/components/users/UsersTable";
import RouteGuard from "@/services/auth/route-guard";
import useGlobalLoading from "@/services/loading/use-global-loading";
import { useResponsive } from "@/services/responsive/use-responsive";
import { UserCards } from "@/components/users/UserCards";
import { MobileSortControls } from "@/components/users/MobileSortControls";

type UsersKeys = keyof User;

function Users() {
  const { t: tUsers } = useTranslation("admin-panel-users");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setLoading } = useGlobalLoading();
  const { isMobile } = useResponsive();

  // Initialize sorting state from URL parameters
  const [{ order, orderBy }, setSort] = useState<{
    order: SortEnum;
    orderBy: UsersKeys;
  }>(() => {
    const searchParamsSort = searchParams.get("sort");
    if (searchParamsSort) {
      return JSON.parse(searchParamsSort);
    }
    return { order: SortEnum.DESC, orderBy: "id" };
  });

  // Handle sort column change - client-side only
  const handleRequestSort = useCallback(
    (property: UsersKeys) => {
      const isAsc = orderBy === property && order === SortEnum.ASC;
      const searchParams = new URLSearchParams(window.location.search);
      const newOrder = isAsc ? SortEnum.DESC : SortEnum.ASC;
      const newOrderBy = property;

      // Update URL params
      searchParams.set(
        "sort",
        JSON.stringify({ order: newOrder, orderBy: newOrderBy })
      );

      // Update local sort state
      setSort({
        order: newOrder,
        orderBy: newOrderBy,
      });

      // Update URL without causing a navigation/reload
      router.push(window.location.pathname + "?" + searchParams.toString(), {
        scroll: false,
      });
    },
    [orderBy, order, router]
  );

  // Fetch data without sorting params
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading } =
    useGetUsersQuery();

  // Set global loading state based on query status
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  // Handle infinite scroll
  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Process users data and apply client-side sorting
  const users = useMemo(() => {
    // Get all users from all pages
    const allUsers =
      (data?.pages.flatMap((page) => page?.data) as User[]) ?? ([] as User[]);

    // Remove duplicates
    const uniqueUsers = removeDuplicatesFromArrayObjects(allUsers, "id");

    // Create a sortable copy of the array
    return [...uniqueUsers].sort((a, b) => {
      // Handle cases where the property might be undefined or null
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      // If either value is undefined or null, place it at the end
      if (aValue === undefined || aValue === null)
        return order === SortEnum.ASC ? 1 : -1;
      if (bValue === undefined || bValue === null)
        return order === SortEnum.ASC ? -1 : 1;

      // Compare string values case-insensitively
      if (typeof aValue === "string" && typeof bValue === "string") {
        return order === SortEnum.ASC
          ? aValue.localeCompare(bValue, undefined, { sensitivity: "base" })
          : bValue.localeCompare(aValue, undefined, { sensitivity: "base" });
      }

      // Handle dates - check if values are actually date strings before trying to convert
      if (
        typeof aValue === "string" &&
        typeof bValue === "string" &&
        !isNaN(Date.parse(aValue)) &&
        !isNaN(Date.parse(bValue))
      ) {
        const dateA = new Date(aValue).getTime();
        const dateB = new Date(bValue).getTime();
        return order === SortEnum.ASC ? dateA - dateB : dateB - dateA;
      }

      // Handle numeric comparisons
      if (typeof aValue === "number" && typeof bValue === "number") {
        return order === SortEnum.ASC ? aValue - bValue : bValue - aValue;
      }

      // Handle complex objects - compare by id or name if available
      if (
        typeof aValue === "object" &&
        aValue !== null &&
        typeof bValue === "object" &&
        bValue !== null
      ) {
        // If objects have id property
        if ("id" in aValue && "id" in bValue) {
          const aId = String(aValue.id);
          const bId = String(bValue.id);
          return order === SortEnum.ASC
            ? aId.localeCompare(bId)
            : bId.localeCompare(aId);
        }

        // If objects have name property
        if (
          "name" in aValue &&
          "name" in bValue &&
          typeof aValue.name === "string" &&
          typeof bValue.name === "string"
        ) {
          return order === SortEnum.ASC
            ? aValue.name.localeCompare(bValue.name)
            : bValue.name.localeCompare(aValue.name);
        }
      }

      // Convert to strings as last resort
      const aString = String(aValue);
      const bString = String(bValue);
      return order === SortEnum.ASC
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
  }, [data, orderBy, order]);

  return (
    <RouteGuard roles={[RoleEnum.ADMIN]}>
      <Container w={isMobile ? "100%" : "888px"}>
        <Grid pt="md">
          {/* Header with title and actions */}
          <Grid.Col span={12}>
            <Group justify="space-between">
              <Title order={3}>{tUsers("admin-panel-users:title")}</Title>
              <Group>
                <Button
                  component={Link}
                  href="/admin-panel/users/create"
                  color="green"
                  size="compact-sm"
                >
                  {tUsers("admin-panel-users:actions.create")}
                </Button>
              </Group>
            </Group>
          </Grid.Col>
          {/* Responsive sorting controls for mobile */}
          {isMobile && (
            <Grid.Col span={12} pb="xs">
              <MobileSortControls
                orderBy={orderBy}
                order={order}
                onSort={handleRequestSort}
              />
            </Grid.Col>
          )}
          {/* Users list - responsive between table and cards */}
          <Grid.Col span={12} mb="sm">
            {isMobile ? (
              <Box>
                <UserCards
                  users={users}
                  handleScroll={handleScroll}
                  isFetchingNextPage={isFetchingNextPage}
                  isLoading={isLoading}
                />
              </Box>
            ) : (
              <UsersTable
                users={users}
                order={order}
                orderBy={orderBy}
                handleRequestSort={(event, property) =>
                  handleRequestSort(property)
                }
                handleScroll={handleScroll}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
              />
            )}
          </Grid.Col>
        </Grid>
      </Container>
    </RouteGuard>
  );
}

export default Users;
