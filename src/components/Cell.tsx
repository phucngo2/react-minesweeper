import { CellContent } from "@app/components";
import { GameStates } from "@app/config";
import { revealCell } from "@app/handlers";
import { boardAtom, gameStateAtom } from "@app/stores";
import { Cell as ICell } from "@app/types";
import { useAtom } from "jotai";

interface Props {
  cell: ICell;
}

export const Cell: React.FC<Props> = ({ cell }) => {
  const [board, setBoard] = useAtom(boardAtom);
  const [gameState, setGameState] = useAtom(gameStateAtom);

  const handleCellClick = () => {
    let cellDisabled = gameState != "Playing" || cell.isRevealed;
    if (cellDisabled) return;

    if (cell.hasMine) return setGameState(GameStates.Lost);
    if (board) setBoard(revealCell(board, cell.row, cell.col));
  };

  return (
    <button
      style={{
        opacity: cell.isRevealed ? 0.69 : 1,
      }}
      className="w-6 h-6 p-1 btn min-w-6 min-h-6"
      onClick={handleCellClick}
    >
      <CellContent cell={cell} />
    </button>
  );
};
