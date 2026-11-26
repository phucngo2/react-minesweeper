import { revealCellAtom, toggleFlagAtom } from "@app/stores";
import { useSetAtom } from "jotai";

export const useCellActions = () => {
  const revealCell = useSetAtom(revealCellAtom);
  const toggleFlag = useSetAtom(toggleFlagAtom);
  return { revealCell, toggleFlag };
};
