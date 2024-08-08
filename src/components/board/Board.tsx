import { Cell } from "@app/components";
import { useCellActions } from "@app/hooks";
import { boardAtom, gameLevelDetailAtom } from "@app/stores";
import { useAtomValue } from "jotai";

export const Board = () => {
  const board = useAtomValue(boardAtom);
  const { rows, cols } = useAtomValue(gameLevelDetailAtom);

  const { handleCellClick, handleCellRightClick } = useCellActions();

  return (
    <div
      className="grid gap-0.5"
      style={{
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {board?.flat().map((cell) => (
        <Cell
          key={`cell-${cell.row}-${cell.col}-${cell.isFlagged}-${cell.isRevealed}`}
          cell={cell}
          handleCellClick={handleCellClick}
          handleCellRightClick={handleCellRightClick}
        />
      ))}
    </div>
  );
};
