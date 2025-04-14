"use client";
import { Button } from "@mantine/core";
import GuestRouteGuard from "@/services/auth/guest-route-guard";
import {
  useForm,
  FormProvider,
  useFormState,
  Controller,
} from "react-hook-form";
import { useAuthForgotPasswordService } from "@/services/api/services/auth";
import { Container, Stack, Title, TextInput } from "@mantine/core";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import { useSnackbar } from "@/components/mantine/feedback/notification-service";
import useGlobalLoading from "@/services/loading/use-global-loading";

type ForgotPasswordFormData = {
  email: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("forgot-password");
  return yup.object().shape({
    email: yup
      .string()
      .email(t("forgot-password:inputs.email.validation.invalid"))
      .required(t("forgot-password:inputs.email.validation.required")),
  });
};

function FormActions() {
  const { t } = useTranslation("forgot-password");
  const { isSubmitting } = useFormState();
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      data-testid="send-email"
      size="compact-sm"
    >
      {t("forgot-password:actions.submit")}
    </Button>
  );
}

function Form() {
  const { enqueueSnackbar } = useSnackbar();
  const fetchAuthForgotPassword = useAuthForgotPasswordService();
  const { t } = useTranslation("forgot-password");
  const validationSchema = useValidationSchema();
  const { setLoading } = useGlobalLoading();

  const methods = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
    },
  });

  const { handleSubmit, setError, control } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    setLoading(true);

    try {
      const { data, status } = await fetchAuthForgotPassword(formData);

      if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        (
          Object.keys(data.errors) as Array<keyof ForgotPasswordFormData>
        ).forEach((key) => {
          setError(key, {
            type: "manual",
            message: t(
              `forgot-password:inputs.${key}.validation.server.${data.errors[key]}`
            ),
          });
        });
        return;
      }

      if (status === HTTP_CODES_ENUM.NO_CONTENT) {
        enqueueSnackbar(t("forgot-password:alerts.success"), {
          variant: "success",
        });
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
            <Title order={6}>{t("forgot-password:title")}</Title>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label={t("forgot-password:inputs.email.label")}
                  type="email"
                  error={fieldState.error?.message}
                  data-testid="email"
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

function ForgotPassword() {
  return (
    <GuestRouteGuard>
      <Form />
    </GuestRouteGuard>
  );
}

export default ForgotPassword;
