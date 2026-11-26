import { EnumRecord } from "./global.types";

export interface Cell {
  row: number;
  col: number;
  hasMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  isQuestioned: boolean;
  isExploded: boolean;
  adjacentMines: number;
}

export interface CellLocation {
  row: number;
  col: number;
}

export type StandardGameLevelsType = "Beginner" | "Intermediate" | "Expert";
export type GameLevelsType = StandardGameLevelsType | "Custom";
export type GameLevelsRecord = EnumRecord<GameLevelsType>;
export interface GameLevelSetting {
  rows: number;
  cols: number;
  mineCount: number;
}
export type GameLevelSettingOptions = Record<
  StandardGameLevelsType,
  GameLevelSetting
>;

export type GameStatesType = "Paused" | "Won" | "Lost" | "Playing" | "New";
export type GameStatesRecord = EnumRecord<GameStatesType>;

export interface RevealCellResult {
  hasMine: boolean;
  board: Cell[][];
}

export interface BestTime {
  time: number;
  date: string;
}
export interface LevelStats {
  played: number;
  won: number;
  // Positive for a winning streak, negative for a losing streak
  currentStreak: number;
  longestWinStreak: number;
  longestLossStreak: number;
  bestTimes: BestTime[];
}
export type GameStats = Record<StandardGameLevelsType, LevelStats>;
