// src/components/responsive-display/ResponsiveDisplay.tsx
import { ReactNode } from "react";
import { useResponsive } from "@/services/responsive/use-responsive";

interface ResponsiveDisplayProps {
  /**
   * Content to render on desktop devices
   */
  desktopContent: ReactNode;

  /**
   * Content to render on mobile devices
   */
  mobileContent: ReactNode;
}

/**
 * A component that conditionally renders content based on screen size
 * Follows Single Responsibility Principle by only handling view switching
 */
export function ResponsiveDisplay({
  desktopContent,
  mobileContent,
}: ResponsiveDisplayProps) {
  const { isMobile } = useResponsive();

  return <>{isMobile ? mobileContent : desktopContent}</>;
}
