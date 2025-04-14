// src/app/[language]/text-to-speech/page-content.tsx
"use client";
import { Container, Title, Text, Stack, Paper } from "@mantine/core";
import { useTranslation } from "@/services/i18n/client";
import { TtsForm } from "@/components/tts/TtsForm";
import { useEffect } from "react";
import useGlobalLoading from "@/services/loading/use-global-loading";

function TextToSpeechPage() {
  const { t } = useTranslation("tts");
  const { setLoading } = useGlobalLoading();

  // Ensure loading indicator is off when page mounts
  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Title order={2}>{t("title")}</Title>
        <Text>{t("description")}</Text>
        <Paper shadow="sm" radius="md" p="lg" withBorder>
          <TtsForm />
        </Paper>
      </Stack>
    </Container>
  );
}

export default TextToSpeechPage;
