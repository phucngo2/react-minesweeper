import { isFlagModeAtom } from "@app/stores";
import { useAtom } from "jotai";

export const ButtonFlagMode = () => {
  const [isFlagMode, setIsFlagMode] = useAtom(isFlagModeAtom);

  return (
    <div
      className="tooltip tooltip-bottom"
      data-tip={isFlagMode ? "Tap to flag" : "Tap to dig"}
    >
      <button
        onClick={() => setIsFlagMode((value) => !value)}
        className="w-10 h-10 min-h-0 text-xl btn"
        aria-pressed={isFlagMode}
        aria-label="Flag mode"
      >
        {isFlagMode ? "🚩" : "⛏️"}
      </button>
    </div>
  );
};
