import { Modal, SegmentedControl, StatsSummary } from "@app/components";
import { GameLevels, STANDARD_GAME_LEVELS } from "@app/config";
import { gameLevelAtom, resetStatsAtom, statsAtom } from "@app/stores";
import { StandardGameLevelsType } from "@app/types";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";

const LEVEL_OPTIONS = STANDARD_GAME_LEVELS.map((level) => ({
  value: level,
  label: level,
}));

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
      <SegmentedControl
        role="tablist"
        label="Difficulty"
        options={LEVEL_OPTIONS}
        value={level}
        onChange={setLevel}
        className="mb-5 segmented-wrap"
      />
      <StatsSummary stats={stats[level]} />
      <div className="modal-action">
        <button
          className="mr-auto btn btn-gray text-error"
          onClick={() => setIsConfirmOpen(true)}
        >
          Reset
        </button>
        <button className="btn btn-primary btn-frosted" onClick={onClose}>
          Done
        </button>
      </div>
      <Modal open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
        <h3 className="text-lg font-bold">Reset statistics?</h3>
        <p className="mt-2 text-(--label-secondary)">
          This clears games played, streaks, and best times for all levels.
        </p>
        <div className="modal-action">
          <button
            className="btn btn-gray"
            onClick={() => setIsConfirmOpen(false)}
          >
            Cancel
          </button>
          <button className="btn btn-error btn-frosted" onClick={handleReset}>
            Reset
          </button>
        </div>
      </Modal>
    </>
  );
};
