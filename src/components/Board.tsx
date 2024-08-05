import { Cell } from "@app/components";
import { GAME_LEVEL_SETTING_OPTIONS, GAME_LEVELS } from "@app/config";
import {
  calculateAdjacentMines,
  generateBoards,
  placeMines,
} from "@app/handlers";

export const Board = () => {
  const gameLevel = GAME_LEVELS.Expert;
  const rows = GAME_LEVEL_SETTING_OPTIONS[gameLevel].rows;
  const cols = GAME_LEVEL_SETTING_OPTIONS[gameLevel].cols;
  const mineCount = GAME_LEVEL_SETTING_OPTIONS[gameLevel].mineCount;
  return (
    <div
      className="grid gap-0.5"
      style={{
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
    >
      {calculateAdjacentMines(placeMines(generateBoards(rows, cols), mineCount))
        .flat()
        .map((cell, index) => (
          <Cell key={index} cell={cell} />
        ))}
    </div>
  );
};
