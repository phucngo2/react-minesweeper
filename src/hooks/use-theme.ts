import { themeAtom } from "@app/stores";
import { useAtomValue } from "jotai";
import { useLayoutEffect } from "react";

export const applyTheme = (theme: string) => {
  const root = document.documentElement;
  if (root.dataset.theme === theme) return;
  // Swap themes without transitions, so controls (selected segment, buttons)
  // don't animate from the old theme's colors and flicker.
  root.classList.add("theme-switching");
  root.dataset.theme = theme;
  void window.getComputedStyle(root).color; // flush styles before re-enabling
  requestAnimationFrame(() => root.classList.remove("theme-switching"));
};

export const useTheme = () => {
  const theme = useAtomValue(themeAtom);

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);
};
