export type ChainItemType = "text" | "drawing";

export type ChainItem = {
  id: string;
  type: ChainItemType;
  content: string; // text sentence description OR canvas PNG base64 data URL
  createdAt: number;
  authorName?: string;
};

export type GameStatus = "prompt-setup" | "playing" | "summary";

export type GameState = {
  id: string;
  status: GameStatus;
  chain: ChainItem[];
  updatedAt: number;
  sessionDate: string;
};

export type ArchiveRecord = {
  id: string;
  date: string; // YYYY-MM-DD
  archivedAt: number;
  chain: ChainItem[];
  itemCount: number;
  firstText: string;
};
