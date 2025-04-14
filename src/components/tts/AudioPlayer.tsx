// src/components/tts/AudioPlayer.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Card, Group, Progress, Button, Text, Stack } from "@mantine/core";
import {
  IconDownload,
  IconPlayerPlay,
  IconPlayerPause,
} from "@tabler/icons-react";
import { useTranslation } from "@/services/i18n/client";

interface AudioPlayerProps {
  src: string;
  filename: string;
  voice: string;
  speed: string;
}

export function AudioPlayer({ src, filename, voice, speed }: AudioPlayerProps) {
  const { t } = useTranslation("tts");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const { currentTime, duration } = audio;
      setCurrentTime(currentTime);
      setProgress((currentTime / duration) * 100 || 0);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;

    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    const seekTime = (clickPosition / progressBarWidth) * duration;

    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleDownload = () => {
    const anchor = document.createElement("a");
    anchor.href = src;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Box>
          <Text size="sm" c="dimmed">
            {t("result.info", { voice, speed })}
          </Text>
        </Box>

        <audio ref={audioRef} src={src} preload="metadata" />

        <Box style={{ cursor: "pointer" }} onClick={handleProgressClick}>
          <Progress
            value={progress}
            size="md"
            radius="xl"
            aria-label="Audio progress"
          />
        </Box>

        <Group justify="apart">
          <Text size="sm">{formatTime(currentTime)}</Text>
          <Text size="sm">{formatTime(duration)}</Text>
        </Group>

        <Group justify="apart">
          <Button
            onClick={togglePlayback}
            variant="light"
            leftSection={
              isPlaying ? (
                <IconPlayerPause size={16} />
              ) : (
                <IconPlayerPlay size={16} />
              )
            }
            size="sm"
          >
            {isPlaying ? t("actions.pause") : t("actions.play")}
          </Button>

          <Button
            onClick={handleDownload}
            variant="outline"
            leftSection={<IconDownload size={16} />}
            size="sm"
          >
            {t("actions.download")}
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
