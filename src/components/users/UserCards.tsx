// src/components/users/UserCards.tsx
import { useEffect, useRef } from "react";
import { Stack, Center, Loader, Text } from "@mantine/core";
import { User } from "@/services/api/types/user";
import { UserCard } from "./UserCard";

interface UserCardsProps {
  users: User[];
  handleScroll: () => void;
  isFetchingNextPage: boolean;
  isLoading?: boolean;
}

/**
 * Container component for displaying multiple user cards
 * Implements infinite scrolling using Intersection Observer
 */
export function UserCards({
  users,
  handleScroll,
  isFetchingNextPage,
  isLoading,
}: UserCardsProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    const currentTarget = observerTarget.current;

    if (!currentTarget || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleScroll();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentTarget);

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [handleScroll, isFetchingNextPage]);

  if (users.length === 0 && isLoading) {
    return (
      <Center p="xl">
        <Loader size="md" />
      </Center>
    );
  }

  if (users.length === 0) {
    return (
      <Center p="xl">
        <Text>No users found</Text>
      </Center>
    );
  }

  return (
    <Stack gap="md">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}

      {/* Loader for fetching next page */}
      {isFetchingNextPage && (
        <Center p="md">
          <Loader size="sm" />
        </Center>
      )}

      {/* Invisible element for intersection observer */}
      <div ref={observerTarget} style={{ height: 10 }}></div>
    </Stack>
  );
}
