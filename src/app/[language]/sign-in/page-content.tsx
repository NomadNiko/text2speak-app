"use client";
import { useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "@/services/i18n/client";
import { useAuthLoginService } from "@/services/api/services/auth";
import useAuthActions from "@/services/auth/use-auth-actions";
import useAuthTokens from "@/services/auth/use-auth-tokens";
import GuestRouteGuard from "@/services/auth/guest-route-guard";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { IS_SIGN_UP_ENABLED } from "@/services/auth/config";
import { Button } from "@mantine/core";
import { Container } from "@mantine/core";
import { Box, Divider, Stack, Text, TextInput } from "@mantine/core";
import useGlobalLoading from "@/services/loading/use-global-loading";
import { isGoogleAuthEnabled } from "@/services/social-auth/google/google-config";
import Link from "@/components/link";
import SocialAuth from "@/services/social-auth/social-auth";

type SignInFormData = {
  email: string;
  password: string;
};

function SignIn() {
  const { t } = useTranslation("sign-in");
  const { setUser } = useAuthActions();
  const { setTokensInfo } = useAuthTokens();
  const fetchAuthLogin = useAuthLoginService();
  const { setLoading } = useGlobalLoading();

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email(t("sign-in:inputs.email.validation.invalid"))
      .required(t("sign-in:inputs.email.validation.required")),
    password: yup
      .string()
      .min(6, t("sign-in:inputs.password.validation.min"))
      .required(t("sign-in:inputs.password.validation.required")),
  });

  const methods = useForm<SignInFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, setError, control } = methods;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (formData) => {
    setIsSubmitting(true);
    setLoading(true);

    try {
      const { data, status } = await fetchAuthLogin(formData);
      if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        (Object.keys(data.errors) as Array<keyof SignInFormData>).forEach(
          (key) => {
            setError(key, {
              type: "manual",
              message: t(
                `sign-in:inputs.${key}.validation.server.${data.errors[key]}`
              ),
            });
          }
        );
        return;
      }
      if (status === HTTP_CODES_ENUM.OK) {
        setTokensInfo({
          token: data.token,
          refreshToken: data.refreshToken,
          tokenExpires: data.tokenExpires,
        });
        setUser(data.user);
      }
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  });

  return (
    <GuestRouteGuard>
      <FormProvider {...methods}>
        <Container size="xs">
          <form onSubmit={onSubmit}>
            <Stack gap="md" mt="lg">
              <Text size="xl" fw={600}>
                {t("sign-in:title")}
              </Text>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
                    label={t("sign-in:inputs.email.label")}
                    type="email"
                    error={fieldState.error?.message}
                    data-testid="email"
                    autoFocus
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
                    type="password"
                    label={t("sign-in:inputs.password.label")}
                    error={fieldState.error?.message}
                    data-testid="password"
                  />
                )}
              />
              <Text
                component="a"
                href="/forgot-password"
                data-testid="forgot-password"
              >
                {t("sign-in:actions.forgotPassword")}
              </Text>
              <Box>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  data-testid="sign-in-submit"
                  mr="xs"
                  size="compact-sm"
                >
                  {t("sign-in:actions.submit")}
                </Button>
                {IS_SIGN_UP_ENABLED && (
                  <Button
                    variant="outlined"
                    color="gray"
                    component={Link}
                    href="/sign-up"
                    data-testid="create-account"
                    size="compact-sm"
                  >
                    {t("sign-in:actions.createAccount")}
                  </Button>
                )}
              </Box>
              {[isGoogleAuthEnabled].some(Boolean) && (
                <>
                  <Divider label={t("sign-up:or")} labelPosition="center" />
                  <SocialAuth />
                </>
              )}
            </Stack>
          </form>
        </Container>
      </FormProvider>
    </GuestRouteGuard>
  );
}

export default SignIn;
