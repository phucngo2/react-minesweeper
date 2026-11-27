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
  // Keep showing the last result while the modal fades out after it resets.
  const [shownResult, setShownResult] = useState(result);
  if (result && result !== shownResult) setShownResult(result);

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
      {shownResult && (
        <>
          <div className="flex flex-col items-center text-center">
            <div className="text-5xl" aria-hidden>
              {shownResult.won ? "🎉" : "💥"}
            </div>
            <h3
              className={`mt-2 text-2xl font-bold ${shownResult.won ? "text-success" : "text-error"}`}
            >
              {shownResult.won ? "You won!" : "Game over"}
            </h3>
            <p className="mt-1 text-(--label-secondary)">
              {shownResult.level} ·{" "}
              <span className="font-semibold font-rounded tabular-nums">
                {formatTime(shownResult.time)}
              </span>
            </p>
            {shownResult.isBestTime && (
              <div className="mt-3 rounded-full px-3 py-1 text-sm font-semibold text-secondary bg-secondary/15">
                🏆 New best time!
              </div>
            )}
          </div>
          {shownResult.level !== GameLevels.Custom && (
            <div className="mt-5">
              <StatsSummary stats={stats[shownResult.level]} />
            </div>
          )}
          <div className="modal-action">
            <button className="btn btn-gray" onClick={() => setIsOpen(false)}>
              View board
            </button>
            <button
              className="btn btn-primary btn-frosted"
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
