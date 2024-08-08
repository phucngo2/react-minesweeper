import { GameStates } from "@app/config";
import { flagCell, isBoardClear, revealCell } from "@app/handlers";
import { useBoard } from "@app/hooks";
import { flagCountAtom, gameStateAtom } from "@app/stores";
import { Cell as ICell, RevealCellResult } from "@app/types";
import { useAtom } from "jotai";
import { useCallback } from "react";

export const useCellActions = () => {
  const { board, setBoard } = useBoard();
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [flagCount, setFlagCount] = useAtom(flagCountAtom);

  const handleCellClick = useCallback(
    (cell: ICell) => {
      if (gameState !== "Playing" || cell.isFlagged || !board) return;

      const revealCellResult: RevealCellResult = revealCell(
        board,
        cell.row,
        cell.col
      );

      setBoard(revealCellResult.board);

      if (revealCellResult.hasMine) return setGameState(GameStates.Lost);
      if (isBoardClear(revealCellResult.board)) setGameState(GameStates.Won);
    },
    [gameState, board, setBoard, setGameState]
  );

  const handleCellRightClick = useCallback(
    (cell: ICell) => {
      if (gameState !== "Playing" || cell.isRevealed || !flagCount || !board)
        return;

      let flagChanged = cell.isFlagged ? 1 : -1;
      // The value of `cell.isFlagged` will change after the `flagCell` function is called.
      // cell.isFlagged = false
      setBoard(flagCell(board, cell.row, cell.col));
      // cell.isFlagged = true
      setFlagCount((state) => state + flagChanged);
    },
    [gameState, board, setBoard, setGameState]
  );

  return { handleCellClick, handleCellRightClick };
};
