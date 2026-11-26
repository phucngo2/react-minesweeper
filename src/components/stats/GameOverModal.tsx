import { Modal, StatsSummary } from "@app/components";
import { GameLevels } from "@app/config";
import { useNewGame } from "@app/hooks";
import { lastGameResultAtom, statsAtom } from "@app/stores";
import { formatTime } from "@app/utils";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

// Short delay so the player sees the board (exploded mine / flagged mines) first.
const WIN_DELAY_MS = 360;
const LOSS_DELAY_MS = 360;

export const GameOverModal = () => {
  const result = useAtomValue(lastGameResultAtom);
  const stats = useAtomValue(statsAtom);
  const { newGame } = useNewGame();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!result) {
      setIsOpen(false);
      return;
    }
    const timer = window.setTimeout(
      () => setIsOpen(true),
      result.won ? WIN_DELAY_MS : LOSS_DELAY_MS
    );
    return () => window.clearTimeout(timer);
  }, [result]);

  const handlePlayAgain = () => {
    setIsOpen(false);
    newGame();
  };

  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      {result && (
        <>
          <h3
            className={`text-2xl font-bold ${result.won ? "text-success" : "text-error"}`}
          >
            {result.won ? "🎉 You won!" : "💥 Game over"}
          </h3>
          <p className="mt-2">
            {result.level} · Time{" "}
            <span className="font-semibold tabular-nums">
              {formatTime(result.time)}
            </span>
          </p>
          {result.isBestTime && (
            <div className="mt-3 badge badge-secondary badge-lg">
              🏆 New best time!
            </div>
          )}
          {result.level !== GameLevels.Custom && (
            <div className="mt-4">
              <StatsSummary stats={stats[result.level]} />
            </div>
          )}
          <div className="modal-action">
            <button
              className="h-10 min-h-10 btn"
              onClick={() => setIsOpen(false)}
            >
              View board
            </button>
            <button
              className="h-10 min-h-10 btn btn-secondary"
              onClick={handlePlayAgain}
            >
              Play again
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};
