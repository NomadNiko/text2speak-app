"use client";
import { UserProviderEnum } from "@/services/api/types/user";
import useAuth from "@/services/auth/use-auth";
import { BasicInfoForm } from "@/components/form/profile-edit/basic-info-form";
import { ChangeEmailForm } from "@/components/form/profile-edit/change-email-form";
import { ChangePasswordForm } from "@/components/form/profile-edit/change-password-form";
import RouteGuard from "@/services/auth/route-guard";
import { useEffect } from "react";
import useGlobalLoading from "@/services/loading/use-global-loading";

function FormChangeEmailWrapper() {
  const { user } = useAuth();
  return user?.provider === UserProviderEnum.EMAIL ? <ChangeEmailForm /> : null;
}

function FormChangePasswordWrapper() {
  const { user } = useAuth();
  return user?.provider === UserProviderEnum.EMAIL ? (
    <ChangePasswordForm />
  ) : null;
}

function EditProfileContent() {
  const { setLoading } = useGlobalLoading();

  // Turn off loading indicator when component mounts
  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  return (
    <>
      <BasicInfoForm />
      <FormChangeEmailWrapper />
      <FormChangePasswordWrapper />
    </>
  );
}

function EditProfile() {
  return (
    <RouteGuard>
      <EditProfileContent />
    </RouteGuard>
  );
}

export default EditProfile;
