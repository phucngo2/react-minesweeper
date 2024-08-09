import { CellContent } from "@app/components";
import { isBoardPlayableAtom } from "@app/stores";
import { Cell as ICell } from "@app/types";
import { useAtomValue } from "jotai";
import { memo } from "react";

interface Props {
  cell: ICell;
  handleCellClick: (cell: ICell) => void;
  handleCellRightClick: (cell: ICell) => void;
  handleNoGuessingModeFirstMove: (cell: ICell) => void;
}

export const Cell: React.FC<Props> = memo(
  ({
    handleCellClick,
    handleCellRightClick,
    handleNoGuessingModeFirstMove,
    cell,
  }) => {
    const isBoardPlayable = useAtomValue(isBoardPlayableAtom);
    return (
      <button
        style={{
          opacity: cell.isRevealed ? 0.6 : 1,
        }}
        className="w-[26px] h-[26px] p-1 btn min-w-6 min-h-6"
        onClick={() => {
          if (!isBoardPlayable) {
            handleNoGuessingModeFirstMove(cell);
          }
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
