import { retrieveAppStorage } from "@app/utils";
import { atom } from "jotai";

export const useQuestionMarksAtom = atom<boolean>(
  retrieveAppStorage()?.useQuestionMarks ?? false
);
