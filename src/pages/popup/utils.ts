import { tabs, storage } from "webextension-polyfill";
import { STORAGE_KEY } from "./constants";
import { Message } from "@src/types/message";

/**
 * Sends a message to the active tab to update the speed.
 * @param num - The speed to update to.
 */
export async function updateSpeed(num: number) {
  const browserTabs = await tabs.query({
    currentWindow: true,
    active: true,
  });

  await Promise.all(
    Array.from(browserTabs, (tab) => {
      if (!tab.id) {
        return;
      }
      tabs.sendMessage(tab.id, {
        speed: num,
      } satisfies Message);
    })
  );

  storage.local.set({ [STORAGE_KEY]: num });
}
