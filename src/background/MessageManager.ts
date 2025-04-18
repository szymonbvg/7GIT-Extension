import { EmoteSet, LocalEmoteSet } from "../types/Emotes";
import { Message, MessageResponse, MessageType } from "../structures/Messaging";

export class MessageManager {
  private localEmoteSet?: LocalEmoteSet;

  constructor() {
    chrome.runtime.onMessage.addListener((msg: Message, _, reply) => {
      switch (msg.type) {
        case MessageType.GET_EMOTE_SET: {
          if (msg.data?.local) {
            reply(this.localEmoteSet);
            break;
          }

          if (msg.data?.username) {
            const username = msg.data.username;
            this.sendRequest("GET", `/v1/users/${username}/emotes`).then((res) => {
              const { emotes } = res.data as { emotes: EmoteSet | null };
              this.localEmoteSet = { username, emotes };
              reply(emotes);
            });
          }
          break;
        }
        case MessageType.FETCH_EMOTE: {
          if (msg.data?.emoteId) {
            this.getEmoteBlobURL(msg.data.emoteId).then((blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                reply({ data: reader.result, mimeType: blob.type });
              };
              reader.readAsDataURL(blob);
            });
          }
          break;
        }
        case MessageType.REQUEST: {
          if (msg.data?.method && msg.data.path) {
            this.sendRequest(msg.data.method, msg.data.path, msg.data.token, msg.data.body).then((res) => {
              reply(res);
            });
          }
          break;
        }
      }

      return true;
    });
  }

  private async getEmoteBlobURL(emoteId: string): Promise<Blob> {
    return fetch(`https://cdn.7tv.app/emote/${emoteId}/1x.webp`).then((res) => {
      return res.blob();
    });
  }

  private async sendRequest(
    method: string,
    path: string,
    token?: string,
    body?: string
  ): Promise<MessageResponse> {
    return fetch(`${import.meta.env.VITE_7GIT_BACKEND_URL}${path}`, {
      method: method,
      body: body,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { "X-Auth-Token": token } : {}),
      },
    })
      .then((res) => {
        if (!res.ok) {
          return null;
        }
        if (res.status === 204) {
          return Object();
        }
        return res.json();
      })
      .then((data) => {
        const msg = (data as { msg?: string })?.msg;
        return { status: !msg ? data !== null : false, data };
      });
  }
}
