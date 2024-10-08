import { EnumRecord } from "./global.types";

export interface Cell {
  row: number;
  col: number;
  hasMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

export interface CellLocation {
  row: number;
  col: number;
}

export type GameLevelsType = "Beginner" | "Intermediate" | "Expert";
export type GameLevelsRecord = EnumRecord<GameLevelsType>;
export interface GameLevelSetting {
  rows: number;
  cols: number;
  mineCount: number;
}
export type GameLevelSettingOptions = Record<GameLevelsType, GameLevelSetting>;

export type GameStatesType = "Paused" | "Won" | "Lost" | "Playing" | "New";
export type GameStatesRecord = EnumRecord<GameStatesType>;

export interface RevealCellResult {
  hasMine: boolean;
  needUpdateBoard: boolean;
  board: Cell[][];
}
export interface CountFlagResult {
  flagCount: number;
  hasFalseNegative: boolean;
}
