import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import MantineHome from "./page-mantine"; // Import the Mantine version

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "home");
  return {
    title: t("title"),
  };
}

export default function Home() {
  // Use the Mantine version directly, removing the feature flag
  return <MantineHome />;
}
