import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_SPEED,
  MAX_SPEED,
  MIN_SPEED,
  SPEED_STEP,
  UPDATE_INTERVAL_MS,
} from "./constants";
import { getSpeedFromStorage, updateSpeed } from "./utils";

/**
 * Manage playback speed value and adjustment logic for the popup UI.
 * Handles slider changes, button press-and-hold, and persistent storage.
 */
export function useSpeedControl() {
  const [value, setValue] = useState(DEFAULT_SPEED);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update speed in storage and call updateSpeed util when value changes
  useEffect(() => {
    updateSpeed(value);
  }, [value]);

  // Load initial value from storage on mount
  useEffect(() => {
    getSpeedFromStorage().then((storedSpeed) => {
      setValue(storedSpeed);
    });
  }, []);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  /**
   * Handler for slider value changes.
   * @param val - Array with the new slider value as the first element.
   */
  const handleSliderChange = useCallback((val: number[]) => {
    const num = val[0];
    setValue(num);
  }, []);

  /**
   * Adjust speed by a delta, clamped to min/max.
   * @param delta - Amount to change speed by.
   */
  const adjustSpeed = useCallback((delta: number) => {
    setValue((v) => {
      const next = v + delta;
      if (delta > 0) {
        return Math.min(next, MAX_SPEED);
      }

      return Math.max(next, MIN_SPEED);
    });
  }, []);

  /**
   * Start adjusting speed repeatedly by delta (for press-and-hold behavior).
   * Only starts if not already running.
   * @param delta - Amount to change speed by each interval.
   */
  const startAdjusting = useCallback(
    (delta: number) => {
      if (intervalRef.current) {
        return;
      }

      adjustSpeed(delta);
      intervalRef.current = setInterval(
        () => adjustSpeed(delta),
        UPDATE_INTERVAL_MS,
      );
    },
    [adjustSpeed],
  );

  /**
   * Stop any ongoing speed adjustment interval.
   */
  const stopAdjusting = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return {
    value,
    setValue,
    handleSliderChange,
    startDecreasing: () => startAdjusting(-SPEED_STEP),
    startIncreasing: () => startAdjusting(SPEED_STEP),
    stopAdjusting,
    min: MIN_SPEED,
    max: MAX_SPEED,
    step: SPEED_STEP,
  };
}
