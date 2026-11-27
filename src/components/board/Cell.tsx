import { CellContent } from "@app/components";
import { Cell as ICell } from "@app/types";
import { memo } from "react";

export type CellHandlers = Pick<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | "onPointerDown"
  | "onPointerMove"
  | "onPointerUp"
  | "onPointerCancel"
  | "onPointerLeave"
  | "onClick"
  | "onKeyDown"
  | "onContextMenu"
  | "onAuxClick"
>;

interface Props {
  cell: ICell;
  handlers: CellHandlers;
  /** No Guessing Mode start cell (until the first move) */
  isStart?: boolean;
  /** Changes when the player clicks elsewhere first, replaying the marker pop */
  startHint?: number;
}

// Green ✕ like other no-guess Minesweeper sites, outlined for any tile color
const StartMarker = () => (
  <svg viewBox="0 0 16 16" className="start-marker" aria-hidden>
    <path d="M4 4l8 8M12 4l-8 8" className="start-marker-outline" />
    <path d="M4 4l8 8M12 4l-8 8" className="start-marker-cross" />
  </svg>
);

const getLabel = (cell: ICell) => {
  if (cell.isFlagged) return "Flagged";
  if (cell.isQuestioned) return "Question mark";
  if (!cell.isRevealed) return "Hidden";
  if (cell.hasMine) return "Mine";
  return cell.adjacentMines ? `${cell.adjacentMines}` : "Empty";
};

const BASE_CLASS = "cell size-[26px] p-1 btn border-0";

const getStateClass = (cell: ICell) => {
  if (cell.isExploded) return "cell-exploded";
  if (cell.isRevealed) {
    if (cell.isFlagged) return "cell-wrong-flag";
    if (cell.hasMine) return "cell-mine";
    return "cell-revealed";
  }
  if (cell.isFlagged) return "cell-flagged";
  if (cell.isQuestioned) return "cell-questioned";
  return "cell-hidden";
};

const getClassName = (cell: ICell) => `${BASE_CLASS} ${getStateClass(cell)}`;

// `handlers` is a stable object from <Board />, so this only re-renders when
// its own (immutable) cell object or start-marker props change.
export const Cell = memo(({ cell, handlers, isStart, startHint }: Props) => {
  const showStart = isStart && !cell.isFlagged && !cell.isQuestioned;
  const label = `Row ${cell.row + 1}, column ${cell.col + 1}: ${getLabel(cell)}`;
  return (
    <button
      type="button"
      {...handlers}
      className={`${getClassName(cell)}${isStart ? " cell-start" : ""}`}
      data-row={cell.row}
      data-col={cell.col}
      aria-label={isStart ? `${label}, start here` : label}
    >
      {showStart ? <StartMarker key={startHint} /> : <CellContent cell={cell} />}
    </button>
  );
});
