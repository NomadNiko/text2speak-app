import { dir } from "i18next";
import { languages } from "@/services/i18n/config";
import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import StoreLanguageProvider from "@/services/i18n/store-language-provider";
import LeavePageProvider from "@/services/leave-page/leave-page-provider";
import QueryClientProvider from "@/services/react-query/query-client-provider";
import queryClient from "@/services/react-query/query-client";
import ReactQueryDevtools from "@/services/react-query/react-query-devtools";
import GoogleAuthProvider from "@/services/social-auth/google/google-auth-provider";
import ConfirmDialogProvider from "@/components/confirm-dialog/confirm-dialog-provider";
import AuthProvider from "@/services/auth/auth-provider";
import ResponsiveAppBar from "@/components/app-bar";
import { MantineProviders } from "@/components/theme/mantine-provider";
import { NotificationsProvider } from "@/components/mantine/feedback/notification-provider";
import { oxanium } from "@/config/fonts";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "../globals.css";
import "@/services/i18n/config";
import GlobalLoadingProvider from "@/services/loading/global-loading-provider";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "common");
  return {
    title: t("title"),
  };
}

export function generateStaticParams() {
  return languages.map((language) => ({ language }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ language: string }>;
}) {
  const params = await props.params;
  const { language } = params;
  const { children } = props;
  return (
    <html
      lang={language}
      dir={dir(language)}
      className={oxanium.variable}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <MantineProviders>
            <StoreLanguageProvider>
              <ConfirmDialogProvider>
                <GlobalLoadingProvider>
                  <AuthProvider>
                    <GoogleAuthProvider>
                      <LeavePageProvider>
                        <NotificationsProvider>
                          <ResponsiveAppBar>{children}</ResponsiveAppBar>
                        </NotificationsProvider>
                      </LeavePageProvider>
                    </GoogleAuthProvider>
                  </AuthProvider>
                </GlobalLoadingProvider>
              </ConfirmDialogProvider>
            </StoreLanguageProvider>
          </MantineProviders>
        </QueryClientProvider>
      </body>
    </html>
  );
}
