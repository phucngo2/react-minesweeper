import { GameLevels } from "@app/config";
import { GameLevelsType } from "@app/types";
import { retrieveAppStorage } from "@app/utils";
import { atom } from "jotai";

const getInitialValue = (): GameLevelsType => {
  const appStorage = retrieveAppStorage();
  if (appStorage?.gameLevel) {
    return appStorage.gameLevel;
  }
  return GameLevels.Beginner;
};

export const gameLevelAtom = atom<GameLevelsType>(getInitialValue());
