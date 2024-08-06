import { MINE_ADJECTION_CELL_WITH_COLOR } from "@app/config";
import { Cell as ICell } from "@app/types";

interface Props {
  cell: ICell;
}

export const CellContent: React.FC<Props> = ({ cell }) => {
  if (cell.hasMine) return <span>💣</span>;
  if (cell.adjacentMines) {
    let RenderCell = MINE_ADJECTION_CELL_WITH_COLOR[cell.adjacentMines];
    return <RenderCell />;
  }
  return "";
};
