import { GameLevelSettingOptions, GameLevelsRecord } from "@app/types";

export const MINE_COUNT_DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export const GameLevels: GameLevelsRecord = {
  Beginner: "Beginner",
  Intermediate: "Intermediate",
  Expert: "Expert",
} as const;
export const GAME_LEVEL_SETTING_OPTIONS: GameLevelSettingOptions = {
  [GameLevels.Beginner]: {
    rows: 9,
    cols: 9,
    mineCount: 10,
  },
  [GameLevels.Intermediate]: {
    rows: 16,
    cols: 16,
    mineCount: 40,
  },
  [GameLevels.Expert]: {
    rows: 16,
    cols: 30,
    mineCount: 99,
  },
};
