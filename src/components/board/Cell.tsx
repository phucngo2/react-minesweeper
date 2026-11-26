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

const BASE_CLASS =
  "w-[26px] h-[26px] p-1 btn min-w-6 min-h-6 border-0 shadow-none";

const getClassName = (cell: ICell) => {
  if (cell.isExploded) return `${BASE_CLASS} bg-error hover:bg-error`;
  if (cell.isRevealed) return `${BASE_CLASS} bg-base-100 hover:bg-base-100`;
  return `${BASE_CLASS} bg-primary/60 hover:bg-primary/80`;
};

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
