import { GameLevelsType } from "./game.types";

export interface AppStorage {
  gameLevel: GameLevelsType;
  isNoGuessingMode: boolean;
}
