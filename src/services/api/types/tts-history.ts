// src/services/api/types/tts-history.ts
export interface TtsHistoryItem {
  id: string;
  text: string;
  url: string;
  filename: string;
  speaker: string;
  speed: string;
  userId?: string;
  createdAt: string;
}
