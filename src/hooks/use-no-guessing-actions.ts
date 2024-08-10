import { calculateAdjacentMines, placeMinesNoGuessing } from "@app/handlers";
import { boardAtom, gameLevelDetailAtom } from "@app/stores";
import { Cell as ICell } from "@app/types";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";

export const useNoGuessingAction = () => {
  const gameLevelDetail = useAtomValue(gameLevelDetailAtom);
  const setBoard = useSetAtom(boardAtom);

  const handleNoGuessingModeFirstMove = useCallback(
    (cell: ICell) => {
      setBoard((board) =>
        calculateAdjacentMines(
          placeMinesNoGuessing(board!, gameLevelDetail.mineCount, cell)
        )
      );
    },
    [setBoard, gameLevelDetail]
  );

  return { handleNoGuessingModeFirstMove };
};
