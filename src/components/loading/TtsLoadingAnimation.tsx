// src/components/loading/TtsLoadingAnimation.tsx
"use client";
import { Box, Text, Stack, Center } from "@mantine/core";
import dynamic from "next/dynamic";
import { useTranslation } from "@/services/i18n/client";
import { useState, useEffect } from "react";

// Import Lottie dynamically with SSR disabled
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

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
  const [animationData, setAnimationData] = useState<any>(null);

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

  // Load animation data dynamically on client
  useEffect(() => {
    // Use a dynamic import that doesn't rely on the file system path
    import("@/../../public/animations/tts-loading.json")
      .then((data) => {
        setAnimationData(data.default);
      })
      .catch((err) => {
        console.error("Failed to load animation:", err);
      });
  }, []);

  return (
    <Center>
      <Stack align="center" gap="md">
        <Box style={{ width, height }}>
          {animationData && (
            <Lottie animationData={animationData} loop={true} />
          )}
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
