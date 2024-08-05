import { Cell } from "@app/types";
import { atom } from "jotai";

export const boardAtom = atom<Cell[][]>();
