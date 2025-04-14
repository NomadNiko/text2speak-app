import { User } from "../types/user";
import { Tokens } from "../types/tokens";
import {
  createPostService,
  createGetService,
  createPatchService,
} from "../factory";

// Type definitions
export type AuthLoginRequest = {
  email: string;
  password: string;
};

export type AuthLoginResponse = Tokens & {
  user: User;
};

export type AuthGoogleLoginRequest = {
  idToken: string;
};

export type AuthGoogleLoginResponse = Tokens & {
  user: User;
};

export type AuthSignUpRequest = {
  email: string;
  password: string;
};

export type AuthSignUpResponse = void;

export type AuthConfirmEmailRequest = {
  hash: string;
};

export type AuthConfirmEmailResponse = void;

export type AuthConfirmNewEmailRequest = {
  hash: string;
};

export type AuthConfirmNewEmailResponse = void;

export type AuthForgotPasswordRequest = {
  email: string;
};

export type AuthForgotPasswordResponse = void;

export type AuthResetPasswordRequest = {
  password: string;
  hash: string;
};

export type AuthResetPasswordResponse = void;

export type AuthPatchMeRequest =
  | Partial<Pick<User, "firstName" | "lastName" | "email">>
  | { password: string; oldPassword: string };

export type AuthPatchMeResponse = User;

export type AuthGetMeResponse = User;

// API Services using the new factory pattern
export const useAuthLoginService = createPostService<
  AuthLoginRequest,
  AuthLoginResponse
>("/v1/auth/email/login");

export const useAuthGoogleLoginService = createPostService<
  AuthGoogleLoginRequest,
  AuthGoogleLoginResponse
>("/v1/auth/google/login");

export const useAuthSignUpService = createPostService<
  AuthSignUpRequest,
  AuthSignUpResponse
>("/v1/auth/email/register");

export const useAuthConfirmEmailService = createPostService<
  AuthConfirmEmailRequest,
  AuthConfirmEmailResponse
>("/v1/auth/email/confirm");

export const useAuthConfirmNewEmailService = createPostService<
  AuthConfirmNewEmailRequest,
  AuthConfirmNewEmailResponse
>("/v1/auth/email/confirm/new");

export const useAuthForgotPasswordService = createPostService<
  AuthForgotPasswordRequest,
  AuthForgotPasswordResponse
>("/v1/auth/forgot/password");

export const useAuthResetPasswordService = createPostService<
  AuthResetPasswordRequest,
  AuthResetPasswordResponse
>("/v1/auth/reset/password");

export const useAuthPatchMeService = createPatchService<
  AuthPatchMeRequest,
  AuthPatchMeResponse
>("/v1/auth/me");

export const useAuthGetMeService =
  createGetService<AuthGetMeResponse>("/v1/auth/me");
