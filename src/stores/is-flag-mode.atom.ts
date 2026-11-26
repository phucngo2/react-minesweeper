import { atom } from "jotai";
import { useQuestionMarksAtom } from "./use-question-marks.atom";

// What a tap/click does on a hidden cell (mainly for touch devices).
export type TapMode = "dig" | "flag" | "question";

const baseTapModeAtom = atom<TapMode>("dig");

// Reading falls back to "dig" if question marks get disabled; writing cycles modes.
export const tapModeAtom = atom(
  (get): TapMode => {
    const mode = get(baseTapModeAtom);
    return mode === "question" && !get(useQuestionMarksAtom) ? "dig" : mode;
  },
  (get, set) => {
    const mode = get(tapModeAtom);
    if (mode === "dig") set(baseTapModeAtom, "flag");
    else if (mode === "flag" && get(useQuestionMarksAtom))
      set(baseTapModeAtom, "question");
    else set(baseTapModeAtom, "dig");
  }
);
