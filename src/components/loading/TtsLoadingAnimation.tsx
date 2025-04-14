// src/components/loading/TtsLoadingAnimation.tsx
"use client";
import { Box, Text, Stack, Center } from "@mantine/core";
import Lottie from "lottie-react";
import { useTranslation } from "@/services/i18n/client";
import { useState, useEffect } from "react";

interface TtsLoadingAnimationProps {
  messages?: string[];
  height?: number;
  width?: number;
}

export function TtsLoadingAnimation({
  messages = [],
  height = 200,
  width = 200,
}: TtsLoadingAnimationProps) {
  const { t } = useTranslation("tts");
  const [messageIndex, setMessageIndex] = useState(0);

  // Default messages if none provided
  const defaultMessages = [
    t("loading.processing"),
    t("loading.generating"),
    t("loading.analyzing"),
    t("loading.almostDone"),
  ];

  const displayMessages = messages.length > 0 ? messages : defaultMessages;

  // Cycle through messages
  useEffect(() => {
    if (displayMessages.length <= 1) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % displayMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [displayMessages]);

  return (
    <Center>
      <Stack align="center" gap="md">
        <Box style={{ width, height }}>
          <Lottie
            animationData={require("/public/animations/tts-loading.json")}
            loop={true}
          />
        </Box>

        {displayMessages.length > 0 && (
          <Text size="lg" fw={500} ta="center">
            {displayMessages[messageIndex]}
          </Text>
        )}
      </Stack>
    </Center>
  );
}
