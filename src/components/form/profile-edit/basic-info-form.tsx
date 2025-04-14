import { useForm, FormProvider, Controller } from "react-hook-form";
import { useAuthPatchMeService } from "@/services/api/services/auth";
import useAuthActions from "@/services/auth/use-auth-actions";
import { Container, Stack, Title, Box, TextInput } from "@mantine/core";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import useAuth from "@/services/auth/use-auth";
import FormAvatarInput from "@/components/form/avatar-input/form-avatar-input";
import { FileEntity } from "@/services/api/types/file-entity";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import { FormActions } from "./form-actions";
import { useSnackbar } from "@/components/mantine/feedback/notification-service";

export type EditProfileBasicInfoFormData = {
  firstName: string;
  lastName: string;
  photo?: FileEntity;
};

const useValidationBasicInfoSchema = () => {
  const { t } = useTranslation("profile");
  return yup.object().shape({
    firstName: yup
      .string()
      .required(t("profile:inputs.firstName.validation.required")),
    lastName: yup
      .string()
      .required(t("profile:inputs.lastName.validation.required")),
  });
};

export function BasicInfoForm() {
  const { setUser } = useAuthActions();
  const { user } = useAuth();
  const fetchAuthPatchMe = useAuthPatchMeService();
  const { t } = useTranslation("profile");
  const validationSchema = useValidationBasicInfoSchema();
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm<EditProfileBasicInfoFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      photo: undefined,
    },
  });
  const { handleSubmit, setError, reset, control } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchAuthPatchMe(formData);
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (
        Object.keys(data.errors) as Array<keyof EditProfileBasicInfoFormData>
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
      setUser(data);
      enqueueSnackbar(t("profile:alerts.profile.success"), {
        variant: "success",
      });
    }
  });

  useEffect(() => {
    reset({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      photo: user?.photo,
    });
  }, [user, reset]);

  return (
    <FormProvider {...methods}>
      <Container size="xs">
        <form onSubmit={onSubmit}>
          <Stack gap="md" py="md">
            <Title order={5}>{t("profile:title1")}</Title>
            <Box>
              <FormAvatarInput<EditProfileBasicInfoFormData>
                name="photo"
                testId="photo"
              />
            </Box>

            <Controller
              name="firstName"
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label={t("profile:inputs.firstName.label")}
                  error={fieldState.error?.message}
                  data-testid="first-name"
                />
              )}
            />

            <Controller
              name="lastName"
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label={t("profile:inputs.lastName.label")}
                  error={fieldState.error?.message}
                  data-testid="last-name"
                />
              )}
            />

            <Box>
              <FormActions
                submitLabel={t("profile:actions.submit")}
                cancelLabel={t("profile:actions.cancel")}
                testId="save-profile"
                cancelTestId="cancel-edit-profile"
                cancelHref="/profile"
              />
            </Box>
          </Stack>
        </form>
      </Container>
    </FormProvider>
  );
}
