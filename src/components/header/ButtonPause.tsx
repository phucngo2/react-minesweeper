import { GameStates } from "@app/config";
import {
  gameStateAtom,
  isGamePausedAtom,
  isGamePlayingAtom,
} from "@app/stores";
import { useAtomValue, useSetAtom } from "jotai";

export const ButtonPause = () => {
  const setGameState = useSetAtom(gameStateAtom);
  const isPlaying = useAtomValue(isGamePlayingAtom);
  const isPaused = useAtomValue(isGamePausedAtom);

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
