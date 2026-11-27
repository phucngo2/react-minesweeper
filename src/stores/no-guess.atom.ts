import { CellLocation } from "@app/types";
import { retrieveAppStorage } from "@app/utils";
import { atom } from "jotai";

/** Setting: "No Guessing Mode" (mutually exclusive with First Move No Guessing) */
export const isNoGuessingBoardAtom = atom<boolean>(
  retrieveAppStorage()?.isNoGuessingBoard ?? false
);

export interface NoGuessLayout {
  start: CellLocation;
  /** 1 = mine, indexed by row * cols + col */
  mines: Uint8Array;
  solvable: boolean;
}

/** Whether the current game was started in No Guessing Mode */
export const isNoGuessGameAtom = atom(false);
/** Pre-generated layout of the current No Guessing game (null while generating) */
export const noGuessLayoutAtom = atom<NoGuessLayout | null>(null);
export const isGeneratingBoardAtom = atom(false);
/** Bumped when the player clicks another cell first, to nudge the start marker */
export const startHintAtom = atom(0);
