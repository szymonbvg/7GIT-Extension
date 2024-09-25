import { Manifest } from "webextension-polyfill";
import { version } from "./package.json";
import "dotenv/config";

export async function getManifest() {
  const local = process.env.VITE_LOCAL;
  const backendURL = process.env.VITE_7GIT_BACKEND_URL;
  const websiteURL = process.env.VITE_7GIT_WEBSITE_URL;

  const manifest = {
    manifest_version: 3,
    name: "7GIT",
    description: "Brings 7TV Emotes to GitHub Commits",
    version: version,
    action: {
      default_popup: "index.html",
      default_title: "7GIT",
    },
    permissions: ["storage", "tabs"],
    host_permissions: ["*://github.com/*", "*://cdn.7tv.app/*", local ? "*://localhost/*" : backendURL],
    content_scripts: [
      {
        matches: ["*://github.com/*", "*://7tv.app/*", local ? "*://localhost/*" : websiteURL],
        js: ["./content.js"],
      },
    ],
    background: {
      service_worker: "./background.js",
    },
    web_accessible_resources: [
      {
        resources: ["assets/*"],
        matches: ["*://github.com/*", "*://7tv.app/*"],
      },
    ],
    icons: {
      16: "./icon/icon-16.png",
      48: "./icon/icon-48.png",
      128: "./icon/icon-128.png",
    },
  } as Manifest.WebExtensionManifest;

  if (process.env.MV2) {
    manifest.manifest_version = 2;
    manifest.browser_action = manifest.action;
    manifest.permissions = [...(manifest.permissions ?? []), ...(manifest.host_permissions ?? [])];
    manifest.background = {
      scripts: ["background.js"],
    };
    manifest.web_accessible_resources = (
      manifest.web_accessible_resources as Manifest.WebExtensionManifestWebAccessibleResourcesC2ItemType[]
    )
      .map((i) => i.resources)
      .reduce((a, b) => [...(a ?? []), ...(b ?? [])]);

    delete manifest.action;
    delete manifest.host_permissions;
  }

  return manifest;
}
