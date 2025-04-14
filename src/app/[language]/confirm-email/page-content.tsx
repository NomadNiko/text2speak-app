"use client";
import { useEffect } from "react";
import { Loader, Center } from "@mantine/core";
import { useAuthConfirmEmailService } from "@/services/api/services/auth";
import { useRouter } from "next/navigation";
import { Container } from "@mantine/core";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import { useSnackbar } from "@/components/mantine/feedback/notification-service";

export default function ConfirmEmail() {
  const { enqueueSnackbar } = useSnackbar();
  const fetchConfirmEmail = useAuthConfirmEmailService();
  const router = useRouter();
  const { t } = useTranslation("confirm-email");

  useEffect(() => {
    const confirm = async () => {
      const params = new URLSearchParams(window.location.search);
      const hash = params.get("hash");

      if (hash) {
        const { status } = await fetchConfirmEmail({
          hash,
        });
        if (status === HTTP_CODES_ENUM.NO_CONTENT) {
          enqueueSnackbar(t("confirm-email:emailConfirmed"), {
            variant: "success",
          });
          router.replace("/profile");
        } else {
          enqueueSnackbar(t("confirm-email:emailConfirmFailed"), {
            variant: "error",
          });
          router.replace("/");
        }
      }
    };
    confirm();
  }, [fetchConfirmEmail, router, enqueueSnackbar, t]);

  return (
    <Container size="sm">
      <Center style={{ height: 200 }}>
        <Loader size="lg" />
      </Center>
    </Container>
  );
}
