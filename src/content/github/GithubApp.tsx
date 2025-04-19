import { useEffect, useState } from "react";
import { EmoteSet } from "../../types/Emotes";
import EmotesManager from "./components/EmotesManager";
import { excludedPaths } from "../../structures/Common";
import { MessageType, sendChromeMsg } from "../../structures/Messaging";

export default function GithubApp() {
  const [emotes, setEmotes] = useState<EmoteSet | null>(null);
  const [commits, setCommits] = useState<(HTMLAnchorElement | HTMLAreaElement)[]>([]);
  const [user, setUser] = useState<string>();

  useEffect(() => {
    if (user) {
      sendChromeMsg({ type: MessageType.GET_EMOTE_SET, data: { username: user } }, (res) => {
        setEmotes(res as EmoteSet | null);
      });
    }
  }, [user]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const params = window.location.pathname.split("/").filter((i) => i !== "");
      const isExcludedPath = excludedPaths.indexOf(params[0]) !== -1;
      if (!isExcludedPath) {
        setUser((prev) => {
          if (prev !== params[0]) {
            return params[0];
          }
          return prev;
        });
      }

      if (params.length >= 2 && params[2] !== "commit" && !isExcludedPath) {
        for (const link of document.links) {
          if (link.href.includes(`/${params[0]}/${params[1]}/commit/`) && !link.getAttribute("sevengit")) {
            link.setAttribute("sevengit", "loading");
            link.style.display = "inline-block";
            setCommits((prev) => [...prev, link]);
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
    };
  }, []);

  return <>{emotes && <EmotesManager emoteSet={emotes} commits={commits} />}</>;
}
