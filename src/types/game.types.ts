export interface Cell {
  row: number;
  col: number;
  hasMine: boolean;
  isRevealed: boolean;
  adjacentMines: number;
}

export type GameLevels = "Beginner" | "Intermediate" | "Expert";
export type GameLevelsRecord = {
  [K in GameLevels]: K;
};
export interface GameLevelSetting {
  rows: number;
  cols: number;
  mineCount: number;
}
export type GameLevelSettingOptions = Record<GameLevels, GameLevelSetting>;
