import { APP_STORAGE_KEY, CUSTOM_LEVEL_LIMITS } from "@app/config";
import { AppStorage, GameLevelSetting } from "@app/types";

export function saveAppStorage(appStorage: Partial<AppStorage>) {
  writeStorage(APP_STORAGE_KEY, { ...retrieveAppStorage(), ...appStorage });
}

export function retrieveAppStorage(): AppStorage | null {
  return readStorage<AppStorage>(APP_STORAGE_KEY);
}

export function readStorage<T>(key: string): T | null {
  try {
    const json = localStorage.getItem(key);
    return json ? (JSON.parse(json) as T) : null;
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode, quota); the game still works.
  }
}

export function formatTime(seconds: number): string {
  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substring(11, 19);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(Math.round(value) || min, min), max);
}

export function normalizeCustomLevel({
  rows,
  cols,
  mineCount,
}: GameLevelSetting): GameLevelSetting {
  const { minRows, maxRows, minCols, maxCols, minMines, maxMines } =
    CUSTOM_LEVEL_LIMITS;
  const safeRows = clamp(rows, minRows, maxRows);
  const safeCols = clamp(cols, minCols, maxCols);
  return {
    rows: safeRows,
    cols: safeCols,
    mineCount: clamp(mineCount, minMines, maxMines(safeRows, safeCols)),
  };
}
