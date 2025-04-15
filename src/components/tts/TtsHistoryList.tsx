// src/components/tts/TtsHistoryList.tsx
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  Text,
  Stack,
  Group,
  Button,
  Loader,
  Center,
  Title,
  Badge,
  ActionIcon,
} from "@mantine/core";
import {
  IconPlayerPlay,
  IconCalendar,
  IconDownload,
  IconPlayerPause,
} from "@tabler/icons-react";
import { useTranslation } from "@/services/i18n/client";
import { useGetTtsHistoryService } from "@/services/api/services/tts-history";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { TtsHistoryItem } from "@/services/api/types/tts-history";
import { useSnackbar } from "@/components/mantine/feedback/notification-service";

interface TtsHistoryListProps {
  refreshTrigger?: number;
}

export function TtsHistoryList({ refreshTrigger = 0 }: TtsHistoryListProps) {
  const { t } = useTranslation("tts");
  const [historyItems, setHistoryItems] = useState<TtsHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const { enqueueSnackbar } = useSnackbar();
  const getTtsHistory = useGetTtsHistoryService();

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getTtsHistory();
      if (response.status === HTTP_CODES_ENUM.OK) {
        setHistoryItems(response.data);
      } else {
        setError(t("history.error"));
      }
    } catch (err) {
      console.error("Error fetching TTS history:", err);
      setError(t("history.error"));
    } finally {
      setLoading(false);
    }
  }, [getTtsHistory, t]);

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger, fetchHistory]);

  const playAudio = (url: string, id: string) => {
    try {
      // Stop currently playing audio if any
      if (currentlyPlaying) {
        const currentAudio = audioRefs.current[currentlyPlaying];
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
      }

      // Get or create audio element
      if (!audioRefs.current[id]) {
        const audioElement = new Audio(url);
        audioElement.onended = () => setCurrentlyPlaying(null);
        audioElement.onerror = () => {
          setCurrentlyPlaying(null);
          enqueueSnackbar(t("history.audioError"), { variant: "error" });
        };
        audioRefs.current[id] = audioElement;
      }

      // Play audio
      const audioElement = audioRefs.current[id];
      audioElement.play().catch((error) => {
        console.error("Error playing audio:", error);
        enqueueSnackbar(t("history.audioError"), { variant: "error" });
        setCurrentlyPlaying(null);
      });

      setCurrentlyPlaying(id);
    } catch (error) {
      console.error("Error handling audio playback:", error);
      enqueueSnackbar(t("history.audioError"), { variant: "error" });
    }
  };

  const downloadAudio = (url: string, filename: string) => {
    try {
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } catch (error) {
      console.error("Error downloading audio:", error);
      enqueueSnackbar(t("history.downloadError"), { variant: "error" });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Unknown date";
      }
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Unknown date";
    }
  };

  if (loading) {
    return (
      <Center p="xl">
        <Loader size="md" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center p="xl">
        <Text color="red">{error}</Text>
      </Center>
    );
  }

  if (historyItems.length === 0) {
    return (
      <Card p="md" withBorder radius="md">
        <Text ta="center" c="dimmed" py="md">
          {t("history.empty")}
        </Text>
      </Card>
    );
  }

  return (
    <Stack gap="md">
      <Title order={4}>{t("history.title")}</Title>
      {historyItems.map((item) => (
        <Card key={item.id} withBorder radius="md" padding="md">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={500} lineClamp={1}>
                {item.text}
              </Text>
              <Badge size="sm">
                {item.speaker} / {item.speed}
              </Badge>
            </Group>
            <Group>
              <Button
                size="xs"
                variant={currentlyPlaying === item.id ? "filled" : "light"}
                leftSection={
                  currentlyPlaying === item.id ? (
                    <IconPlayerPause size={16} />
                  ) : (
                    <IconPlayerPlay size={16} />
                  )
                }
                onClick={() => playAudio(item.url, item.id)}
              >
                {currentlyPlaying === item.id
                  ? t("actions.playing")
                  : t("actions.play")}
              </Button>

              <ActionIcon
                variant="light"
                onClick={() => downloadAudio(item.url, item.filename)}
                title={t("actions.download")}
              >
                <IconDownload size={16} />
              </ActionIcon>

              <Text size="xs" c="dimmed">
                <IconCalendar
                  size={14}
                  style={{ display: "inline", verticalAlign: "middle" }}
                />{" "}
                {formatDate(item.createdAt)}
              </Text>
            </Group>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
