import { MINE_COUNT_DIRECTIONS } from "@app/config";
import { Cell, CellLocation, RevealCellResult } from "@app/types";

// All handlers are immutable: unchanged cells keep their object reference,
// so memoized <Cell /> components only re-render when their own cell changes.

//#region Public game functions

export const generateBoards = (rows: number, cols: number): Cell[][] =>
  Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,
      hasMine: false,
      isRevealed: false,
      isFlagged: false,
      isQuestioned: false,
      isExploded: false,
      adjacentMines: 0,
    }))
  );

/**
 * Places mines while keeping every cell within `safeRadius` of `safeCell` free.
 * A radius of 0 guarantees a safe first click, 1 guarantees an opening.
 */
export const placeMines = (
  board: Cell[][],
  mineCount: number,
  safeCell: CellLocation,
  safeRadius: number
): Cell[][] => {
  const { rows, cols } = getBoardDimensions(board);
  const candidates: number[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const isSafe =
        Math.abs(row - safeCell.row) <= safeRadius &&
        Math.abs(col - safeCell.col) <= safeRadius;
      if (!isSafe) candidates.push(row * cols + col);
    }
  }

  // Partial Fisher-Yates shuffle: O(mineCount), no rejection sampling
  const count = Math.min(mineCount, candidates.length);
  const mines = new Uint8Array(rows * cols);
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(Math.random() * (candidates.length - i));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    mines[candidates[i]] = 1;
  }

  return board.map((rowCells, row) =>
    rowCells.map((cell, col) => {
      let adjacentMines = 0;
      for (const [dirRow, dirCol] of MINE_COUNT_DIRECTIONS) {
        const r = row + dirRow;
        const c = col + dirCol;
        if (!isInvalidCoordinate(r, c, rows, cols) && mines[r * cols + c])
          adjacentMines++;
      }
      return { ...cell, hasMine: mines[row * cols + col] === 1, adjacentMines };
    })
  );
};

export const revealCell = (
  board: Cell[][],
  row: number,
  col: number
): RevealCellResult => {
  const cell = board[row][col];
  if (cell.isFlagged) return { board, hasMine: false };
  if (cell.isRevealed) {
    return cell.adjacentMines
      ? chordCell(board, row, col)
      : { board, hasMine: false };
  }
  if (cell.hasMine) return { board: explode(board, [cell]), hasMine: true };

  const draft = createDraft(board);
  floodReveal(draft, row, col);
  return { board: draft.next, hasMine: false };
};

/** Cycles: hidden -> flag -> question mark (if enabled) -> hidden */
export const flagCell = (
  board: Cell[][],
  row: number,
  col: number,
  useQuestionMarks: boolean
): Cell[][] => {
  const cell = board[row][col];
  if (cell.isRevealed) return board;

  let patch: Partial<Cell>;
  if (cell.isFlagged) {
    patch = { isFlagged: false, isQuestioned: useQuestionMarks };
  } else if (cell.isQuestioned) {
    patch = { isQuestioned: false };
  } else {
    patch = { isFlagged: true };
  }

  const draft = createDraft(board);
  draft.update(row, col, patch);
  return draft.next;
};

/** Toggles a single mark (no cycling); placing one mark clears the other. */
export const markCell = (
  board: Cell[][],
  row: number,
  col: number,
  mark: "flag" | "question"
): Cell[][] => {
  const cell = board[row][col];
  if (cell.isRevealed) return board;

  const patch: Partial<Cell> =
    mark === "flag"
      ? { isFlagged: !cell.isFlagged, isQuestioned: false }
      : { isQuestioned: !cell.isQuestioned, isFlagged: false };

  const draft = createDraft(board);
  draft.update(row, col, patch);
  return draft.next;
};

export const isBoardClear = (board: Cell[][]): boolean =>
  board.every((rowCells) =>
    rowCells.every((cell) => cell.hasMine || cell.isRevealed)
  );

