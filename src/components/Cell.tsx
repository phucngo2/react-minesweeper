import { MINE_ADJECTION_CELL_WITH_COLOR } from "@app/config";
import { Cell as ICell } from "@app/types";
import { useMemo } from "react";

interface Props {
  cell: ICell;
}

export const Cell: React.FC<Props> = ({ cell }) => {
  let renderContent = useMemo(() => {
    if (cell.hasMine) return <span>💣</span>;
    if (cell.adjacentMines) {
      let RenderCell = MINE_ADJECTION_CELL_WITH_COLOR[cell.adjacentMines];
      return <RenderCell />;
    }
    return "";
  }, [cell]);

  return (
    <button className="w-6 h-6 p-1 btn min-w-6 min-h-6">{renderContent}</button>
  );
};
