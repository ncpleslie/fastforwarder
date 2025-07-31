import { Slider } from "@src/components/Slider";
import { Button } from "@src/components/Button";
import { useSpeedControl } from "./useSpeedControl";
import type { KeyboardEvent } from "react";

export default function Popup() {
  const {
    value,
    handleSliderChange,
    startDecreasing,
    startIncreasing,
    stopAdjusting,
    min,
    max,
    step,
  } = useSpeedControl();

  const handleButtonKey = (action: () => void) => (e: KeyboardEvent) => {
    if ((e.key === " " || e.key === "Enter") && e.repeat === false) {
      e.preventDefault();
      action();
    }
  };

  return (
    <main className="flex h-full w-full flex-col justify-center gap-4 px-4 pt-4 pb-4">
      <label htmlFor="slider" className="sr-only">
        Speed: <span>{value}</span>
      </label>
      <div className="flex items-center gap-4">
        <Button
          aria-label="Decrease speed"
          tabIndex={0}
          onMouseDown={startDecreasing}
          onMouseUp={stopAdjusting}
          onMouseLeave={stopAdjusting}
          onKeyDown={handleButtonKey(startDecreasing)}
          onKeyUp={stopAdjusting}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
            focusable="false"
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
          min={min}
          max={max}
          defaultValue={[value]}
          step={step}
          value={[value]}
          onValueChange={handleSliderChange}
          aria-label="Playback speed"
        />
        <Button
          aria-label="Increase speed"
          tabIndex={0}
          onMouseDown={startIncreasing}
          onMouseUp={stopAdjusting}
          onMouseLeave={stopAdjusting}
          onKeyDown={handleButtonKey(startIncreasing)}
          onKeyUp={stopAdjusting}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
            focusable="false"
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
