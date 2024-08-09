import { MINE_ADJECTION_CELL_WITH_COLOR } from "@app/config";
import { isGameLostAtom } from "@app/stores";
import { Cell as ICell } from "@app/types";
import { useAtomValue } from "jotai";
import { memo } from "react";

interface Props {
  cell: ICell;
}

export const CellContent: React.FC<Props> = memo(({ cell }) => {
  const isGameLost = useAtomValue(isGameLostAtom);
  const { isFlagged, hasMine, isRevealed, adjacentMines } = cell;

  // Render LOST game state
  if (isGameLost) {
    // 🏳️ Wrong flags
    if (isFlagged && !hasMine) return <span>🏳️</span>;
    // 🚩 Correct flags
    if (isFlagged) return <span>🚩</span>;
    // 🤯 Mine
    if (hasMine) return <span>💣</span>;
  }

  // Redner PLAYING game state
  // 🚩 Flagged
  if (isFlagged) return <span>🚩</span>;
  // 🫣 Not revealed yet
  if (!isRevealed) return <></>;
  // 1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣ Numbered cells
  if (adjacentMines) {
    let RenderCellContent = MINE_ADJECTION_CELL_WITH_COLOR[adjacentMines];
    return <RenderCellContent />;
  }
  // 😶 Revealed but no adjacent mine
  return <></>;
});
