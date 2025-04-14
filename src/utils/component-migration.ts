export const convertMaxWidthToSize = (
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl"
) => {
  const size = maxWidth || "lg";
  // All values map directly in this case
  return size;
};

export const convertElevationToShadow = (elevation?: number) => {
  if (!elevation && elevation !== 0) return "xs"; // Default in the wrapper was 1 which maps to xs

  const shadowMap: Record<number, string> = {
    0: "none",
    1: "xs",
    2: "sm",
    3: "md",
    4: "lg",
    5: "xl",
  };

  return shadowMap[Math.min(elevation, 5)];
};

export const convertSpacingToGutter = (spacing?: number) => {
  return (spacing || 2) * 8; // Default spacing was 2, multiplied by 8
};

export const determineSpanFromBreakpoints = (
  xs?: number | "auto",
  sm?: number | "auto",
  md?: number | "auto",
  lg?: number | "auto",
  xl?: number | "auto"
) => {
  // Use the most specific breakpoint available
  let span = xs;
  if (sm !== undefined) span = sm;
  if (md !== undefined) span = md;
  if (lg !== undefined) span = lg;
  if (xl !== undefined) span = xl;

  return span === "auto" ? "auto" : span;
};
