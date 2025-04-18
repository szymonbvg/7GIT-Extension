import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SevenTVApp from "./7tv/SevenTVApp";
import GithubApp from "./github/GithubApp";

const style = document.createElement("link");
style.rel = "stylesheet";
style.type = "text/css";
style.href = chrome.runtime.getURL("assets/content.css");
document.head.appendChild(style);

const hostname = window.location.hostname;

const index = document.createElement("div");
const shadowRoot = index.attachShadow({ mode: "open" });

let websiteURL = "localhost";
if (!import.meta.env.VITE_LOCAL) {
  const url = new URL(import.meta.env.VITE_7GIT_WEBSITE_URL);
  websiteURL = url.hostname;
}

if (hostname !== websiteURL) {
  createRoot(shadowRoot).render(
    <StrictMode>
      {(() => {
        switch (hostname) {
          case "github.com": {
            return <GithubApp />;
          }
          case "old.7tv.app": {
            return <SevenTVApp />;
          }
        }
      })()}
    </StrictMode>
  );
} else {
  const token = localStorage.getItem("7git-token");
  chrome.storage.local.set({ "7git-token": token });
}
