import { useEffect, useState } from "react";
import { canSendMessageToTab } from "./utils";

/**
 * Determines if controls can be used in the current browser tab.
 *
 * @returns Whether controls are available for the current tab.
 *
 * @example
 * const canUse = useTabControlsAvailable();
 * if (canUse) {
 *   // Show controls
 * }
 */
export function useTabControlsAvailable(): boolean {
  const [available, setAvailable] = useState<boolean>(false);

  useEffect(() => {
    const check = async () => {
      const result = await canSendMessageToTab();
      setAvailable(result);
    };
    check();
  }, []);

  return available;
}
