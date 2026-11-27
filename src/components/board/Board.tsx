import { Cell, CellHandlers } from "@app/components";
import { LONG_PRESS_MS } from "@app/config";
import { useCellActions } from "@app/hooks";
import {
  boardAtom,
  isBoardPlayableAtom,
  noGuessLayoutAtom,
  startHintAtom,
  tapModeAtom,
} from "@app/stores";
import { CellLocation } from "@app/types";
import { useAtomValue } from "jotai";
import { useMemo, useRef } from "react";

const MOVE_TOLERANCE_PX = 10;

const getCellLocation = (el: HTMLElement): CellLocation => ({
  row: Number(el.dataset.row),
  col: Number(el.dataset.col),
});

export const Board = () => {
  const board = useAtomValue(boardAtom);
  const tapMode = useAtomValue(tapModeAtom);
  const isPlayable = useAtomValue(isBoardPlayableAtom);
  const noGuessLayout = useAtomValue(noGuessLayoutAtom);
  const startHint = useAtomValue(startHintAtom);
  const { revealCell, toggleFlag, markCell } = useCellActions();
  // No Guessing Mode: marked cell the game must start from
  const start = !isPlayable && noGuessLayout ? noGuessLayout.start : null;

  // Latest values for the stable handlers below
  const latestRef = useRef({ board, tapMode });
  latestRef.current = { board, tapMode };

  const pressRef = useRef({
    timer: 0,
    x: 0,
    y: 0,
    fired: false,
    pointerType: "mouse",
  });

  // One stable handler set shared by every cell, so memoized cells don't re-render.
  const handlers = useMemo<CellHandlers>(() => {
    const isRevealed = ({ row, col }: CellLocation) =>
      !!latestRef.current.board?.[row][col].isRevealed;

    const primaryAction = (location: CellLocation) => {
      const { tapMode } = latestRef.current;
      if (tapMode !== "dig" && !isRevealed(location))
        markCell({ ...location, mark: tapMode });
      else revealCell(location);
    };

    const secondaryAction = (location: CellLocation) => {
      if (latestRef.current.tapMode !== "dig") revealCell(location);
      else toggleFlag(location);
    };

    const cancelLongPress = () => {
      window.clearTimeout(pressRef.current.timer);
      pressRef.current.timer = 0;
    };

    return {
      onPointerDown: (e) => {
        const press = pressRef.current;
        press.pointerType = e.pointerType;
        press.fired = false;
        const location = getCellLocation(e.currentTarget);

        // Middle click chords, like Microsoft Minesweeper
        if (e.button === 1) {
          e.preventDefault();
          if (isRevealed(location)) revealCell(location);
          return;
        }

        if (e.pointerType !== "touch") return;
        press.x = e.clientX;
        press.y = e.clientY;
        cancelLongPress();
        press.timer = window.setTimeout(() => {
          press.timer = 0;
          press.fired = true;
          navigator.vibrate?.(25);
          secondaryAction(location);
        }, LONG_PRESS_MS);
      },
      onPointerMove: (e) => {
        const press = pressRef.current;
        if (
          press.timer &&
          Math.hypot(e.clientX - press.x, e.clientY - press.y) >
            MOVE_TOLERANCE_PX
        )
          cancelLongPress();
      },
      onPointerUp: cancelLongPress,
      onPointerCancel: cancelLongPress,
      onPointerLeave: cancelLongPress,
      onClick: (e) => {
        if (pressRef.current.fired) {
          pressRef.current.fired = false;
          return;
        }
        primaryAction(getCellLocation(e.currentTarget));
      },
      onKeyDown: (e) => {
        // Enter/Space already click the focused cell; F toggles a flag.
        if (e.key === "f" || e.key === "F")
          toggleFlag(getCellLocation(e.currentTarget));
      },
      onContextMenu: (e) => {
        e.preventDefault();
        // Touch long-press is handled by the pointer timer above
        if (pressRef.current.pointerType === "touch") return;
        secondaryAction(getCellLocation(e.currentTarget));
      },
      onAuxClick: (e) => e.preventDefault(),
    };
  }, [revealCell, toggleFlag, markCell]);

  if (!board) return null;
  const rows = board.length;
  const cols = board[0].length;

  return (
    <div
      className="board grid gap-0.5"
      style={{
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
    >
      {board.map((rowCells) =>
        rowCells.map((cell) => {
          const isStart = start?.row === cell.row && start.col === cell.col;
          return (
            <Cell
              key={`${cell.row}-${cell.col}`}
              cell={cell}
              handlers={handlers}
              isStart={isStart}
              startHint={isStart ? startHint : 0}
            />
          );
        })
      )}
    </div>
  );
};
