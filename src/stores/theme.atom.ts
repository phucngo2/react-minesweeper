import { DEFAULT_THEME, THEMES } from "@app/config";
import { ThemeType } from "@app/types";
import { retrieveAppStorage } from "@app/utils";
import { atom } from "jotai";

export const isTheme = (value: unknown): value is ThemeType =>
  THEMES.includes(value as ThemeType);

const getInitialValue = (): ThemeType => {
  const theme = retrieveAppStorage()?.theme;
  return isTheme(theme) ? theme : DEFAULT_THEME;
};

export const themeAtom = atom<ThemeType>(getInitialValue());
