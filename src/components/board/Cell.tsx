import { CellContent } from "@app/components";
import { Cell as ICell } from "@app/types";
import { memo } from "react";

interface Props {
  cell: ICell;
  handleCellClick: (cell: ICell) => void;
  handleCellRightClick: (cell: ICell) => void;
}

export const Cell: React.FC<Props> = memo(
  ({ handleCellClick, handleCellRightClick, cell }) => {
    return (
      <button
        style={{
          opacity: cell.isRevealed ? 0.6 : 1,
        }}
        className="w-[26px] h-[26px] p-1 btn min-w-6 min-h-6"
        onClick={() => {
          handleCellClick(cell);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          handleCellRightClick(cell);
        }}
      >
        <CellContent cell={cell} />
      </button>
    );
  }
);
