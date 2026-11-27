import { retrieveAppStorage } from "@app/utils";
import { atom } from "jotai";

// Stored as `isNoGuessingMode` (its original name) to keep saved settings.
const getInitialValue = (): boolean => {
  const appStorage = retrieveAppStorage();
  // The two no-guessing modes are mutually exclusive
  if (appStorage?.isNoGuessingBoard) return false;
  if (appStorage?.isNoGuessingMode != undefined) {
    return appStorage.isNoGuessingMode;
  }
  return false;
};

export const isFirstMoveNoGuessingAtom = atom<boolean>(getInitialValue());
