import { atom } from "jotai";
import { gameLevelAtom } from "./game-level.atom";
import { GAME_LEVEL_SETTING_OPTIONS } from "@app/config";
import { GameLevelSetting } from "@app/types";

export const gameLevelDetailAtom = atom<GameLevelSetting>((get) => {
  const gameLevel = get(gameLevelAtom);
  return GAME_LEVEL_SETTING_OPTIONS[gameLevel];
});
