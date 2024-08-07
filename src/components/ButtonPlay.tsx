import { GameStates } from "@app/config";
import {
  calculateAdjacentMines,
  generateBoards,
  placeMines,
} from "@app/handlers";
import { useBoard } from "@app/hooks";
import { gameLevelDetailAtom, gameStateAtom } from "@app/stores";
import { useAtomValue, useSetAtom } from "jotai";

export const ButtonPlay = () => {
  const { rows, cols, mineCount } = useAtomValue(gameLevelDetailAtom);
  const setGameState = useSetAtom(gameStateAtom);
  const { setBoard } = useBoard();

  const handleClick = () => {
    const newBoard = calculateAdjacentMines(
      placeMines(generateBoards(rows, cols), mineCount)
    );
    setBoard(newBoard);
    setGameState(GameStates.Playing);
  };

  return (
    <button onClick={handleClick} className="w-10 h-10 min-h-0 btn">
      🙂
    </button>
  );
};
