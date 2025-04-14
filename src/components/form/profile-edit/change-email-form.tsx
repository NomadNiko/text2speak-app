import { useForm, FormProvider, Controller } from "react-hook-form";
import { useAuthPatchMeService } from "@/services/api/services/auth";
import { Container, Stack, Title, Box, Text, TextInput } from "@mantine/core";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useAuth from "@/services/auth/use-auth";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import { FormActions } from "./form-actions";
import { useSnackbar } from "@/components/mantine/feedback/notification-service";

export type EditProfileChangeEmailFormData = {
  email: string;
  emailConfirmation: string;
};

const useValidationChangeEmailSchema = () => {
  const { t } = useTranslation("profile");
  const { user } = useAuth();
  return yup.object().shape({
    email: yup
      .string()
      .notOneOf(
        [user?.email],
        t("profile:inputs.email.validation.currentEmail")
      )
      .email(t("profile:inputs.email.validation.email"))
      .required(t("profile:inputs.email.validation.required")),
    emailConfirmation: yup
      .string()
      .oneOf(
        [yup.ref("email")],
        t("profile:inputs.emailConfirmation.validation.match")
      )
      .required(t("profile:inputs.emailConfirmation.validation.required")),
  });
};

export function ChangeEmailForm() {
  const fetchAuthPatchMe = useAuthPatchMeService();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation("profile");
  const validationSchema = useValidationChangeEmailSchema();
  const { user } = useAuth();
  const methods = useForm<EditProfileChangeEmailFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      emailConfirmation: "",
    },
  });
  const { handleSubmit, reset, setError, control } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchAuthPatchMe({
      email: formData.email,
    });
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (
        Object.keys(data.errors) as Array<keyof EditProfileChangeEmailFormData>
      ).forEach((key) => {
        setError(key, {
          type: "manual",
          message: t(
            `profile:inputs.${key}.validation.server.${data.errors[key]}`
          ),
        });
      });
      return;
    }
    if (status === HTTP_CODES_ENUM.OK) {
      reset();
      enqueueSnackbar(t("profile:alerts.email.success"), {
        variant: "success",
        autoHideDuration: 15000,
      });
    }
  });

  return (
    <FormProvider {...methods}>
      <Container size="xs">
        <form onSubmit={onSubmit}>
          <Stack gap="md" py="md">
            <Title order={5}>{t("profile:title2")}</Title>
            <Text>{user?.email}</Text>

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label={t("profile:inputs.email.label")}
                  type="email"
                  error={fieldState.error?.message}
                  data-testid="email"
                />
              )}
            />

            <Controller
              name="emailConfirmation"
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label={t("profile:inputs.emailConfirmation.label")}
                  type="email"
                  error={fieldState.error?.message}
                  data-testid="email-confirmation"
                />
              )}
            />

            <Box>
              <FormActions
                submitLabel={t("profile:actions.submit")}
                cancelLabel={t("profile:actions.cancel")}
                testId="save-email"
                cancelTestId="cancel-edit-email"
                cancelHref="/profile"
              />
            </Box>
          </Stack>
        </form>
      </Container>
    </FormProvider>
  );
}
