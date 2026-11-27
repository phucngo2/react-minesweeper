import { Modal, StatsSummary } from "@app/components";
import { GameLevels, STANDARD_GAME_LEVELS } from "@app/config";
import { gameLevelAtom, resetStatsAtom, statsAtom } from "@app/stores";
import { StandardGameLevelsType } from "@app/types";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ModalStats: React.FC<Props> = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose}>
    <StatsContent onClose={onClose} />
  </Modal>
);

const StatsContent = ({ onClose }: { onClose: () => void }) => {
  const stats = useAtomValue(statsAtom);
  const resetStats = useSetAtom(resetStatsAtom);
  const currentLevel = useAtomValue(gameLevelAtom);
  const [level, setLevel] = useState<StandardGameLevelsType>(
    currentLevel === GameLevels.Custom ? GameLevels.Beginner : currentLevel
  );

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleReset = () => {
    resetStats();
    setIsConfirmOpen(false);
  };

  return (
    <>
      <h3 className="mb-4 text-lg font-bold">Statistics</h3>
      <div role="tablist" className="mb-4 tabs tabs-box">
        {STANDARD_GAME_LEVELS.map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={item === level}
            className={`tab ${item === level ? "tab-active" : ""}`}
            onClick={() => setLevel(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <StatsSummary stats={stats[level]} />
      <div className="modal-action">
        <button
          className="h-10 min-h-10 btn btn-error"
          onClick={() => setIsConfirmOpen(true)}
        >
          Reset
        </button>
        <button className="h-10 min-h-10 btn" onClick={onClose}>
          Close
        </button>
      </div>
      <Modal open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
        <h3 className="text-lg font-bold">Reset statistics?</h3>
        <p className="mt-2">
          This clears games played, streaks, and best times for all levels.
        </p>
        <div className="modal-action">
          <button
            className="h-10 min-h-10 btn"
            onClick={() => setIsConfirmOpen(false)}
          >
            Cancel
          </button>
          <button
            className="h-10 min-h-10 btn btn-error"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </Modal>
    </>
  );
};
