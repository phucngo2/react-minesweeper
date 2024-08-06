import { CellContent } from "@app/components";
import { Cell as ICell } from "@app/types";
import { memo } from "react";

interface Props {
  cell: ICell;
  handleCellClick: (cell: ICell) => void;
  handleCellRightClick: (cell: ICell) => void;
}

export const Cell: React.FC<Props> = memo(
  ({ cell, handleCellClick, handleCellRightClick }) => {
    return (
      <button
        style={{
          opacity: cell.isRevealed ? 0.69 : 1,
        }}
        className="w-6 h-6 p-1 btn min-w-6 min-h-6"
        onClick={() => handleCellClick(cell)}
        onContextMenu={(e) => {
          e.preventDefault();
          handleCellRightClick(cell);
        }}
      >
        <CellContent
          isFlagged={cell.isFlagged}
          hasMine={cell.hasMine}
          isRevealed={cell.isRevealed}
          adjacentMines={cell.adjacentMines}
        />
      </button>
    );
  }
);
