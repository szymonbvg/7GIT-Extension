import { useEffect, useState } from "react";
import { excludedPaths } from "../structures/Common";
import "./Popup.css";
import Emote from "./compontents/Emote";
import { MessageType, sendChromeMsg } from "../structures/Messaging";
import { LocalEmoteSet } from "../types/Emotes";

export default function Popup() {
  const [isOnProfile, setIsOnProfile] = useState(false);
  const [data, setData] = useState<LocalEmoteSet>({ emotes: null });

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const url = tab.url;

      if (!url) {
        return;
      }
      const match = url.match(/https?:\/\/github\.com/);
      if (!match) {
        return;
      }
      const pathname = url.replace(match[0], "");
      const params = pathname.split("/").filter((i) => i !== "");
      if (params.length > 0 && excludedPaths.indexOf(params[0]) === -1) {
        setIsOnProfile(true);
        if (tab.id) {
          sendChromeMsg({ type: MessageType.GET_EMOTE_SET, data: { local: true } }, (res) => {
            setData(res as LocalEmoteSet);
          });
        }
      }
    });
  }, []);

  return (
    <>
      {isOnProfile ? (
        data.emotes ? (
          data.emotes.length > 0 ? (
            <div className="emote-set-container">
              <h3>{data.username}'s emotes:</h3>
              <div className="emote-set">
                {data.emotes.map((emote) => {
                  return <Emote id={emote.emoteId} name={emote.name} />;
                })}
              </div>
            </div>
          ) : (
            <h3 id="info">{data.username} has not added any emotes yet</h3>
          )
        ) : (
          <h3 id="info">{data.username} does not use 7GIT</h3>
        )
      ) : (
        <h3 id="info">You're not currently on someone's GitHub</h3>
      )}
    </>
  );
}
