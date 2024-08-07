import { Cell } from "@app/components";
import { GameStates } from "@app/config";
import {
  calculateAdjacentMines,
  flagCell,
  generateBoards,
  placeMines,
  revealCell,
} from "@app/handlers";
import { useBoard } from "@app/hooks";
import { gameLevelDetailAtom, gameStateAtom } from "@app/stores";
import { Cell as ICell, RevealCellResult } from "@app/types";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";

export const Board = () => {
  const { board, setBoard } = useBoard();
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const { rows, cols, mineCount } = useAtomValue(gameLevelDetailAtom);

  useEffect(() => {
    const newBoard = calculateAdjacentMines(
      placeMines(generateBoards(rows, cols), mineCount)
    );
    setBoard(newBoard);
  }, []);

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
      let cellDisabled = gameState !== "Playing" || cell.isRevealed;
      if (cellDisabled) return;

      if (board) setBoard(flagCell(board, cell.row, cell.col));
    },
    [gameState, board, setBoard, setGameState]
  );

  return (
    <div
      className="grid gap-0.5"
      style={{
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {board?.flat().map((cell) => (
        <Cell
          key={`cell-${cell.row}-${cell.col}`}
          cell={cell}
          handleCellClick={handleCellClick}
          handleCellRightClick={handleCellRightClick}
        />
      ))}
    </div>
  );
};
