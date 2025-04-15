// src/services/api/services/tts-history.ts
import { createGetService } from "../factory";
import { TtsHistoryItem } from "../types/tts-history";

// Type definitions
export type GetTtsHistoryResponse = TtsHistoryItem[];

// API Services
export const useGetTtsHistoryService = createGetService<GetTtsHistoryResponse>(
  "/v1/tts-history",
  {
    requiresAuth: true, // Only authenticated users can get their history
  }
);
