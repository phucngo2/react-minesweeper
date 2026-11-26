import { markCellAtom, revealCellAtom, toggleFlagAtom } from "@app/stores";
import { useSetAtom } from "jotai";

export const useCellActions = () => {
  const revealCell = useSetAtom(revealCellAtom);
  const toggleFlag = useSetAtom(toggleFlagAtom);
  const markCell = useSetAtom(markCellAtom);
  return { revealCell, toggleFlag, markCell };
};
