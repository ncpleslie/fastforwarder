<div align="center">
<img src="public/icon128.png" alt="FastForwarder logo"/>
<h1>FastForwarder</h1>

<h5>FastForwarder is a lightweight browser extension for Chrome and Firefox that lets you speed up HTML5 video playback on any website. Whether you're binge-watching, studying, or just trying to save time, FastForwarder gives you instant control over video speed.</h5>

</div>

## ⚙️ Features

- ⏩ Speed up or slow down videos on any site
- 🎯 Works with all HTML5 video players
- 🎹 Keyboard shortcuts for quick control
- 🔁 Auto-apply preferred speed to all videos
- 🧠 Minimalist UI, easy to use

## 🖥️ Usage

Once installed:

- Use the popup to set your default speed
- Press buttons (`+` / `-`) or drag the slider
- FastForwarder will auto-apply the speed on all new videos

## Getting Started

### Developing and building

This extension comes with build configs for both Chrome and Firefox. Running
`dev` or `build` commands without specifying the browser target will build
for Chrome by default.

3. Run `npm i` (check your node version >= 18)
4. Run `yarn dev[:chrome|:firefox]`, or `npm run dev[:chrome|:firefox]`

Running a `dev` command will build your extension and watch for changes in the
source files. Changing the source files will refresh the corresponding
`dist_<chrome|firefox>` folder.

To create an optimized production build, run `yarn build[:chrome|:firefox]`, or
`npm run build[:chrome|:firefox]`.

#### Load your extension

For Chrome

1. Open - Chrome browser
2. Access - [chrome://extensions](chrome://extensions)
3. Tick - Developer mode
4. Find - Load unpacked extension
5. Select - `dist_chrome` folder in this project (after dev or build)

For Firefox

1. Open - Firefox browser
2. Access - [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox)
3. Click - Load temporary Add-on
4. Select - any file in `dist_firefox` folder (i.e. `manifest.json`) in this project (after dev or build)

## 💡 Why FastForwarder?

Other extensions are either bloated or limited. FastForwarder is designed to be fast, simple, and effective — nothing more, nothing less.
