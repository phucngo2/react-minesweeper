import { flagCountAtom } from "@app/stores";
import { useAtomValue } from "jotai";

export const FlagCount = () => {
  const flagCount = useAtomValue(flagCountAtom);
  return (
    <div className="tooltip tooltip-bottom" data-tip="Remaining mines">
      <div className="h-10 min-h-0 text-xl btn">
        🚩 <span className="text-base tabular-nums">x{flagCount}</span>
      </div>
    </div>
  );
};
