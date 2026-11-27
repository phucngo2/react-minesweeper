import { flagCountAtom } from "@app/stores";
import { useAtomValue } from "jotai";

export const FlagCount = () => {
  const flagCount = useAtomValue(flagCountAtom);
  return (
    <div className="tooltip tooltip-bottom" data-tip="Remaining mines">
      <div className="h-10 gap-2 text-xl btn">
        🚩
        <span className="text-base font-semibold font-rounded tabular-nums">
          {flagCount}
        </span>
      </div>
    </div>
  );
};
