import { GameStates, MINE_ADJECTION_CELL_WITH_COLOR } from "@app/config";
import { gameStateAtom } from "@app/stores";
import { Cell as ICell } from "@app/types";
import { useAtomValue } from "jotai";

interface Props {
  cell: ICell;
}

export const CellContent: React.FC<Props> = ({ cell }) => {
  const gameState = useAtomValue(gameStateAtom);
  if (gameState == GameStates.Lost && cell.hasMine) return <span>💣</span>;
  if (!cell.isRevealed) return "";
  if (cell.adjacentMines) {
    let RenderCellContent = MINE_ADJECTION_CELL_WITH_COLOR[cell.adjacentMines];
    return <RenderCellContent />;
  }
  return "";
};
