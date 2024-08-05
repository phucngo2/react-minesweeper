import { MINE_ADJECTION_CELL_WITH_COLOR } from "@app/config";
import { revealCell } from "@app/handlers";
import { boardAtom } from "@app/stores";
import { Cell as ICell } from "@app/types";
import { useAtom } from "jotai";
import { useMemo } from "react";

interface Props {
  cell: ICell;
}

export const Cell: React.FC<Props> = ({ cell }) => {
  const [board, setBoard] = useAtom(boardAtom);

  let renderContent = useMemo(() => {
    if (cell.hasMine) return <span>💣</span>;
    if (cell.adjacentMines) {
      let RenderCell = MINE_ADJECTION_CELL_WITH_COLOR[cell.adjacentMines];
      return <RenderCell />;
    }
    return "";
  }, [cell]);

  return (
    <button
      style={{
        opacity: cell.isRevealed ? 0.5 : 1,
      }}
      className="w-6 h-6 p-1 btn min-w-6 min-h-6"
      onClick={() => {
        if (board) setBoard(revealCell(board, cell.row, cell.col));
      }}
    >
      {renderContent}
    </button>
  );
};
