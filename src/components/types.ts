export type MaterialType = "audio" | "lyric" | "score";

export interface MaterialGroup {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface Material {
  id: string;
  title: string;
  type: MaterialType;
  voicePart?: string | null;
  fileName?: string | null;
  driveId?: string | null;
  localPath?: string | null;
  uploadedAt: string;
  groupId?: string | null;
  group?: MaterialGroup | null;
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