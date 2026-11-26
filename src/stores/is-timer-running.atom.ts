import { GameStates } from "@app/config";
import { atom } from "jotai";
import { gameStateAtom } from "./game-state.atom";
import { isBoardPlayableAtom } from "./is-board-playable.atom";

// The clock starts on the first reveal, like Microsoft Minesweeper.
export const isTimerRunningAtom = atom<boolean>(
  (get) =>
    get(gameStateAtom) === GameStates.Playing && get(isBoardPlayableAtom)
);
