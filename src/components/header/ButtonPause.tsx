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
      data-tip={isPaused ? "Resume (P)" : "Pause (P)"}
    >
      <button
        onClick={togglePause}
        disabled={!isPlaying && !isPaused}
        className="btn size-10 text-xl"
        aria-label={isPaused ? "Resume" : "Pause"}
      >
        {isPaused ? "▶️" : "⏸️"}
      </button>
    </div>
  );
};
