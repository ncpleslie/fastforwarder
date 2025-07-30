import { KeyboardEvent, useEffect, useRef, useState } from "react";
import {
  DEFAULT_SPEED,
  MAX_SPEED,
  MIN_SPEED,
  SPEED_STEP,
  STORAGE_KEY,
  UPDATE_INTERVAL_MS,
} from "./constants";
import { updateSpeed } from "./utils";
import { Slider } from "@src/components/Slider";
import { Button } from "@src/components/Button";
import { storage } from "webextension-polyfill";

export default function Popup() {
  const [value, setValue] = useState(DEFAULT_SPEED);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSliderChange = (value: number[]) => {
    const num = value[0];
    setValue(num);
    updateSpeed(num);
  };

  const handleKeyDownDecrease = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      startDecreasing();
    }
  };

  const handleKeyDownIncrease = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      startIncreasing();
    }
  };

  const startDecreasing = () => {
    setValue((v) => Math.max(v - SPEED_STEP, MIN_SPEED));
    intervalRef.current = setInterval(() => {
      setValue((v) => Math.max(v - SPEED_STEP, MIN_SPEED));
    }, UPDATE_INTERVAL_MS);
  };

  const startIncreasing = () => {
    setValue((v) => Math.min(v + SPEED_STEP, MAX_SPEED));
    intervalRef.current = setInterval(() => {
      setValue((v) => Math.min(v + SPEED_STEP, MAX_SPEED));
    }, UPDATE_INTERVAL_MS);
  };

  const stopAdjustment = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    updateSpeed(value);
  }, [value]);

  useEffect(() => {
    (async () => {
      try {
        const storedSpeed = await storage.local.get();
        const speed = storedSpeed[STORAGE_KEY];
        if (speed && typeof speed === "number") {
          setValue(speed);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <main className="flex h-full w-full flex-col justify-center gap-4 px-4 pt-4 pb-4">
      <label htmlFor="slider" className="hidden text-white">
        Speed: <span>{value}</span>
      </label>
      <div className="flex items-center gap-4">
        <Button
          aria-label="Decrease Speed"
          onMouseDown={startDecreasing}
          onMouseUp={stopAdjustment}
          onKeyDown={handleKeyDownDecrease}
          onKeyUp={stopAdjustment}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <line
              x1="5"
              y1="12"
              x2="19"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Button>
        <Slider
          id="slider"
          min={MIN_SPEED}
          max={MAX_SPEED}
          defaultValue={[DEFAULT_SPEED]}
          step={SPEED_STEP}
          value={[value]}
          onValueChange={handleSliderChange}
          aria-label="Select a number from 0 to 10"
        />
        <Button
          aria-label="Increase speed"
          onMouseDown={startIncreasing}
          onMouseUp={stopAdjustment}
          onKeyDown={handleKeyDownIncrease}
          onKeyUp={stopAdjustment}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <line
              x1="12"
              y1="5"
              x2="12"
              y2="19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="5"
              y1="12"
              x2="19"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Button>
      </div>
    </main>
  );
}
