import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import { Container, Text, Anchor, Title } from "@mantine/core";
import { COMPANY_EMAIL } from "@/config/constants";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "privacy-policy");
  return {
    title: t("title"),
  };
}

async function PrivacyPolicy(props: Props) {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "privacy-policy");
  return (
    <Container size="md" py="xl">
      <Title order={2} data-testid="privacy-policy-title" mb="md" fw="bold">
        {t("title")}
      </Title>
      <Text mb="md">{t("lastUpdated")}</Text>
      <Text mb="md" data-testid="privacy-policy-description">
        {t("description1")}
      </Text>
      <Text mb="md">{t("description2")}</Text>
      <Text mt="xl" mb="md">
        {t("contact_info")}
      </Text>
      <Text>
        <Anchor
          target="_blank"
          rel="external noopener noreferrer"
          href={`mailto:${COMPANY_EMAIL}`}
        >
          {COMPANY_EMAIL}
        </Anchor>
      </Text>
    </Container>
  );
}

export default PrivacyPolicy;
