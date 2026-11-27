import type { THEMES } from "@app/config";
import { GameLevelSetting, GameLevelsType } from "./game.types";

export type ThemeType = (typeof THEMES)[number];

export interface AppStorage {
  gameLevel: GameLevelsType;
  /** First Move No Guessing (name kept for saved settings) */
  isNoGuessingMode: boolean;
  /** No Guessing Mode: the whole board is solvable without guessing */
  isNoGuessingBoard?: boolean;
  customLevel?: GameLevelSetting;
  useQuestionMarks?: boolean;
  theme?: string;
}
