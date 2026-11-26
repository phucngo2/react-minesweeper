import type { THEMES } from "@app/config";
import { GameLevelSetting, GameLevelsType } from "./game.types";

export type ThemeType = (typeof THEMES)[number];

export interface AppStorage {
  gameLevel: GameLevelsType;
  isNoGuessingMode: boolean;
  customLevel?: GameLevelSetting;
  useQuestionMarks?: boolean;
  theme?: string;
}
