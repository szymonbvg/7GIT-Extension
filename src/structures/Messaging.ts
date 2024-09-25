export enum MessageType {
  GET_EMOTE_SET = "get-emote-set",
  FETCH_EMOTE = "fetch-emote",
  REQUEST = "request",
}

export type MessageData = {
  local?: boolean;
  username?: string;
  emoteId?: string;
  method?: "POST" | "GET";
  path?: string;
  token?: string;
  body?: string;
};

export type Message = {
  type: MessageType;
  data?: MessageData;
};

export type MessageResponse = {
  status: boolean;
  data?: unknown;
};

type SendMessageFunc = (msg: Message, callback: (res: unknown) => void) => void;
export const sendChromeMsg: SendMessageFunc = chrome.runtime.sendMessage;
