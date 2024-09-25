export type EmoteType = {
  name: string;
  emoteId: string;
};

export type EmoteSet = EmoteType[];

export type LocalEmoteSet = {
  username?: string;
  emotes: EmoteSet | null;
};
