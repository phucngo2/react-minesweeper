import { themeAtom } from "@app/stores";
import { useAtomValue } from "jotai";
import { useLayoutEffect } from "react";

export const applyTheme = (theme: string) => {
  document.documentElement.dataset.theme = theme;
};

export const useTheme = () => {
  const theme = useAtomValue(themeAtom);

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);
};
