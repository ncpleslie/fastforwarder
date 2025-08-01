import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  fireEvent,
  screen,
  act,
  waitFor,
} from "@testing-library/react";
import Popup from "./Popup";
import * as utils from "./utils";
import * as constants from "./constants";
import { storage } from "webextension-polyfill";
import { useTabControlsAvailable } from "./useTabControlsAvailable";

vi.mock("webextension-polyfill", () => ({
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
  tabs: {
    sendMessage: vi.fn(),
    query: vi.fn(() => Promise.resolve([])),
  },
}));

vi.mock("./useTabControlsAvailable", () => ({
  useTabControlsAvailable: vi.fn(),
}));

const mockStorageGet = vi.mocked(storage.local.get);
const updateSpeedSpy = vi.spyOn(utils, "updateSpeed");
const mockUseTabControlsAvailable = vi.mocked(useTabControlsAvailable);

describe("Popup", () => {
  beforeEach(() => {
    mockStorageGet.mockResolvedValue({});
    mockUseTabControlsAvailable.mockReturnValue(true);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("renders slider and buttons", () => {
    render(<Popup />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /decrease speed/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /increase speed/i }),
    ).toBeInTheDocument();
  });

  it("calls updateSpeed on mount and when value changes", () => {
    render(<Popup />);
    expect(updateSpeedSpy).toHaveBeenCalledWith(constants.DEFAULT_SPEED);

    const slider = screen.getByRole("slider");
    fireEvent.change(slider, {
      target: {
        ["aria-valuenow"]: constants.DEFAULT_SPEED + constants.SPEED_STEP,
      },
    });

    waitFor(() => {
      expect(updateSpeedSpy).toHaveBeenCalledWith(
        constants.DEFAULT_SPEED + constants.SPEED_STEP,
      );
    });
  });

  it("loads speed from storage on mount", async () => {
    const expectedSpeed = 2.5;
    mockStorageGet.mockResolvedValue({
      [constants.STORAGE_KEY]: expectedSpeed,
    });
    render(<Popup />);

    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.getByRole("slider").ariaValueNow).toBe(`${expectedSpeed}`);
  });

  it("decreases speed on Decrease button mouse down", () => {
    render(<Popup />);
    const decreaseBtn = screen.getByRole("button", { name: /decrease speed/i });
    fireEvent.mouseDown(decreaseBtn);
    act(() => {
      vi.advanceTimersByTime(constants.UPDATE_INTERVAL_MS);
    });
    // Should not go below MIN_SPEED
    for (let i = 0; i < 20; i++) {
      act(() => {
        vi.advanceTimersByTime(constants.UPDATE_INTERVAL_MS);
      });
    }
    expect(Number(screen.getByRole("slider").ariaValueNow)).toBe(
      constants.MIN_SPEED,
    );
  });

  it("increases speed on Increase button mouse down", () => {
    render(<Popup />);
    const increaseBtn = screen.getByRole("button", { name: /increase speed/i });
    fireEvent.mouseDown(increaseBtn);
    act(() => {
      vi.advanceTimersByTime(constants.UPDATE_INTERVAL_MS);
    });
    // Should not go above MAX_SPEED
    for (let i = 0; i < 40; i++) {
      act(() => {
        vi.advanceTimersByTime(constants.UPDATE_INTERVAL_MS);
      });
    }
    expect(Number(screen.getByRole("slider").ariaValueNow)).toBe(
      constants.MAX_SPEED,
    );
  });

  it("stops adjustment on mouse up", () => {
    render(<Popup />);
    const increaseBtn = screen.getByRole("button", { name: /increase speed/i });
    fireEvent.mouseDown(increaseBtn);
    act(() => {
      vi.advanceTimersByTime(constants.UPDATE_INTERVAL_MS);
    });
    fireEvent.mouseUp(increaseBtn);
    const valueAfterStop = Number(screen.getByRole("slider").ariaValueNow);
    act(() => {
      vi.advanceTimersByTime(constants.UPDATE_INTERVAL_MS * 5);
    });
    expect(Number(screen.getByRole("slider").ariaValueNow)).toBe(
      valueAfterStop,
    );
  });

  it("disables controls when tab controls are not available", () => {
    mockUseTabControlsAvailable.mockReturnValue(false);
    render(<Popup />);
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /decrease speed/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /increase speed/i }),
    ).not.toBeInTheDocument();
  });
});
