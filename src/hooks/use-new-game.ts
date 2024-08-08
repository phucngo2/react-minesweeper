import { GameStates } from "@app/config";
import {
  calculateAdjacentMines,
  generateBoards,
  placeMines,
} from "@app/handlers";
import { useBoard } from "@app/hooks";
import {
  flagCountAtom,
  gameLevelDetailAtom,
  gameStateAtom,
  timeAtom,
} from "@app/stores";
import { GameLevelSetting } from "@app/types";
import { useAtomValue, useSetAtom } from "jotai";

export const useNewGame = () => {
  const gameLevelDetail = useAtomValue(gameLevelDetailAtom);
  const setGameState = useSetAtom(gameStateAtom);
  const setFlagCount = useSetAtom(flagCountAtom);
  const { setBoard } = useBoard();
  const setSeconds = useSetAtom(timeAtom);

  const newGame = (config?: GameLevelSetting) => {
    const { rows, cols, mineCount } = config || gameLevelDetail;

    const newBoard = calculateAdjacentMines(
      placeMines(generateBoards(rows, cols), mineCount)
    );
    setBoard(newBoard);
    setFlagCount(mineCount);
    setSeconds(0);
    setGameState(GameStates.Playing);
  };

  return newGame;
};
