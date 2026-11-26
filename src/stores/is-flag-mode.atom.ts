import { atom } from "jotai";

// When enabled, a tap/click flags cells instead of revealing them (touch devices).
export const isFlagModeAtom = atom<boolean>(false);
