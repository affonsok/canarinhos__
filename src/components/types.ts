export type MaterialType = "audio" | "lyric" | "score";

export interface Material {
  id: string;
  title: string;
  type: MaterialType;
  voicePart?: string | null;
  fileName?: string | null;
  driveId?: string | null;
  localPath?: string | null;
  uploadedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  eventDate?: string | null;
  location?: string | null;
  createdAt: string;
}

export interface PracticeStats {
  totalSessions: number;
  weekSessions: number;
  lastPracticeAt?: string | null;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
}