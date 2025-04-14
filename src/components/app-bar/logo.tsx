"use client";
import { Anchor, Text } from "@mantine/core";
import { useTranslation } from "@/services/i18n/client";
import { oxanium } from "@/config/fonts";
interface LogoProps {
  isMobile?: boolean;
}
const Logo = ({ isMobile = false }: LogoProps) => {
  const { t } = useTranslation("common");
  const display = isMobile
    ? { base: "flex", md: "none" }
    : { base: "none", md: "flex" };
  // Use Anchor directly instead of Box with component prop
  return (
    <Anchor
      href="/"
      underline="never"
      display={display}
      style={{
        flexGrow: isMobile ? 1 : 0,
        fontFamily: `${oxanium.style.fontFamily}, system-ui, sans-serif`,
        textDecoration: "none",
      }}
    >
      <Text size={isMobile ? "xl" : "lg"} fw={700}>
        {t("common:app-name")}
      </Text>
    </Anchor>
  );
};
export default Logo;
