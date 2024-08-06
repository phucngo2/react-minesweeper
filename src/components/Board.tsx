import { Cell } from "@app/components";
import { GAME_LEVEL_SETTING_OPTIONS, GameLevels } from "@app/config";
import {
  calculateAdjacentMines,
  generateBoards,
  placeMines,
} from "@app/handlers";
import { boardAtom } from "@app/stores";
import { useAtom } from "jotai";
import { useEffect } from "react";

export const Board = () => {
  const [board, setBoard] = useAtom(boardAtom);

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

  return (
    <div
      className="grid gap-0.5"
      style={{
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
    >
      {board?.flat().map((cell, index) => (
        <Cell key={index} cell={cell} />
      ))}
    </div>
  );
};
