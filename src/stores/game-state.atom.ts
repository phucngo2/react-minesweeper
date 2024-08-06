import { GameStates } from "@app/config";
import { GameStatesType } from "@app/types";
import { atom } from "jotai";

export const gameStateAtom = atom<GameStatesType>(GameStates.Playing);
