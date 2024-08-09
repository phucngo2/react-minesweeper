import { GameStates } from "@app/config";
import {
  calculateAdjacentMines,
  generateBoards,
  placeMines,
} from "@app/handlers";
import {
  boardAtom,
  flagCountAtom,
  gameLevelDetailAtom,
  gameStateAtom,
  isBoardPlayableAtom,
  isNoGuessingModeAtom,
  timeAtom,
} from "@app/stores";
import { Cell, GameLevelSetting } from "@app/types";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";

interface NewGameConfig extends GameLevelSetting {
  isNoGuessingMode?: boolean;
}

export const useNewGame = () => {
  const gameLevelDetail = useAtomValue(gameLevelDetailAtom);
  const isNoGuessingMode = useAtomValue(isNoGuessingModeAtom);
  const setGameState = useSetAtom(gameStateAtom);
  const setFlagCount = useSetAtom(flagCountAtom);
  const setBoard = useSetAtom(boardAtom);
  const setSeconds = useSetAtom(timeAtom);
  const setIsBoardPlayable = useSetAtom(isBoardPlayableAtom);

  const startGame = useCallback(
    (board: Cell[][], mineCount: number, playable: boolean) => {
      setBoard(board);
      setFlagCount(mineCount);
      setSeconds(0);
      setGameState(GameStates.Playing);
      setIsBoardPlayable(playable);
    },
    [setBoard, setFlagCount, setSeconds, setGameState, setIsBoardPlayable]
  );

  const createBoard = useCallback(
    (config?: GameLevelSetting, includeMines: boolean = true) => {
      const { rows, cols, mineCount } = config || gameLevelDetail;
      const board = generateBoards(rows, cols);
      if (includeMines) {
        placeMines(board, mineCount);
      }
      return calculateAdjacentMines(board);
    },
    [gameLevelDetail]
  );

  const newGame = useCallback(
    (config?: NewGameConfig) => {
      const isNoGuessing =
        config?.isNoGuessingMode != null
          ? config.isNoGuessingMode
          : isNoGuessingMode;
      const newBoard = createBoard(config, !isNoGuessing);
      startGame(
        newBoard,
        config?.mineCount || gameLevelDetail.mineCount,
        !isNoGuessing
      );
    },
    [createBoard, gameLevelDetail, startGame, isNoGuessingMode]
  );

  return { newGame };
};
