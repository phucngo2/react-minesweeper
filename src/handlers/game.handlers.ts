import { MINE_COUNT_DIRECTIONS } from "@app/config";
import { Cell, CountFlagResult, RevealCellResult } from "@app/types";

//#region Public game functions

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
  const { rows, cols } = getBoardDimensions(board);
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
  const { rows, cols } = getBoardDimensions(board);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const currentCell: Cell = board[row][col];
      if (currentCell.hasMine) continue;

      let count: number = 0;
      for (const [dirRow, dirCol] of MINE_COUNT_DIRECTIONS) {
        const rowToCheck: number = row + dirRow;
        const colToCheck: number = col + dirCol;
        // Null pointer
        if (isInvalidCoordinate(rowToCheck, colToCheck, rows, cols)) continue;

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
): RevealCellResult => {
  const cell: Cell = board[row][col];
  if (cell.hasMine)
    return {
      hasMine: true,
      board,
    };
  if (cell.isRevealed && cell.adjacentMines)
    return revealNumberAdjacentCell(board, row, col);
  if (cell.isFlagged)
    return {
      hasMine: false,
      board,
    };
  return {
    hasMine: false,
    board: revealCellIterative(board, row, col),
  };
};

export const revealNumberAdjacentCell = (
  board: Cell[][],
  row: number,
  col: number
): RevealCellResult => {
  const cell: Cell = board[row][col];
  let countFlagsResult: CountFlagResult = countFlags(board, row, col);
  if (cell.adjacentMines != countFlagsResult.flagCount)
    return {
      board,
      hasMine: false,
    };

  const { rows, cols } = getBoardDimensions(board);
  for (const [dirRow, dirCol] of MINE_COUNT_DIRECTIONS) {
    const rowToCheck: number = row + dirRow;
    const colToCheck: number = col + dirCol;
    // Null pointer
    if (isInvalidCoordinate(rowToCheck, colToCheck, rows, cols)) continue;

    board = revealCellIterative(board, rowToCheck, colToCheck);
  }

  return {
    hasMine: countFlagsResult.hasFalseNegative,
    board,
  };
};

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

export const isBoardClear = (board: Cell[][]): boolean => {
  const { rows, cols } = getBoardDimensions(board);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell: Cell = board[row][col];
      if (!cell.hasMine && !cell.isRevealed) {
        return false;
      }
    }
  }

  return true;
};

//#endregion
//#region Private functions

// @ts-ignore
function revealCellRecursive(
  board: Cell[][],
  row: number,
  col: number
): Cell[][] {
  const { rows, cols } = getBoardDimensions(board);
  // Null pointer
  if (isInvalidCoordinate(row, col, rows, cols)) return board;

  const cell: Cell = board[row][col];
  if (cell.isRevealed || cell.hasMine || cell.isFlagged) return board;
  cell.isRevealed = true;
  if (cell.adjacentMines === 0) {
    for (const [dirRow, dirCol] of MINE_COUNT_DIRECTIONS) {
      board = revealCellRecursive(board, row + dirRow, col + dirCol);
    }
  }
  return board;
}

function revealCellIterative(
  board: Cell[][],
  row: number,
  col: number
): Cell[][] {
  const { rows, cols } = getBoardDimensions(board);
  const stack: [number, number][] = [];
  const visited: Set<string> = new Set();

  // Null pointer
  if (isInvalidCoordinate(row, col, rows, cols)) return board;

  stack.push([row, col]);
  visited.add(getCellUniqueId(row, col));

  while (stack.length > 0) {
    const [currentRow, currentCol] = stack.pop()!;
    const cell = board[currentRow][currentCol];

    if (cell.hasMine || cell.isFlagged) continue;

    cell.isRevealed = true;

    if (cell.adjacentMines === 0) {
      for (const [dirRow, dirCol] of MINE_COUNT_DIRECTIONS) {
        const newRow = currentRow + dirRow;
        const newCol = currentCol + dirCol;
        const cellUniqueId = getCellUniqueId(newRow, newCol);
        if (
          !isInvalidCoordinate(newRow, newCol, rows, cols) &&
          !visited.has(cellUniqueId)
        ) {
          stack.push([newRow, newCol]);
          visited.add(cellUniqueId);
        }
      }
    }
  }

  return board;
}

function countFlags(
  board: Cell[][],
  row: number,
  col: number
): CountFlagResult {
  const { rows, cols } = getBoardDimensions(board);
  let flagCount: number = 0;
  let hasFalseNegative: boolean = false;
  for (const [dirRow, dirCol] of MINE_COUNT_DIRECTIONS) {
    const rowToCheck: number = row + dirRow;
    const colToCheck: number = col + dirCol;
    // Null pointer
    if (isInvalidCoordinate(rowToCheck, colToCheck, rows, cols)) continue;

    const cellToCheck: Cell = board[rowToCheck][colToCheck];
    if (cellToCheck.isFlagged) {
      flagCount++;
      if (!cellToCheck.hasMine) {
        hasFalseNegative = true;
      }
    }
  }
  return {
    flagCount,
    hasFalseNegative,
  };
}

function getBoardDimensions(board: Cell[][]) {
  return {
    rows: board.length,
    cols: board[0].length,
  };
}

function isInvalidCoordinate(
  row: number,
  col: number,
  rows: number,
  cols: number
) {
  return row < 0 || row >= rows || col < 0 || col >= cols;
}

function getCellUniqueId(row: number, col: number) {
  return `${row}-${col}`;
}

//#endregion
