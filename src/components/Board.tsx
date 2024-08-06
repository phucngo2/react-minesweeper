import { Cell } from "@app/components";
import {
  GAME_LEVEL_SETTING_OPTIONS,
  GameLevels,
  GameStates,
} from "@app/config";
import {
  calculateAdjacentMines,
  generateBoards,
  placeMines,
  revealCell,
} from "@app/handlers";
import { useBoard } from "@app/hooks";
import { gameStateAtom } from "@app/stores";
import { Cell as ICell } from "@app/types";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";

export const Board = () => {
  const { board, setBoard } = useBoard();
  const [gameState, setGameState] = useAtom(gameStateAtom);

  const gameLevel = GameLevels.Expert;
  const rows = GAME_LEVEL_SETTING_OPTIONS[gameLevel].rows;
  const cols = GAME_LEVEL_SETTING_OPTIONS[gameLevel].cols;
  const mineCount = GAME_LEVEL_SETTING_OPTIONS[gameLevel].mineCount;

  useEffect(() => {
    const newBoard = calculateAdjacentMines(
      placeMines(generateBoards(rows, cols), mineCount)
    );
    setBoard(newBoard);
  }, []);

  const handleCellClick = useCallback(
    (cell: ICell) => {
      let cellDisabled = gameState !== "Playing" || cell.isRevealed;
      if (cellDisabled) return;

      if (cell.hasMine) return setGameState(GameStates.Lost);
      if (board) setBoard(revealCell(board, cell.row, cell.col));
    },
    [gameState, board, setBoard, setGameState]
  );

  const handleCellRightClick = useCallback((cell: ICell) => {
    // Your right click handling logic here
  }, []);

  return (
    <div
      className="grid gap-0.5"
      style={{
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
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
