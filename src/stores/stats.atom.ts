import { MAX_BEST_TIMES, STANDARD_GAME_LEVELS, STATS_STORAGE_KEY } from "@app/config";
import { GameStats, LevelStats, StandardGameLevelsType } from "@app/types";
import { readStorage, writeStorage } from "@app/utils";
import { atom } from "jotai";

const createEmptyLevelStats = (): LevelStats => ({
  played: 0,
  won: 0,
  currentStreak: 0,
  longestWinStreak: 0,
  longestLossStreak: 0,
  bestTimes: [],
});

const createEmptyStats = (): GameStats =>
  Object.fromEntries(
    STANDARD_GAME_LEVELS.map((level) => [level, createEmptyLevelStats()])
  ) as GameStats;

const getInitialValue = (): GameStats => {
  const stored = readStorage<Partial<GameStats>>(STATS_STORAGE_KEY);
  const stats = createEmptyStats();
  if (!stored) return stats;
  for (const level of STANDARD_GAME_LEVELS) {
    stats[level] = { ...stats[level], ...stored[level] };
  }
  return stats;
};

export const statsAtom = atom<GameStats>(getInitialValue());

interface GameResult {
  level: StandardGameLevelsType;
  won: boolean;
  time: number;
}

export const recordGameAtom = atom(
  null,
  (get, set, { level, won, time }: GameResult) => {
    const stats = get(statsAtom);
    const prev = stats[level];
    const currentStreak = won
      ? Math.max(prev.currentStreak, 0) + 1
      : Math.min(prev.currentStreak, 0) - 1;

    const next: LevelStats = {
      played: prev.played + 1,
      won: prev.won + (won ? 1 : 0),
      currentStreak,
      longestWinStreak: Math.max(prev.longestWinStreak, currentStreak),
      longestLossStreak: Math.max(prev.longestLossStreak, -currentStreak),
      bestTimes: won
        ? [...prev.bestTimes, { time, date: new Date().toISOString() }]
            .sort((a, b) => a.time - b.time)
            .slice(0, MAX_BEST_TIMES)
        : prev.bestTimes,
    };

    const newStats = { ...stats, [level]: next };
    set(statsAtom, newStats);
    writeStorage(STATS_STORAGE_KEY, newStats);
  }
);

export const resetStatsAtom = atom(null, (_get, set) => {
  const stats = createEmptyStats();
  set(statsAtom, stats);
  writeStorage(STATS_STORAGE_KEY, stats);
});
