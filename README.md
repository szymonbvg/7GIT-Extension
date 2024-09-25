<p align="center">
  <img src="public/logo.svg" height="128" />
  <h1 align="center">7GIT Extension</h1>
</p>

Browser extension that brings your favourite [7TV](https://7tv.app) emotes to GitHub commits

## Building

By default, the extension builds as Manifest v3 (Chromium browsers).
If you want to build it for Firefox or any other browser that uses Manifest v2, you need to use: `build:firefox` or set the environment variable `MV2` to `true` and use `build`

Building the extension **locally** (`build:local`) means that you also need to run backend and website **locally**.

## How it works

### 7tv.app

The extension adds a special button on the emote page that allows you to manage this emote (add/remove/update) in your 7GIT Emote Set, but you need to be logged in via GitHub for this to be possible

### github.com

The extension searches for emote names from your 7GIT Emote Set in commits on the repository page, then replaces the names with fetched emotes from 7TV's CDN.