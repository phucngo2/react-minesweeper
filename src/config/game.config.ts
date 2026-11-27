import {
  GameLevelSetting,
  GameLevelSettingOptions,
  GameLevelsRecord,
  GameStatesRecord,
  GameStatesType,
  StandardGameLevelsType,
} from "@app/types";

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
  Evil: "Evil",
  Custom: "Custom",
} as const;
export const STANDARD_GAME_LEVELS: StandardGameLevelsType[] = [
  GameLevels.Beginner,
  GameLevels.Intermediate,
  GameLevels.Expert,
  GameLevels.Evil,
];
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
  [GameLevels.Evil]: {
    rows: 19,
    cols: 30,
    mineCount: 130,
  },
};

// Same limits as Microsoft Minesweeper
export const CUSTOM_LEVEL_LIMITS = {
  minRows: 9,
  maxRows: 24,
  minCols: 9,
  maxCols: 30,
  minMines: 10,
  maxMines: (rows: number, cols: number) => (rows - 1) * (cols - 1),
};
export const DEFAULT_CUSTOM_LEVEL: GameLevelSetting = {
  rows: 20,
  cols: 24,
  mineCount: 99,
};

export const LONG_PRESS_MS = 400;
export const MAX_BEST_TIMES = 5;

export const GameStates: GameStatesRecord = {
  Lost: "Lost",
  Paused: "Paused",
  Playing: "Playing",
  Won: "Won",
  New: "New",
} as const;
export const PAUSED_TIMER_GAME_STATES: GameStatesType[] = [
  GameStates.Paused,
  GameStates.Lost,
  GameStates.Won,
];
