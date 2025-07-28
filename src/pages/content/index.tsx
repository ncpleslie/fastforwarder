import { Message } from "@src/types/message";
import { runtime, storage } from "webextension-polyfill";
import { STORAGE_KEY } from "../popup/constants";

async function init() {
  try {
    const storedSpeed = await storage.local.get();
    const speed = storedSpeed[STORAGE_KEY];
    if (speed && typeof speed === "number") {
      updateAllVideoFrameSpeeds(speed);
    }
  } catch (e) {
    console.error(e);
  }
}

async function startListening() {
  try {
    runtime.onMessage.addListener((request: any) => {
      if ("speed" in request) {
        const message: Message = request;
        updateAllVideoFrameSpeeds(message.speed);
      }
    });
  } catch (e) {
    console.error(e);
  }
}

const updateAllVideoFrameSpeeds = (speed: number) => {
  const allVideoFrames = document.querySelectorAll("video");
  allVideoFrames.forEach((video) => (video.playbackRate = speed));
};

init().then(() => startListening());
