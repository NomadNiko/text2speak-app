// src/services/api/services/tts.ts
import { createPostService, createGetService } from "../factory";
import { SpeedEnum } from "../types/tts-types";

// Type definitions
export type GenerateTtsRequest = {
  text: string;
  speaker?: string;
  speed?: SpeedEnum;
};

export type GenerateTtsResponse = {
  success: boolean;
  url: string;
  filename: string;
  speaker: string;
  speed: string;
};

export type GetVoicesResponse = {
  defaultSpeaker: string;
  availableSpeakers: Record<string, string>;
};

export type GetTtsStatusResponse = {
  status: string;
  environment: {
    path: string;
    status: string;
  };
  tts: {
    command: string;
    status: string;
  };
  s3: {
    bucket: string;
    status: string;
  };
};

// API Services using the factory pattern
export const useGenerateTtsService = createPostService<
  GenerateTtsRequest,
  GenerateTtsResponse
>("/v1/tts/generate", {
  requiresAuth: false, // Set to false to bypass auth check
});

export const useGetVoicesService = createGetService<GetVoicesResponse>(
  "/v1/tts/voices",
  {
    requiresAuth: false, // Set to false to bypass auth check
  }
);

export const useGetTtsStatusService = createGetService<GetTtsStatusResponse>(
  "/v1/tts/status",
  {
    requiresAuth: false, // Set to false to bypass auth check
  }
);
