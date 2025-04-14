// src/components/tts/TtsForm.tsx
"use client";
import { useState, useRef } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Select,
  Stack,
  Textarea,
  Center,
  Text,
} from "@mantine/core";
import { SpeedEnum } from "@/services/api/types/tts-types";
import { useTranslation } from "@/services/i18n/client";
import {
  GenerateTtsRequest,
  GenerateTtsResponse,
  useGenerateTtsService,
  useGetVoicesService,
} from "@/services/api/services/tts";
import { useEffect } from "react";
import { useSnackbar } from "@/components/mantine/feedback/notification-service";
import useGlobalLoading from "@/services/loading/use-global-loading";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { AudioPlayer } from "./AudioPlayer";
import { TtsLoadingAnimation } from "../loading/TtsLoadingAnimation";

// Updated interface with optional properties
interface TtsFormData {
  text: string;
  speaker?: string;
  speed: SpeedEnum;
}

export function TtsForm() {
  const { t } = useTranslation("tts");
  const { enqueueSnackbar } = useSnackbar();
  const { setLoading } = useGlobalLoading();
  const generateTtsService = useGenerateTtsService();
  const getVoicesService = useGetVoicesService();
  const [voiceOptions, setVoiceOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [defaultVoice, setDefaultVoice] = useState<string>("");
  const [generatedSpeech, setGeneratedSpeech] =
    useState<GenerateTtsResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const validationSchema = yup.object({
    text: yup.string().required(t("inputs.text.validation.required")),
    speaker: yup.string().optional(),
    speed: yup
      .string()
      .required()
      .oneOf([SpeedEnum.SLOW, SpeedEnum.NORMAL, SpeedEnum.FAST]),
  });

  const { control, handleSubmit, reset } = useForm<TtsFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      text: "",
      speaker: undefined,
      speed: SpeedEnum.NORMAL,
    },
  });

  useEffect(() => {
    const fetchVoices = async () => {
      setLoading(true);
      try {
        const response = await getVoicesService();
        if (response.status === HTTP_CODES_ENUM.OK) {
          const { availableSpeakers, defaultSpeaker } = response.data;
          const options = Object.entries(availableSpeakers).map(
            ([key, value]) => ({
              value: key,
              label: `${key} (${value})`,
            })
          );
          setVoiceOptions(options);
          setDefaultVoice(defaultSpeaker);
          reset({
            text: "",
            speaker: defaultSpeaker,
            speed: SpeedEnum.NORMAL,
          });
        }
      } catch (error) {
        console.error("Error fetching voices:", error);
        enqueueSnackbar(t("result.error"), { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchVoices();
  }, [getVoicesService, setLoading, t, enqueueSnackbar, reset]);

  // Effect for tracking elapsed time during generation
  useEffect(() => {
    if (isGenerating) {
      // Start timer to track elapsed time
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      // Clean up interval when component unmounts or generation finishes
      if (timerRef.current) clearInterval(timerRef.current);
      // Reset states when cleaned up
      if (!isGenerating) {
        setElapsedTime(0);
      }
    };
  }, [isGenerating]);

  const onSubmit: SubmitHandler<TtsFormData> = async (formData) => {
    // Only set local generating state - don't use global loading
    setIsGenerating(true);
    enqueueSnackbar(t("alerts.loading"), { variant: "info" });
    try {
      const request: GenerateTtsRequest = {
        text: formData.text,
        speaker: formData.speaker || defaultVoice,
        speed: formData.speed,
      };
      const response = await generateTtsService(request);
      if (
        response.status === HTTP_CODES_ENUM.CREATED ||
        response.status === HTTP_CODES_ENUM.OK
      ) {
        setGeneratedSpeech(response.data);
        enqueueSnackbar(t("alerts.success"), { variant: "success" });
      } else {
        enqueueSnackbar(t("alerts.error"), { variant: "error" });
      }
    } catch (error) {
      console.error("Error generating speech:", error);
      enqueueSnackbar(t("alerts.error"), { variant: "error" });
    } finally {
      setIsGenerating(false);
      // Reset the timer
      setElapsedTime(0);
    }
  };

  const handleNewGeneration = () => {
    setGeneratedSpeech(null);
  };

  const handleCancelGeneration = () => {
    setIsGenerating(false);
    enqueueSnackbar(t("alerts.cancelled"), { variant: "info" });
  };

  return (
    <Box>
      {isGenerating ? (
        // Show TtsLoadingAnimation while generating - using the custom component directly
        <Center style={{ minHeight: 300 }}>
          <Stack align="center" gap="lg">
            <TtsLoadingAnimation />
            {/* Elapsed time indicator */}
            <Text size="sm" color="dimmed" ta="center">
              {t("loading.timeElapsed", { seconds: elapsedTime })}
            </Text>
            {/* Cancel button */}
            <Button
              variant="outline"
              color="red"
              onClick={handleCancelGeneration}
              mt="sm"
            >
              {t("actions.cancel", "Cancel")}
            </Button>
          </Stack>
        </Center>
      ) : generatedSpeech ? (
        <Stack gap="md">
          <AudioPlayer
            src={generatedSpeech.url}
            filename={generatedSpeech.filename}
            voice={generatedSpeech.speaker}
            speed={generatedSpeech.speed}
          />
          <Button onClick={handleNewGeneration} mt="md">
            {t("actions.newGeneration")}
          </Button>
        </Stack>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="md">
            <Controller
              name="text"
              control={control}
              render={({ field, fieldState }) => (
                <Textarea
                  {...field}
                  label={t("inputs.text.label")}
                  placeholder={t("inputs.text.placeholder")}
                  error={fieldState.error?.message}
                  minRows={5}
                  autosize
                  data-testid="tts-text-input"
                />
              )}
            />
            <Controller
              name="speaker"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label={t("inputs.voice.label")}
                  placeholder={t("inputs.voice.defaultOption")}
                  data={voiceOptions}
                  searchable
                  data-testid="tts-voice-select"
                />
              )}
            />
            <Button type="submit" data-testid="tts-generate-button">
              {t("actions.generate")}
            </Button>
          </Stack>
        </form>
      )}
    </Box>
  );
}
