import { newGameAtom, pauseGameAtom, togglePauseAtom } from "@app/stores";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

/** Starts the first game, binds F2 (new game) / P (pause), and auto-pauses when hidden. */
export const useGameShortcuts = () => {
  const newGame = useSetAtom(newGameAtom);
  const togglePause = useSetAtom(togglePauseAtom);
  const pauseGame = useSetAtom(pauseGameAtom);

  useEffect(() => {
    newGame();
  }, [newGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.closest("dialog[open]")) return;
      if (e.key === "F2") {
        e.preventDefault();
        newGame();
      } else if (e.key === "p" || e.key === "P") {
        togglePause();
      }
    };
    const handleVisibilityChange = () => {
      if (document.hidden) pauseGame();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [newGame, togglePause, pauseGame]);
};
