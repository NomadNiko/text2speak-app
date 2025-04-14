"use client";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { usePatchUserService } from "@/services/api/services/users";
import { Container, Stack, Title, Box, TextInput } from "@mantine/core";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import { FormActions } from "@/components/form/profile-edit/form-actions";
import { useSnackbar } from "@/components/mantine/feedback/notification-service";
import RouteGuard from "@/services/auth/route-guard";
import { RoleEnum } from "@/services/api/types/role";
import { useParams } from "next/navigation";

type ChangePasswordFormData = {
  password: string;
  passwordConfirmation: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("admin-panel-users-edit");
  return yup.object().shape({
    password: yup
      .string()
      .min(6, t("admin-panel-users-edit:inputs.password.validation.min"))
      .required(
        t("admin-panel-users-edit:inputs.password.validation.required")
      ),
    passwordConfirmation: yup
      .string()
      .oneOf(
        [yup.ref("password")],
        t("admin-panel-users-edit:inputs.passwordConfirmation.validation.match")
      )
      .required(
        t(
          "admin-panel-users-edit:inputs.passwordConfirmation.validation.required"
        )
      ),
  });
};

function EditUserPassword() {
  const params = useParams<{ id: string }>();
  const userId = params.id;
  const fetchPatchUser = usePatchUserService();
  const { t } = useTranslation("admin-panel-users-edit");
  const validationSchema = useValidationSchema();
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<ChangePasswordFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  const { handleSubmit, setError, reset, control } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchPatchUser(
      { password: formData.password },
      { id: userId }
    );

    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof ChangePasswordFormData>).forEach(
        (key) => {
          setError(key, {
            type: "manual",
            message: t(
              `admin-panel-users-edit:inputs.${key}.validation.server.${data.errors[key]}`
            ),
          });
        }
      );
      return;
    }

    if (status === HTTP_CODES_ENUM.OK) {
      reset();
      enqueueSnackbar(t("admin-panel-users-edit:alerts.password.success"), {
        variant: "success",
      });
    }
  });

  return (
    <RouteGuard roles={[RoleEnum.ADMIN]}>
      <FormProvider {...methods}>
        <Container size="xs">
          <form onSubmit={onSubmit}>
            <Stack gap="md" py="md">
              <Title order={5}>{t("admin-panel-users-edit:title2")}</Title>
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
                    type="password"
                    label={t("admin-panel-users-edit:inputs.password.label")}
                    error={fieldState.error?.message}
                    data-testid="new-password"
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
                    label={t(
                      "admin-panel-users-edit:inputs.passwordConfirmation.label"
                    )}
                    error={fieldState.error?.message}
                    data-testid="password-confirmation"
                  />
                )}
              />
              <Box>
                <FormActions
                  submitLabel={t("admin-panel-users-edit:actions.submit")}
                  cancelLabel={t("admin-panel-users-edit:actions.cancel")}
                  testId="save-password"
                  cancelTestId="cancel-edit-password"
                  cancelHref="/admin-panel/users"
                />
              </Box>
            </Stack>
          </form>
        </Container>
      </FormProvider>
    </RouteGuard>
  );
}

export default EditUserPassword;
