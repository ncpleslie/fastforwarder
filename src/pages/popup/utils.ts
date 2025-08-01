import { tabs, storage } from "webextension-polyfill";
import { DEFAULT_SPEED, STORAGE_KEY } from "./constants";
import { logger } from "@src/utils/logger";
import { Message } from "@src/types/message";

function isValidUrl(url: string | undefined): boolean {
  return !!url && /^https?:\/\//.test(url);
}

/**
 * Determines if a message can be sent to the given tab.
 * Returns false for settings, extension, or other invalid pages.
 * @param tab - The browser tab object.
 */
export async function canSendMessageToTab(): Promise<boolean> {
  const browserTabs = await tabs.query({
    currentWindow: true,
    active: true,
  });

  return browserTabs.every((t) => {
    return isValidUrl(t.url);
  });
}

/**
 * Sends a message to the active tab to update the speed.
 * @param num - The speed to update to.
 */
export async function updateSpeed(num: number): Promise<void> {
  try {
    const browserTabs = await tabs.query({
      currentWindow: true,
      active: true,
    });

    await Promise.all(
      Array.from(browserTabs, (tab) => {
        if (!tab.id || !isValidUrl(tab.url)) {
          logger.warn("Cannot send message to invalid tab:", tab.url);
          return;
        }

        tabs.sendMessage(tab.id, {
          speed: num,
        } satisfies Message);
      }),
    );

    await storage.local.set({ [STORAGE_KEY]: num });
  } catch (error) {
    logger.error("Error updating speed:", error);
  }
}

/**
 * Retrieves the playback speed from storage.
 * @returns The stored speed or default speed if not found.
 */
export async function getSpeedFromStorage(): Promise<number> {
  try {
    const storedSpeed = await storage.local.get();
    const speed = storedSpeed[STORAGE_KEY];
    if (typeof speed === "number") {
      return speed;
    }
  } catch (error) {
    logger.error("Error retrieving speed from storage:", error);
  }

  return DEFAULT_SPEED;
}
