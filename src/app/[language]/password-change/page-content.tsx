// ./mantine-boilerplate/src/app/[language]/password-change/page-content.tsx
"use client";
import { Button } from "@mantine/core";
import GuestRouteGuard from "@/services/auth/guest-route-guard";
import {
  useForm,
  FormProvider,
  useFormState,
  Controller,
} from "react-hook-form";
import { useAuthResetPasswordService } from "@/services/api/services/auth";
import { Container } from "@mantine/core";
import { Stack, Alert, Title, TextInput } from "@mantine/core";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import { useEffect, useMemo, useState } from "react";
import { IconAlertCircle } from "@tabler/icons-react";
import { useSnackbar } from "@/components/mantine/feedback/notification-service";
import useGlobalLoading from "@/services/loading/use-global-loading";

type PasswordChangeFormData = {
  password: string;
  passwordConfirmation: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("password-change");
  return yup.object().shape({
    password: yup
      .string()
      .min(6, t("password-change:inputs.password.validation.min"))
      .required(t("password-change:inputs.password.validation.required")),
    passwordConfirmation: yup
      .string()
      .oneOf(
        [yup.ref("password")],
        t("password-change:inputs.passwordConfirmation.validation.match")
      )
      .required(
        t("password-change:inputs.passwordConfirmation.validation.required")
      ),
  });
};

function FormActions() {
  const { t } = useTranslation("password-change");
  const { isSubmitting } = useFormState();
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      data-testid="set-password"
      size="compact-sm"
    >
      {t("password-change:actions.submit")}
    </Button>
  );
}

function ExpiresAlert() {
  const { t } = useTranslation("password-change");
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const expires = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get("expires"));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);
      if (expires < now) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expires]);

  const isExpired = expires < currentTime;

  return isExpired ? (
    <Alert
      icon={<IconAlertCircle size={16} />}
      title={t("password-change:alerts.expired")}
      color="red"
      data-testid="reset-link-expired-alert"
    >
      {t("password-change:alerts.expired")}
    </Alert>
  ) : null;
}

function Form() {
  const { enqueueSnackbar } = useSnackbar();
  const fetchAuthResetPassword = useAuthResetPasswordService();
  const { t } = useTranslation("password-change");
  const validationSchema = useValidationSchema();
  const router = useRouter();
  const { setLoading } = useGlobalLoading();

  const methods = useForm<PasswordChangeFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  const { handleSubmit, setError, control } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    setLoading(true);

    try {
      const params = new URLSearchParams(window.location.search);
      const hash = params.get("hash");
      if (!hash) return;

      const { data, status } = await fetchAuthResetPassword({
        password: formData.password,
        hash,
      });

      if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        (
          Object.keys(data.errors) as Array<keyof PasswordChangeFormData>
        ).forEach((key) => {
          setError(key, {
            type: "manual",
            message: t(
              `password-change:inputs.${key}.validation.server.${data.errors[key]}`
            ),
          });
        });
        return;
      }

      if (status === HTTP_CODES_ENUM.NO_CONTENT) {
        enqueueSnackbar(t("password-change:alerts.success"), {
          variant: "success",
        });
        router.replace("/sign-in");
      }
    } finally {
      setLoading(false);
    }
  });

  return (
    <FormProvider {...methods}>
      <Container size="xs">
        <form onSubmit={onSubmit}>
          <Stack gap="md" mb="md" mt="lg">
            <Title order={6}>{t("password-change:title")}</Title>
            <ExpiresAlert />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  type="password"
                  label={t("password-change:inputs.password.label")}
                  error={fieldState.error?.message}
                  data-testid="password"
                />
              )}
            />
            <Controller
              name="passwordConfirmation"
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  type="password"
                  label={t("password-change:inputs.passwordConfirmation.label")}
                  error={fieldState.error?.message}
                  data-testid="password-confirmation"
                />
              )}
            />
            <FormActions />
          </Stack>
        </form>
      </Container>
    </FormProvider>
  );
}

function PasswordChange() {
  return (
    <GuestRouteGuard>
      <Form />
    </GuestRouteGuard>
  );
}

export default PasswordChange;
