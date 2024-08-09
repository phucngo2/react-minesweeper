import { calculateAdjacentMines, placeMinesNoGuessing } from "@app/handlers";
import {
  boardAtom,
  gameLevelDetailAtom,
  isBoardPlayableAtom,
} from "@app/stores";
import { Cell as ICell } from "@app/types";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";

export const useNoGuessingAction = () => {
  const gameLevelDetail = useAtomValue(gameLevelDetailAtom);
  const setBoard = useSetAtom(boardAtom);
  const setIsBoardPlayable = useSetAtom(isBoardPlayableAtom);

  const handleNoGuessingModeFirstMove = useCallback(
    (cell: ICell) => {
      setBoard((board) =>
        calculateAdjacentMines(
          placeMinesNoGuessing(board!, gameLevelDetail.mineCount, cell)
        )
      );
      setIsBoardPlayable(true);
    },
    [setBoard, gameLevelDetail]
  );

  return { handleNoGuessingModeFirstMove };
};
