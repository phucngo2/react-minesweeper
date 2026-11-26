import { ADJACENT_MINE_COLORS } from "@app/config";
import { Cell as ICell } from "@app/types";

interface Props {
  cell: ICell;
}

// Debug renderer: shows every cell as if revealed.
export const CellContent = ({ cell }: Props) => {
  const { isFlagged, hasMine, adjacentMines } = cell;
  if (isFlagged && !hasMine) return <span>🏳️</span>;
  if (isFlagged) return <span>🚩</span>;
  if (hasMine) return <span>💣</span>;
  if (adjacentMines)
    return (
      <span className={ADJACENT_MINE_COLORS[adjacentMines]}>
        {adjacentMines}
      </span>
    );
  return null;
};
