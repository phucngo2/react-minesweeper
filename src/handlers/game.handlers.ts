import { MINE_COUNT_DIRECTIONS } from "@app/config";
import { Cell } from "@app/types";

export const generateBoards = (rows: number, cols: number): Cell[][] => {
  const board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      hasMine: false,
      isRevealed: false,
      adjacentMines: 0,
    }))
  );
  return board;
};

export const placeMines = (board: Cell[][], mineCount: number) => {
  let rows = board.length;
  let cols = board[0].length;
  let minesToPlace = mineCount;
  while (minesToPlace > 0) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (!board[row][col].hasMine) {
      board[row][col].hasMine = true;
      minesToPlace--;
    }
  }
  return board;
};

export const calculateAdjacentMines = (board: Cell[][]) => {
  let rows = board.length;
  let cols = board[0].length;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (board[row][col].hasMine) continue;

      let count = 0;
      for (const [dirRow, dirCol] of MINE_COUNT_DIRECTIONS) {
        const rowToCheck = row + dirRow;
        const colToCheck = col + dirCol;
        if (rowToCheck < 0 || rowToCheck >= rows) continue;
        if (colToCheck < 0 || colToCheck >= cols) continue;
        if (board[rowToCheck][colToCheck].hasMine) count++;
      }
      board[row][col].adjacentMines = count;
    }
  }
  return board;
};
