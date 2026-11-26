import { GameLevelSetting, GameLevelsType } from "./game.types";

export interface AppStorage {
  gameLevel: GameLevelsType;
  isNoGuessingMode: boolean;
  customLevel?: GameLevelSetting;
  useQuestionMarks?: boolean;
}
