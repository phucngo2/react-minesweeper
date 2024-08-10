import { GameStates } from "@app/config";
import { flagCell, isBoardClear, revealCell } from "@app/handlers";
import { useNoGuessingAction } from "@app/hooks";
import {
  boardAtom,
  flagCountAtom,
  gameStateAtom,
  isBoardPlayableAtom,
} from "@app/stores";
import { GameStatesType, Cell as ICell, RevealCellResult } from "@app/types";
import { useSetAtom } from "jotai";
import { useCallback } from "react";

export const useCellActions = () => {
  const setBoard = useSetAtom(boardAtom);
  const setGameState = useSetAtom(gameStateAtom);
  const setFlagCount = useSetAtom(flagCountAtom);

  const setIsBoardPlayable = useSetAtom(isBoardPlayableAtom);
  const { handleNoGuessingModeFirstMove } = useNoGuessingAction();

  // Eliminate the use of atom values to ensure that functions do not
  // depend on them and do not re-generate when those values change.
  // This approach prevents redundant re-renders.
  const handleCellClick = useCallback(
    (cell: ICell) => {
      setIsBoardPlayable((isBoardPlayable) => {
        if (!isBoardPlayable) {
          handleNoGuessingModeFirstMove(cell);
          return true;
        }
        return isBoardPlayable;
      });
      setGameState((gameState) => {
        if (gameState !== GameStates.Playing || cell.isFlagged)
          return gameState;

        let newGameState: GameStatesType = gameState;

        setBoard((board) => {
          const revealCellResult: RevealCellResult = revealCell(
            board!,
            cell.row,
            cell.col
          );
          if (revealCellResult.hasMine) {
            newGameState = GameStates.Lost;
          }
          if (isBoardClear(revealCellResult.board)) {
            newGameState = GameStates.Won;
          }
          if (revealCellResult.needUpdateBoard)
            return [...revealCellResult.board];
          return board;
        });

        return newGameState;
      });
    },
    [setBoard, setGameState, setIsBoardPlayable, handleNoGuessingModeFirstMove]
  );

  const handleCellRightClick = useCallback(
    (cell: ICell) => {
      setGameState((gameState) => {
        if (gameState !== GameStates.Playing || cell.isRevealed)
          return gameState;

        setFlagCount((flagCount) => {
          let flagChanged = cell.isFlagged ? 1 : -1;
          if (flagChanged + flagCount < 0) return flagCount;

          // The value of `cell.isFlagged` will change after the `flagCell` function is called.
          // cell.isFlagged = false
          setBoard((board) => [...flagCell(board!, cell.row, cell.col)]);
          // cell.isFlagged = true
          return flagCount + flagChanged;
        });

        return gameState;
      });
    },
    [setBoard, setGameState, setFlagCount]
  );

  return { handleCellClick, handleCellRightClick };
};
