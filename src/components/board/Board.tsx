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
          // The cell should re-render when these properties change.
          key={`cell-${cell.row}-${cell.col}-${cell.isFlagged}-${cell.isRevealed}`}
          // NOTE: The reference to the `cell` object and these two functions should remain the same.
          cell={cell}
          handleCellClick={handleCellClick}
          handleCellRightClick={handleCellRightClick}
        />
      ))}
    </div>
  );
};
