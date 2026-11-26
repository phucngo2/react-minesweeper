import { ADJACENT_MINE_COLORS } from "@app/config";
import { Cell as ICell } from "@app/types";

interface Props {
  cell: ICell;
}

export const CellContent = ({ cell }: Props) => {
  const { isFlagged, isQuestioned, hasMine, isRevealed, adjacentMines } = cell;

  // 🏳️ Wrong flag (revealed on loss)
  if (isFlagged && isRevealed) return <span>🏳️</span>;
  // 🚩 Flagged
  if (isFlagged) return <span>🚩</span>;
  // ❓ Question mark
  if (isQuestioned && !isRevealed) return <span>❓</span>;
  // 🫣 Not revealed yet
  if (!isRevealed) return null;
  // � Mine that was hit / 💣 other mines (revealed on loss)
  if (hasMine) return <span>{cell.isExploded ? "💥" : "💣"}</span>;
  // 1️⃣-8️⃣ Numbered cells
  if (adjacentMines)
    return (
      <span className={ADJACENT_MINE_COLORS[adjacentMines]}>
        {adjacentMines}
      </span>
    );
  // 😶 Revealed but no adjacent mine
  return null;
};
