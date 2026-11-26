import { countFlags } from "@app/handlers";
import { atom } from "jotai";
import { boardAtom } from "./board.atom";
import { gameLevelDetailAtom } from "./game-level-detail.atom";

// Remaining mines = mines - flags. Can go negative, like Microsoft Minesweeper.
export const flagCountAtom = atom<number>((get) => {
  const board = get(boardAtom);
  const { mineCount } = get(gameLevelDetailAtom);
  return board ? mineCount - countFlags(board) : mineCount;
});
