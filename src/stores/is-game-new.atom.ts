import { atom } from "jotai";
import { gameStateAtom } from "./game-state.atom";
import { GameStates } from "@app/config";

export const isGameNewAtom = atom<boolean>((get) => {
  const gameState = get(gameStateAtom);
  return gameState == GameStates.New;
});
