import { Message } from "@src/types/message";
import { runtime, storage } from "webextension-polyfill";
import { STORAGE_KEY } from "../popup/constants";
import { logger } from "@src/utils/logger";

async function init() {
  try {
    const storedSpeed = await storage.local.get();
    const speed = storedSpeed[STORAGE_KEY];
    if (speed && typeof speed === "number") {
      updateAllVideoFrameSpeeds(speed);
    }
  } catch (error) {
    logger.error("Error initializing content script:", error);
  }
}

async function startListening() {
  try {
    runtime.onMessage.addListener((request: unknown) => {
      if (typeof request !== "object" || request === null) {
        return;
      }

      if ("speed" in request) {
        const message = request as Message;
        updateAllVideoFrameSpeeds(message.speed);
      }
    });
  } catch (error) {
    logger.error("Error starting message listener:", error);
  }
}

const updateAllVideoFrameSpeeds = (speed: number) => {
  const allVideoFrames = document.querySelectorAll("video");
  allVideoFrames.forEach((video) => (video.playbackRate = speed));
};

init().then(() => startListening());
