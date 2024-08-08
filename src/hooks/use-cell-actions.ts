import { GameStates } from "@app/config";
import { flagCell, isBoardClear, revealCell } from "@app/handlers";
import { boardAtom, flagCountAtom, gameStateAtom } from "@app/stores";
import { Cell as ICell, RevealCellResult } from "@app/types";
import { useAtom, useSetAtom } from "jotai";
import { useCallback } from "react";

export const useCellActions = () => {
  const setBoard = useSetAtom(boardAtom);
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [flagCount, setFlagCount] = useAtom(flagCountAtom);

  const handleCellClick = useCallback(
    (cell: ICell) => {
      if (gameState !== "Playing" || cell.isFlagged) return;

      // Use this call to prevent the handleCellClick to depend on the board of useAtom,
      // which cause this function to re-create whenever board updated
      setBoard((board) => {
        const revealCellResult: RevealCellResult = revealCell(
          board!,
          cell.row,
          cell.col
        );
        if (revealCellResult.hasMine) {
          setGameState(GameStates.Lost);
          return board;
        }
        if (isBoardClear(revealCellResult.board)) setGameState(GameStates.Won);
        if (revealCellResult.needUpdateBoard)
          return [...revealCellResult.board];
        return board;
      });
    },
    [gameState, setBoard, setGameState]
  );

  const handleCellRightClick = useCallback(
    (cell: ICell) => {
      if (gameState !== "Playing" || cell.isRevealed || !flagCount) return;

      let flagChanged = cell.isFlagged ? 1 : -1;
      // The value of `cell.isFlagged` will change after the `flagCell` function is called.
      // cell.isFlagged = false
      setBoard((board) => flagCell(board!, cell.row, cell.col));
      // cell.isFlagged = true
      setFlagCount((state) => state + flagChanged);
    },
    [gameState, setBoard, setGameState]
  );

  return { handleCellClick, handleCellRightClick };
};
