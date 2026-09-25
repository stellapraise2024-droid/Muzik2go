export type Visibility = "private" | "shared" | "public";
export type ProjectStatus = "idea" | "demo" | "finished";
export type Section = "verse" | "chorus" | "bridge";
export type TakeProcessing = "raw" | "polished" | "mastered";

export interface SongProject {
  id: string;
  ownerId: string;
  title: string;
  status: ProjectStatus;
  visibility: Visibility;
  lyricsText: string;
  structure: { section: Section; order: number }[];
  instrumentalUrl: string | null;
  createdAt: string;
}

export interface Take {
  id: string;
  recordingId: string;
  projectId: string;
  parentTakeId: string | null;
  audioKey: string;
  durationSec: number;
  processing: TakeProcessing;
  isFavorite: boolean;
  isSelected: boolean;
}
