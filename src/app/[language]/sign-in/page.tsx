import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import MantineSignIn from "./page-content";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "sign-in");
  return {
    title: t("title"),
  };
}

export default function SignInPage() {
  // Use the feature flag to determine which version to render
  return <MantineSignIn />;
}
