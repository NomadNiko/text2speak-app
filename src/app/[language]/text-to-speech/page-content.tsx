// src/app/[language]/text-to-speech/page-content.tsx
"use client";
import { Container, Title, Text, Stack, Paper, Divider } from "@mantine/core";
import { useTranslation } from "@/services/i18n/client";
import { TtsForm } from "@/components/tts/TtsForm";
import { TtsHistoryList } from "@/components/tts/TtsHistoryList";
import { useEffect, useState } from "react";
import useGlobalLoading from "@/services/loading/use-global-loading";
import useAuth from "@/services/auth/use-auth";

function TextToSpeechPage() {
  const { t } = useTranslation("tts");
  const { setLoading } = useGlobalLoading();
  const { user, isLoaded } = useAuth();
  const [historyRefreshCount, setHistoryRefreshCount] = useState(0);

  // Ensure loading indicator is off when page mounts
  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  const refreshHistory = () => {
    setHistoryRefreshCount((prev) => prev + 1);
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Title order={2}>{t("title")}</Title>
        <Text>{t("description")}</Text>
        <Paper shadow="sm" radius="md" p="lg" withBorder>
          <TtsForm onGenerationSuccess={refreshHistory} />
        </Paper>
        {isLoaded && user && (
          <>
            <Divider my="md" />
            <TtsHistoryList refreshTrigger={historyRefreshCount} />
          </>
        )}
      </Stack>
    </Container>
  );
}

export default TextToSpeechPage;
