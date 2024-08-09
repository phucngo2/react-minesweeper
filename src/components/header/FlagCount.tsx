import { flagCountAtom } from "@app/stores";
import { useAtomValue } from "jotai";

export const FlagCount = () => {
  const flagCount = useAtomValue(flagCountAtom);
  return (
    <div className="tooltip tooltip-bottom" data-tip="Remaining flag(s)">
      <button className="h-10 min-h-0 text-xl btn">
        🚩 <span className="text-base">x{flagCount}</span>
      </button>
    </div>
  );
};
