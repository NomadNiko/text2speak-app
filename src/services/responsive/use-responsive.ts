"use client";
import { useMediaQuery } from "@mantine/hooks";

/**
 * Hook for responsive design decisions
 * Returns boolean flags for different device sizes
 */
export function useResponsive() {
  const isMobile = useMediaQuery("(max-width: 48em)"); // 768px
  const isTablet = useMediaQuery(
    "(min-width: 48.0625em) and (max-width: 64em)"
  );
  const isDesktop = useMediaQuery("(min-width: 64.0625em)");

  return { isMobile, isTablet, isDesktop };
}
