import { MINE_COUNT_DIRECTIONS } from "@app/config";
import {
  Cell,
  CellLocation,
  CountFlagResult,
  RevealCellResult,
} from "@app/types";

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
  return placeMinesOnBoard(board, mineCount);
};

export const placeMinesNoGuessing = (
  board: Cell[][],
  mineCount: number,
  reservedCell: CellLocation
) => {
  const reservedCells = new Set<string>([
    getCellUniqueId(reservedCell.row, reservedCell.col),
    ...MINE_COUNT_DIRECTIONS.map(([dirRow, dirCol]) =>
      getCellUniqueId(reservedCell.row + dirRow, reservedCell.col + dirCol)
    ),
  ]);

  return placeMinesOnBoard(board, mineCount, reservedCells);
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
  // Cell has mine => Game lost
  if (cell.hasMine)
    return {
      board,
      hasMine: true,
      needUpdateBoard: true,
    };
  // Flagged cell
  if (cell.isFlagged)
    return {
      board,
      hasMine: false,
      needUpdateBoard: false,
    };
  // Chording
  if (cell.isRevealed && cell.adjacentMines)
    return revealNumberAdjacentCell(board, row, col);
  // Normal cell
  return revealCellIterative(board, row, col);
};

export const flagCell = (
  board: Cell[][],
  row: number,
  col: number
): Cell[][] => {
  const cell: Cell = board[row][col];
  if (cell.isRevealed) return board;

  cell.isFlagged = !cell.isFlagged;
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
): RevealCellResult {
  const { rows, cols } = getBoardDimensions(board);
  // Null pointer
  if (isInvalidCoordinate(row, col, rows, cols))
    return {
      board,
      needUpdateBoard: false,
      hasMine: false,
    };

  const stack: [number, number][] = [[row, col]];
  const visited = new Set<string>([getCellUniqueId(row, col)]);
  let needUpdateBoard = false;

  while (stack.length > 0) {
    const [currentRow, currentCol] = stack.pop()!;
    const cell = board[currentRow][currentCol];

    // Use `(cell.adjacentMines && cell.isRevealed)` instead of `cell.isRevealed`
    // to handle cases where the player unflags a cell that was previously incorrectly flagged
    // near a chording cell or an empty cell.
    if (
      cell.hasMine ||
      cell.isFlagged ||
      (cell.adjacentMines && cell.isRevealed)
    )
      continue;

    if (!cell.isRevealed) {
      cell.isRevealed = true;
      needUpdateBoard = true;
    }

    if (cell.adjacentMines === 0) {
      for (const [dirRow, dirCol] of MINE_COUNT_DIRECTIONS) {
        const newRow = currentRow + dirRow;
        const newCol = currentCol + dirCol;
        const cellUniqueId = getCellUniqueId(newRow, newCol);

        // Ensure the new cell is within bounds and has not been visited
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

  return {
    board,
    needUpdateBoard,
    hasMine: false,
  };
}

function revealNumberAdjacentCell(
  board: Cell[][],
  row: number,
  col: number
): RevealCellResult {
  const cell: Cell = board[row][col];
  let countFlagsResult: CountFlagResult = countFlags(board, row, col);
  if (cell.adjacentMines != countFlagsResult.flagCount)
    return {
      board,
      hasMine: false,
      needUpdateBoard: false,
    };

  let needUpdateBoard = false;

  const { rows, cols } = getBoardDimensions(board);
  for (const [dirRow, dirCol] of MINE_COUNT_DIRECTIONS) {
    const rowToCheck: number = row + dirRow;
    const colToCheck: number = col + dirCol;
    // Null pointer
    if (isInvalidCoordinate(rowToCheck, colToCheck, rows, cols)) continue;

    const result = revealCellIterative(board, rowToCheck, colToCheck);
    board = result.board;
    needUpdateBoard = result.needUpdateBoard || needUpdateBoard;
  }

  return {
    board,
    hasMine: countFlagsResult.hasFalseNegative,
    needUpdateBoard,
  };
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

function placeMinesOnBoard(
  board: Cell[][],
  mineCount: number,
  reservedCells?: Set<string>
): Cell[][] {
  const { rows, cols } = getBoardDimensions(board);
  let minesToPlace: number = mineCount;
  while (minesToPlace > 0) {
    const row: number = Math.floor(Math.random() * rows);
    const col: number = Math.floor(Math.random() * cols);

    if (reservedCells?.has(getCellUniqueId(row, col))) {
      continue;
    }

    const cell: Cell = board[row][col];
    if (!cell.hasMine) {
      cell.hasMine = true;
      minesToPlace--;
    }
  }
  return board;
}

//#endregion
