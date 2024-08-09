import { retrieveAppStorage } from "@app/utils";
import { atom } from "jotai";

const getInitialValue = (): boolean => {
  const appStorage = retrieveAppStorage();
  if (appStorage?.isNoGuessingMode != undefined) {
    return appStorage.isNoGuessingMode;
  }
  return false;
};

export const isNoGuessingModeAtom = atom<boolean>(getInitialValue());
