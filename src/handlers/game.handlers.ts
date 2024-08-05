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
