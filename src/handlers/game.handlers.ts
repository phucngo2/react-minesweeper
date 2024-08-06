import { MINE_COUNT_DIRECTIONS } from "@app/config";
import { Cell } from "@app/types";

export const generateBoards = (rows: number, cols: number): Cell[][] => {
  const board = Array.from({ length: rows }, (_, row: number) =>
    Array.from({ length: cols }, (_, col: number) => ({
      row,
      col,
      hasMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  );
  return board;
};

export const placeMines = (board: Cell[][], mineCount: number) => {
  const rows: number = board.length;
  const cols: number = board[0].length;
  let minesToPlace: number = mineCount;
  while (minesToPlace > 0) {
    const row: number = Math.floor(Math.random() * rows);
    const col: number = Math.floor(Math.random() * cols);
    const cell: Cell = board[row][col];
    if (!cell.hasMine) {
      cell.hasMine = true;
      minesToPlace--;
    }
  }
  return board;
};

export const calculateAdjacentMines = (board: Cell[][]) => {
  const rows: number = board.length;
  const cols: number = board[0].length;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const currentCell: Cell = board[row][col];
      if (currentCell.hasMine) continue;

      let count: number = 0;
      for (const [dirRow, dirCol] of MINE_COUNT_DIRECTIONS) {
        const rowToCheck: number = row + dirRow;
        const colToCheck: number = col + dirCol;
        // Null pointer
        if (rowToCheck < 0 || rowToCheck >= rows) continue;
        if (colToCheck < 0 || colToCheck >= cols) continue;

        if (board[rowToCheck][colToCheck].hasMine) count++;
      }
      currentCell.adjacentMines = count;
    }
  }
  return board;
};

export const revealCell = (
  board: Cell[][],
  row: number,
  col: number
): Cell[][] => {
  const cell: Cell = board[row][col];
  if (cell.isRevealed || cell.isFlagged) return board;
  return revealCellRecursive(board, row, col);
};

function revealCellRecursive(
  board: Cell[][],
  row: number,
  col: number
): Cell[][] {
  const rows: number = board.length;
  const cols: number = board[0].length;
  // Null pointer
  if (row < 0 || row >= rows) return board;
  if (col < 0 || col >= cols) return board;

  const cell: Cell = board[row][col];
  if (cell.isRevealed || cell.hasMine || cell.isFlagged) return board;
  cell.isRevealed = true;
  if (cell.adjacentMines === 0) {
    for (const [dirRow, dirCol] of MINE_COUNT_DIRECTIONS) {
      revealCellRecursive(board, row + dirRow, col + dirCol);
    }
  }
  return board;
}

export const flagCell = (
  board: Cell[][],
  row: number,
  col: number
): Cell[][] => {
  const cell: Cell = board[row][col];
  if (cell.isRevealed) return board;
  const futureFlag = !cell.isFlagged;
  cell.isFlagged = futureFlag;
  return board;
};
