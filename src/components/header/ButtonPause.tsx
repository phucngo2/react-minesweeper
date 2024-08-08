import { GameStates } from "@app/config";
import { gameStateAtom } from "@app/stores";
import { useAtom } from "jotai";

export const ButtonPause = () => {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const isPlaying = gameState === GameStates.Playing;
  const isPaused = gameState === GameStates.Paused;

  const handleClick = () => {
    if (isPlaying) {
      setGameState(GameStates.Paused);
    }
    if (isPaused) {
      setGameState(GameStates.Playing);
    }
  };

  return (
    <div
      className="tooltip tooltip-bottom"
      data-tip={isPlaying ? "Pause" : "Resume"}
    >
      <button onClick={handleClick} className="w-10 h-10 min-h-0 text-xl btn">
        {isPlaying ? "⏸️" : "▶️"}
      </button>
    </div>
  );
};
