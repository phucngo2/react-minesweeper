import { GameLevels, GameStates } from "@app/config";
import {
  flagAllMines,
  flagCell,
  generateBoards,
  isBoardClear,
  placeMines,
  revealCell,
} from "@app/handlers";
import { CellLocation, GameLevelsType } from "@app/types";
import { atom, Getter, Setter } from "jotai";
import { boardAtom } from "./board.atom";
import { gameLevelAtom } from "./game-level.atom";
import { gameLevelDetailAtom } from "./game-level-detail.atom";
import { gameStateAtom } from "./game-state.atom";
import { isBoardPlayableAtom } from "./is-board-playable.atom";
import { isNoGuessingModeAtom } from "./is-no-guessing-mode.atom";
import { recordGameAtom, statsAtom } from "./stats.atom";
import { timeAtom } from "./time.atom";
import { useQuestionMarksAtom } from "./use-question-marks.atom";

export interface GameResult {
  level: GameLevelsType;
  won: boolean;
  time: number;
  isBestTime: boolean;
}

export const lastGameResultAtom = atom<GameResult | null>(null);

// Level of the game on the board; the selected level may change before restart.
const activeLevelAtom = atom<GameLevelsType>(GameLevels.Beginner);

const finishGame = (get: Getter, set: Setter, won: boolean) => {
  const level = get(activeLevelAtom);
  const time = get(timeAtom);
  set(gameStateAtom, won ? GameStates.Won : GameStates.Lost);

  let isBestTime = false;
  if (level !== GameLevels.Custom) {
    const previousBest = get(statsAtom)[level].bestTimes[0]?.time;
    isBestTime = won && (previousBest === undefined || time < previousBest);
    set(recordGameAtom, { level, won, time });
  }
  set(lastGameResultAtom, { level, won, time, isBestTime });
};

export const newGameAtom = atom(null, (get, set) => {
  const gameState = get(gameStateAtom);
  const level = get(activeLevelAtom);
  // Abandoning a started game counts as a loss, like Microsoft Minesweeper.
  const isAbandoned =
    get(isBoardPlayableAtom) &&
    (gameState === GameStates.Playing || gameState === GameStates.Paused);
  if (isAbandoned && level !== GameLevels.Custom) {
    set(recordGameAtom, { level, won: false, time: get(timeAtom) });
  }

  const { rows, cols } = get(gameLevelDetailAtom);
  set(activeLevelAtom, get(gameLevelAtom));
  set(boardAtom, generateBoards(rows, cols));
  set(timeAtom, 0);
  set(isBoardPlayableAtom, false);
  set(lastGameResultAtom, null);
  set(gameStateAtom, GameStates.Playing);
});

export const revealCellAtom = atom(
  null,
  (get, set, { row, col }: CellLocation) => {
    let board = get(boardAtom);
    if (!board || get(gameStateAtom) !== GameStates.Playing) return;
    if (board[row][col].isFlagged) return;

    // Mines are placed on the first reveal so the first click is always safe.
    if (!get(isBoardPlayableAtom)) {
      const safeRadius = get(isNoGuessingModeAtom) ? 1 : 0;
      board = placeMines(
        board,
        get(gameLevelDetailAtom).mineCount,
        { row, col },
        safeRadius
      );
      set(isBoardPlayableAtom, true);
    }

    const result = revealCell(board, row, col);
    if (result.hasMine) {
      set(boardAtom, result.board);
      finishGame(get, set, false);
    } else if (isBoardClear(result.board)) {
      set(boardAtom, flagAllMines(result.board));
      finishGame(get, set, true);
    } else if (result.board !== get(boardAtom)) {
      set(boardAtom, result.board);
    }
  }
);

export const toggleFlagAtom = atom(
  null,
  (get, set, { row, col }: CellLocation) => {
    const board = get(boardAtom);
    if (!board || get(gameStateAtom) !== GameStates.Playing) return;
    const next = flagCell(board, row, col, get(useQuestionMarksAtom));
    if (next !== board) set(boardAtom, next);
  }
);

export const togglePauseAtom = atom(null, (get, set) => {
  const gameState = get(gameStateAtom);
  if (gameState === GameStates.Playing) set(gameStateAtom, GameStates.Paused);
  else if (gameState === GameStates.Paused)
    set(gameStateAtom, GameStates.Playing);
});

export const pauseGameAtom = atom(null, (get, set) => {
  if (get(gameStateAtom) === GameStates.Playing && get(isBoardPlayableAtom))
    set(gameStateAtom, GameStates.Paused);
});
