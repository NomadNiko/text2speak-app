"use client";

import { Stack } from "@mantine/core";
import GoogleAuth from "./google/google-auth";
import { isGoogleAuthEnabled } from "./google/google-config";

export default function SocialAuth() {
  return (
    <Stack gap="md">
      {isGoogleAuthEnabled && (
        <div>
          <GoogleAuth />
        </div>
      )}
    </Stack>
  );
}
