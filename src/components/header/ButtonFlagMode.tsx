import { tapModeAtom, TapMode } from "@app/stores";
import { useAtom } from "jotai";

const TAP_MODES: Record<TapMode, { icon: string; tip: string }> = {
  dig: { icon: "⛏️", tip: "Tap to dig" },
  flag: { icon: "🚩", tip: "Tap to flag" },
  question: { icon: "❓", tip: "Tap to mark ?" },
};

export const ButtonFlagMode = () => {
  const [tapMode, cycleTapMode] = useAtom(tapModeAtom);
  const { icon, tip } = TAP_MODES[tapMode];

  return (
    <div className="tooltip tooltip-bottom" data-tip={tip}>
      <button
        onClick={() => cycleTapMode()}
        className="btn size-10 text-xl"
        aria-label={`Tap mode: ${tapMode}`}
      >
        {icon}
      </button>
    </div>
  );
};
