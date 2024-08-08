import { GameLevels } from "@app/config";
import { GameLevelsType } from "@app/types";
import { atom } from "jotai";

export const gameLevelAtom = atom<GameLevelsType>(GameLevels.Beginner);