/** Flags every remaining mine, as Minesweeper does on a win. */
export const flagAllMines = (board: Cell[][]): Cell[][] =>
  board.map((rowCells) =>
    rowCells.map((cell) =>
      cell.hasMine && !cell.isFlagged
        ? { ...cell, isFlagged: true, isQuestioned: false }
        : cell
    )
  );

export const countFlags = (board: Cell[][]): number => {
  let count = 0;
  for (const rowCells of board) {
    for (const cell of rowCells) if (cell.isFlagged) count++;
  }
  return count;
};

//#endregion
//#region Private functions

interface Draft {
  next: Cell[][];
  update: (row: number, col: number, patch: Partial<Cell>) => void;
}

/** Copy-on-write board: only rows that are touched get cloned. */
function createDraft(board: Cell[][]): Draft {
  const next = board.slice();
  const copiedRows = new Uint8Array(board.length);
  return {
    next,
    update(row, col, patch) {
      if (!copiedRows[row]) {
        next[row] = next[row].slice();
        copiedRows[row] = 1;
      }
      next[row][col] = { ...next[row][col], ...patch };
    },
  };
}

function floodReveal(draft: Draft, row: number, col: number) {
  const { next } = draft;
  const { rows, cols } = getBoardDimensions(next);
  const visited = new Uint8Array(rows * cols);
  const stack: number[] = [row * cols + col];
  visited[row * cols + col] = 1;

  while (stack.length > 0) {
    const index = stack.pop()!;
    const currentRow = Math.floor(index / cols);
    const currentCol = index % cols;
    const cell = next[currentRow][currentCol];

    // Revealed zero cells keep flooding to open neighbours that were wrongly
    // flagged and later un-flagged.
    if (cell.hasMine || cell.isFlagged || (cell.isRevealed && cell.adjacentMines))
      continue;

    if (!cell.isRevealed) {
      draft.update(currentRow, currentCol, {
        isRevealed: true,
        isQuestioned: false,
      });
    }

    if (cell.adjacentMines !== 0) continue;

    for (const [dirRow, dirCol] of MINE_COUNT_DIRECTIONS) {
      const r = currentRow + dirRow;
      const c = currentCol + dirCol;
      if (isInvalidCoordinate(r, c, rows, cols) || visited[r * cols + c])
        continue;
      visited[r * cols + c] = 1;
      stack.push(r * cols + c);
    }
  }
}

function chordCell(board: Cell[][], row: number, col: number): RevealCellResult {
  const { rows, cols } = getBoardDimensions(board);
  const hiddenNeighbours: Cell[] = [];
  let flagCount = 0;

  for (const [dirRow, dirCol] of MINE_COUNT_DIRECTIONS) {
    const r = row + dirRow;
    const c = col + dirCol;
    if (isInvalidCoordinate(r, c, rows, cols)) continue;
    const neighbour = board[r][c];
    if (neighbour.isFlagged) flagCount++;
    else if (!neighbour.isRevealed) hiddenNeighbours.push(neighbour);
  }

  if (flagCount !== board[row][col].adjacentMines || !hiddenNeighbours.length)
    return { board, hasMine: false };

  const hitMines = hiddenNeighbours.filter((cell) => cell.hasMine);
  if (hitMines.length) return { board: explode(board, hitMines), hasMine: true };

  const draft = createDraft(board);
  for (const cell of hiddenNeighbours) floodReveal(draft, cell.row, cell.col);
  return { board: draft.next, hasMine: false };
}

/** Reveals all mines and wrong flags, marking the mines that were hit. */
function explode(board: Cell[][], hitMines: Cell[]): Cell[][] {
  const hit = new Set(hitMines);
  return board.map((rowCells) =>
    rowCells.map((cell) => {
      if (cell.hasMine && !cell.isFlagged)
        return { ...cell, isRevealed: true, isExploded: hit.has(cell) };
      if (cell.isFlagged && !cell.hasMine) return { ...cell, isRevealed: true };
      return cell;
    })
  );
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

//#endregion
