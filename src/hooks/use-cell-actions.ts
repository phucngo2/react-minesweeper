import { GameStates } from "@app/config";
import { flagCell, revealCell } from "@app/handlers";
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
      let cellDisabled = gameState !== "Playing" || cell.isFlagged;
      if (cellDisabled) return;

      if (board) {
        const revealCellResult: RevealCellResult = revealCell(
          board,
          cell.row,
          cell.col
        );
        if (revealCellResult.hasMine) setGameState(GameStates.Lost);
        setBoard(revealCellResult.board);
      }
    },
    [gameState, board, setBoard, setGameState]
  );

  const handleCellRightClick = useCallback(
    (cell: ICell) => {
      let cellDisabled =
        gameState !== "Playing" || cell.isRevealed || !flagCount;
      if (cellDisabled) return;

      if (board) {
        setBoard(flagCell(board, cell.row, cell.col));
        setFlagCount((state) => state - 1);
      }
    },
    [gameState, board, setBoard, setGameState]
  );

  return { handleCellClick, handleCellRightClick };
};
