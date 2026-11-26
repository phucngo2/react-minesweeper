import { DEFAULT_CUSTOM_LEVEL } from "@app/config";
import { GameLevelSetting } from "@app/types";
import { normalizeCustomLevel, retrieveAppStorage } from "@app/utils";
import { atom } from "jotai";

const getInitialValue = (): GameLevelSetting => {
  const customLevel = retrieveAppStorage()?.customLevel;
  return customLevel ? normalizeCustomLevel(customLevel) : DEFAULT_CUSTOM_LEVEL;
};

export const customLevelAtom = atom<GameLevelSetting>(getInitialValue());
