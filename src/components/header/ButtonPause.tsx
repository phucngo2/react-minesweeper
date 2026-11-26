import {
  isGamePausedAtom,
  isGamePlayingAtom,
  togglePauseAtom,
} from "@app/stores";
import { useAtomValue, useSetAtom } from "jotai";

export const ButtonPause = () => {
  const togglePause = useSetAtom(togglePauseAtom);
  const isPlaying = useAtomValue(isGamePlayingAtom);
  const isPaused = useAtomValue(isGamePausedAtom);

  return (
    <div
      className="tooltip tooltip-bottom"
      data-tip={isPlaying ? "Pause (P)" : "Resume (P)"}
    >
      <button
        onClick={togglePause}
        disabled={!isPlaying && !isPaused}
        className="w-10 h-10 min-h-0 text-xl btn"
        aria-label={isPlaying ? "Pause" : "Resume"}
      >
        {isPaused ? "▶️" : "⏸️"}
      </button>
    </div>
  );
};
