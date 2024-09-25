import { useEffect, useState } from "react";
import { EmoteType, EmoteSet } from "../../../types/Emotes";
import Emote from "./Emote";
import { createPortal } from "react-dom";
import { MessageType, sendChromeMsg } from "../../../structures/Messaging";

type EmoteManagerProps = {
  emoteSet: EmoteSet;
  commits: (HTMLAnchorElement | HTMLAreaElement)[];
};

type EmoteState = {
  container: Element;
} & EmoteType;

export default function EmotesManager(props: EmoteManagerProps) {
  const [ids, setIds] = useState<string[]>([]);
  const [emotes, setEmotes] = useState<EmoteState[]>([]);
  const [blobs, setBlobs] = useState<{ blob: string; id: string }[]>([]);

  useEffect(() => {
    const fetchEmotes = async () => {
      for (const id of ids) {
        sendChromeMsg({ type: MessageType.FETCH_EMOTE, data: { emoteId: id } }, (res) => {
          const parsed = res as { data: string; mimeType: string };
          fetch(parsed.data)
            .then((response) => response.blob())
            .then((blob) => {
              setBlobs((prev) => [...prev, { blob: URL.createObjectURL(blob), id: id }]);
            });
        });
      }
    };
    fetchEmotes();
  }, [ids]);

  useEffect(() => {
    for (const commit of props.commits) {
      if (commit.getAttribute("sevengit") === "loading") {
        commit.setAttribute("sevengit", "loaded");
        const text = commit.textContent;
        if (!text) {
          return;
        }
        const words = text.split(" ");
        const innerElements: string[] = [];
        for (const word of words) {
          let emoteId = "";
          if (
            props.emoteSet.some((emote) => {
              emoteId = emote.emoteId;
              return emote.name === word;
            })
          ) {
            setIds((prev) => {
              if (prev.some((id) => id === emoteId)) {
                return prev;
              }
              return [...prev, emoteId];
            });
            innerElements.push(
              `&nbsp;<span id="sevengit-emote" emoteId="${emoteId}" emoteName="${word}"></span>&nbsp;`
            );
          } else {
            innerElements.push(word);
          }
        }
        const innerHTML = innerElements.join("&nbsp;");
        commit.innerHTML = `<span id="sevengit-commit">${innerHTML}</span>`;
        const emoteContainers = commit.querySelectorAll(`span[id="sevengit-emote"]`);
        for (const emoteContainer of emoteContainers) {
          setEmotes((prev) => [
            ...prev,
            {
              container: emoteContainer,
              emoteId: emoteContainer.getAttribute("emoteId")!,
              name: emoteContainer.getAttribute("emoteName")!,
            },
          ]);
        }
      }
    }
  }, [props.emoteSet, props.commits]);

  return (
    <>
      {emotes.map((emote) => {
        const blobObj = blobs.find((obj) => obj.id === emote.emoteId);
        if (blobObj) {
          return createPortal(<Emote blob={blobObj.blob} name={emote.name} />, emote.container);
        }
      })}
    </>
  );
}
