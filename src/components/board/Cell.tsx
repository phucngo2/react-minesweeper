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
}

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
// its own (immutable) cell object changes.
export const Cell = memo(({ cell, handlers }: Props) => (
  <button
    type="button"
    {...handlers}
    className={getClassName(cell)}
    data-row={cell.row}
    data-col={cell.col}
    aria-label={`Row ${cell.row + 1}, column ${cell.col + 1}: ${getLabel(cell)}`}
  >
    <CellContent cell={cell} />
  </button>
));
