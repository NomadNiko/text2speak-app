// src/components/tts/TtsHistoryList.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
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

interface TtsHistoryListProps {
  refreshTrigger?: number;
}

export function TtsHistoryList({ refreshTrigger = 0 }: TtsHistoryListProps) {
  const { t } = useTranslation("tts");
  const [historyItems, setHistoryItems] = useState<TtsHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
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
    // Stop currently playing audio if any
    if (currentlyPlaying) {
      const audioElement = document.getElementById(
        `audio-${currentlyPlaying}`
      ) as HTMLAudioElement;
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    }

    const audioElement = document.getElementById(
      `audio-${id}`
    ) as HTMLAudioElement;

    if (audioElement) {
      if (currentlyPlaying === id) {
        // If the same audio is currently playing, pause it
        audioElement.pause();
        setCurrentlyPlaying(null);
      } else {
        // Otherwise play the selected audio
        audioElement.play();
        setCurrentlyPlaying(id);
        audioElement.onended = () => setCurrentlyPlaying(null);
      }
    }
  };

  const downloadAudio = (url: string, filename: string) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
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

              <Button
                size="xs"
                variant="light"
                leftSection={<IconDownload size={16} />}
                onClick={() => downloadAudio(item.url, item.filename)}
              >
                {t("actions.download")}
              </Button>

              <Text size="xs" c="dimmed">
                <IconCalendar
                  size={14}
                  style={{ display: "inline", verticalAlign: "middle" }}
                />{" "}
                {formatDate(item.createdAt)}
              </Text>
            </Group>

            {/* Create hidden audio elements for each history item */}
            <audio id={`audio-${item.id}`} src={item.url} preload="none" />
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
