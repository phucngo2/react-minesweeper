import { GameStates } from "@app/config";
import {
  calculateAdjacentMines,
  generateBoards,
  placeMines,
} from "@app/handlers";
import { useBoard } from "@app/hooks";
import {
  flagCountAtom,
  gameLevelDetailAtom,
  gameStateAtom,
  timeAtom,
} from "@app/stores";
import { useAtomValue, useSetAtom } from "jotai";

export const ButtonPlay = () => {
  const { rows, cols, mineCount } = useAtomValue(gameLevelDetailAtom);
  const setGameState = useSetAtom(gameStateAtom);
  const setFlagCount = useSetAtom(flagCountAtom);
  const { setBoard } = useBoard();
  const setSeconds = useSetAtom(timeAtom);

  const handleClick = () => {
    const newBoard = calculateAdjacentMines(
      placeMines(generateBoards(rows, cols), mineCount)
    );
    setBoard(newBoard);
    setFlagCount(mineCount);
    setSeconds(0);
    setGameState(GameStates.Playing);
  };

  return (
    <div className="tooltip tooltip-bottom" data-tip="New Game">
      <button onClick={handleClick} className="w-10 h-10 min-h-0 text-xl btn">
        <ButtonPlayContent />
      </button>
    </div>
  );
};

function ButtonPlayContent() {
  const gameState = useAtomValue(gameStateAtom);

  switch (gameState) {
    case GameStates.Won:
      return <>😎</>;
    case GameStates.Lost:
      return <>🤯</>;

    default:
      return <>🙂</>;
  }
}
