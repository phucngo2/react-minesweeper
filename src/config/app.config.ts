export const APP_STORAGE_KEY = "minesweeper-storage";
export const STATS_STORAGE_KEY = "minesweeper-stats";

// Keep in sync with `daisyui.themes` in tailwind.config.js
export const THEMES = [
  "dark",
  "light",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
] as const;
export const DEFAULT_THEME: (typeof THEMES)[number] = "dark";
