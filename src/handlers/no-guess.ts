// No Guessing Mode: a logic-only solver and a generator that only accepts
// boards the solver can clear from a marked start cell without guessing.
// Pure and dependency-free so it can run inside a Web Worker.

export interface NoGuessBoard {
  /** 1 = mine, indexed by row * cols + col */
  mines: Uint8Array;
  /** Index of the start cell (always opens an area) */
  start: number;
  /** False only when no no-guess board was found within the time limit */
  solvable: boolean;
}

const UNKNOWN = 0;
const REVEALED = 1;
const MINE = 2;

// Backtracking budget per frontier component before it's treated as unknown
const MAX_SEARCH_NODES = 50_000;
// Mine moves tried on one layout before starting over with a fresh one
const MAX_MOVES_PER_LAYOUT = 400;

type Neighbors = Int32Array[];

const buildNeighbors = (rows: number, cols: number): Neighbors => {
  const neighbors: Neighbors = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const list: number[] = [];
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const r = row + dr;
          const c = col + dc;
          if ((dr || dc) && r >= 0 && r < rows && c >= 0 && c < cols)
            list.push(r * cols + c);
        }
      }
      neighbors.push(Int32Array.from(list));
    }
  }
  return neighbors;
};

interface Constraint {
  cells: number[];
  /** Mines still to be found among `cells` */
  remaining: number;
}

interface SolveResult {
  solved: boolean;
  state: Uint8Array;
}

/**
 * Plays the board from `start` using deduction only: single-cell rules, the
 * subset rule, then exact enumeration of the frontier (with the global mine
 * count). Returns whether every safe cell was revealed.
 */
export const solve = (
  mines: Uint8Array,
  start: number,
  neighbors: Neighbors
): SolveResult => {
  const n = mines.length;
  const counts = new Uint8Array(n);
  let mineTotal = 0;
  for (let i = 0; i < n; i++) {
    if (!mines[i]) continue;
    mineTotal++;
    for (const j of neighbors[i]) counts[j]++;
  }

  const state = new Uint8Array(n);
  let revealedCount = 0;
  let minesLeft = mineTotal;
  const safeTotal = n - mineTotal;

  const reveal = (index: number) => {
    const stack = [index];
    while (stack.length) {
      const i = stack.pop()!;
      if (state[i] !== UNKNOWN) continue;
      state[i] = REVEALED;
      revealedCount++;
      if (counts[i] === 0) for (const j of neighbors[i]) stack.push(j);
    }
  };
  const markMine = (i: number) => {
    if (state[i] !== UNKNOWN) return;
    state[i] = MINE;
    minesLeft--;
  };

  const buildConstraints = (): Constraint[] => {
    const constraints: Constraint[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < n; i++) {
      if (state[i] !== REVEALED || counts[i] === 0) continue;
      const cells: number[] = [];
      let flagged = 0;
      for (const j of neighbors[i]) {
        if (state[j] === UNKNOWN) cells.push(j);
        else if (state[j] === MINE) flagged++;
      }
      if (!cells.length) continue;
      const key = cells.join(",");
      if (seen.has(key)) continue;
      seen.add(key);
      constraints.push({ cells, remaining: counts[i] - flagged });
    }
    return constraints;
  };

  /** Reveals/marks a set of cells; returns true if anything changed */
  const resolve = (cells: number[], remaining: number): boolean => {
    if (remaining === 0) {
      cells.forEach(reveal);
      return true;
    }
    if (remaining === cells.length) {
      cells.forEach(markMine);
      return true;
    }
    return false;
  };

  const basicPass = (constraints: Constraint[]) => {
    let progress = false;
    for (const { cells, remaining } of constraints) {
      const open = cells.filter((c) => state[c] === UNKNOWN);
      if (open.length !== cells.length) continue; // stale after earlier moves
      if (resolve(open, remaining)) progress = true;
    }
    return progress;
  };

  const subsetPass = (constraints: Constraint[]) => {
    const byCell = new Map<number, number[]>();
    constraints.forEach(({ cells }, index) => {
      for (const c of cells) {
        const list = byCell.get(c);
        if (list) list.push(index);
        else byCell.set(c, [index]);
      }
    });
    const inA = new Uint8Array(n);
    for (let a = 0; a < constraints.length; a++) {
      const A = constraints[a];
      for (const c of A.cells) inA[c] = 1;
      const checked = new Set<number>();
      for (const c of A.cells) {
        for (const b of byCell.get(c)!) {
          if (b === a || checked.has(b)) continue;
          checked.add(b);
          const B = constraints[b];
          if (B.cells.length <= A.cells.length) continue;
          let overlap = 0;
          for (const x of B.cells) overlap += inA[x];
          if (overlap !== A.cells.length) continue; // A is not a subset of B
          const diff = B.cells.filter((x) => !inA[x]);
          if (resolve(diff, B.remaining - A.remaining)) {
            for (const x of A.cells) inA[x] = 0;
            return true;
          }
        }
      }
      for (const c of A.cells) inA[c] = 0;
    }
    return false;
  };

  const enumerationPass = (constraints: Constraint[]) => {
    // Group frontier cells into independent components
    const parent = constraints.map((_, i) => i);
    const find = (x: number): number =>
      parent[x] === x ? x : (parent[x] = find(parent[x]));
    const owner = new Map<number, number>();
    constraints.forEach(({ cells }, index) => {
      for (const c of cells) {
        const other = owner.get(c);
        if (other === undefined) owner.set(c, index);
        else parent[find(other)] = find(index);
      }
    });
    const groups = new Map<number, number[]>();
    constraints.forEach((_, index) => {
      const root = find(index);
      const list = groups.get(root);
      if (list) list.push(index);
      else groups.set(root, [index]);
    });

    let interior = 0;
    for (let i = 0; i < n; i++)
      if (state[i] === UNKNOWN && !owner.has(i)) interior++;

    interface Component {
      cells: number[];
      /** feasible[k]: some arrangement uses exactly k mines */
      feasible: Uint8Array;
      /** canMine[cell * (size + 1) + k] / canSafe[...] */
      canMine: Uint8Array;
      canSafe: Uint8Array;
      exact: boolean;
    }

    const components: Component[] = [];
    for (const indexes of groups.values()) {
      const cellSet = new Set<number>();
      for (const index of indexes)
        for (const c of constraints[index].cells) cellSet.add(c);
      const cells = [...cellSet];
      const size = cells.length;
      const local = new Map(cells.map((c, i) => [c, i]));
      const cellConstraints: number[][] = cells.map(() => []);
      const remaining = indexes.map((index) => constraints[index].remaining);
      const unassigned = indexes.map((index) => constraints[index].cells.length);
      const assigned = indexes.map(() => 0);
      indexes.forEach((index, k) => {
        for (const c of constraints[index].cells)
          cellConstraints[local.get(c)!].push(k);
      });

      const feasible = new Uint8Array(size + 1);
      const canMine = new Uint8Array(size * (size + 1));
      const canSafe = new Uint8Array(size * (size + 1));
      const values = new Int8Array(size);
      let nodes = 0;
      let aborted = false;

      const search = (pos: number, used: number) => {
        if (aborted) return;
        if (++nodes > MAX_SEARCH_NODES) {
          aborted = true;
          return;
        }
        if (pos === size) {
          feasible[used] = 1;
          for (let i = 0; i < size; i++) {
            if (values[i]) canMine[i * (size + 1) + used] = 1;
            else canSafe[i * (size + 1) + used] = 1;
          }
          return;
        }
        for (const value of [0, 1]) {
          if (value && used >= minesLeft) continue;
          let ok = true;
          for (const k of cellConstraints[pos]) {
            const mines = assigned[k] + value;
            const left = unassigned[k] - 1;
            if (mines > remaining[k] || mines + left < remaining[k]) {
              ok = false;
              break;
            }
          }
          if (!ok) continue;
          values[pos] = value;
          for (const k of cellConstraints[pos]) {
            assigned[k] += value;
            unassigned[k]--;
          }
          search(pos + 1, used + value);
          for (const k of cellConstraints[pos]) {
            assigned[k] -= value;
            unassigned[k]++;
          }
        }
      };
      search(0, 0);

      if (aborted) {
        // Too large to enumerate: assume anything is possible (no deductions)
        feasible.fill(1);
        canMine.fill(1);
        canSafe.fill(1);
      }
      components.push({ cells, feasible, canMine, canSafe, exact: !aborted });
    }

    // Achievable mine totals for a list of components (bitset over counts)
    const sums = (list: Component[]) => {
      let reachable = new Uint8Array(minesLeft + 1);
      reachable[0] = 1;
      for (const { feasible } of list) {
        const next = new Uint8Array(minesLeft + 1);
        for (let s = 0; s <= minesLeft; s++) {
          if (!reachable[s]) continue;
          for (let k = 0; k < feasible.length && s + k <= minesLeft; k++)
            if (feasible[k]) next[s + k] = 1;
        }
        reachable = next;
      }
      return reachable;
    };
    const fits = (total: number) =>
      total <= minesLeft && minesLeft - total <= interior;

    // Collect deductions first: applying them mid-loop would change minesLeft
    // under the components still being evaluated.
    const safeCells: number[] = [];
    const mineCells: number[] = [];
    components.forEach((component, ci) => {
      if (!component.exact) return;
      const others = sums(components.filter((_, i) => i !== ci));
      const size = component.cells.length;
      const kFits = new Uint8Array(size + 1);
      for (let k = 0; k <= size; k++) {
        if (!component.feasible[k]) continue;
        for (let s = 0; s <= minesLeft; s++) {
          if (others[s] && fits(s + k)) {
            kFits[k] = 1;
            break;
          }
        }
      }
      component.cells.forEach((cell, i) => {
        if (state[cell] !== UNKNOWN) return;
        let mineOk = false;
        let safeOk = false;
        for (let k = 0; k <= size; k++) {
          if (!kFits[k]) continue;
          if (component.canMine[i * (size + 1) + k]) mineOk = true;
          if (component.canSafe[i * (size + 1) + k]) safeOk = true;
        }
        if (!mineOk && safeOk) safeCells.push(cell);
        else if (mineOk && !safeOk) mineCells.push(cell);
      });
    });
    safeCells.forEach(reveal);
    mineCells.forEach(markMine);
    const progress = safeCells.length > 0 || mineCells.length > 0;
    if (progress || interior === 0) return progress;

    // Cells away from the frontier: decided only by the global mine count
    const totals = sums(components);
    let minLeft = Infinity;
    let maxLeft = -Infinity;
    for (let s = 0; s <= minesLeft; s++) {
      if (!totals[s] || !fits(s)) continue;
      minLeft = Math.min(minLeft, minesLeft - s);
      maxLeft = Math.max(maxLeft, minesLeft - s);
    }
    if (maxLeft === 0 || minLeft === interior) {
      for (let i = 0; i < n; i++) {
        if (state[i] !== UNKNOWN || owner.has(i)) continue;
        if (maxLeft === 0) reveal(i);
        else markMine(i);
      }
      return true;
    }
    return false;
  };

  reveal(start);
  while (revealedCount < safeTotal) {
    const constraints = buildConstraints();
    if (basicPass(constraints)) continue;
    if (subsetPass(constraints)) continue;
    if (enumerationPass(constraints)) continue;
    break;
  }
  return { solved: revealedCount === safeTotal, state };
};

/**
 * Generates a board solvable without guessing from its start cell. Stuck
 * layouts are repaired by moving a mine off the stuck frontier, which converges
 * much faster than regenerating, even on dense boards.
 */
export const generateNoGuessBoard = (
  rows: number,
  cols: number,
  mineCount: number,
  timeLimitMs = 5000,
  random: () => number = Math.random
): NoGuessBoard => {
  const n = rows * cols;
  const neighbors = buildNeighbors(rows, cols);
  const deadline = Date.now() + timeLimitMs;
  const pick = <T>(list: T[]) => list[Math.floor(random() * list.length)];
  let fallback: NoGuessBoard | null = null;

  do {
    // Keep the start off the edges when possible so it opens a bigger area
    const row = rows > 2 ? 1 + Math.floor(random() * (rows - 2)) : 0;
    const col = cols > 2 ? 1 + Math.floor(random() * (cols - 2)) : 0;
    const start = row * cols + col;
    const safeZone = new Uint8Array(n);
    safeZone[start] = 1;
    for (const j of neighbors[start]) safeZone[j] = 1;

    const candidates: number[] = [];
    for (let i = 0; i < n; i++) if (!safeZone[i]) candidates.push(i);
    const mines = new Uint8Array(n);
    const count = Math.min(mineCount, candidates.length);
    for (let i = 0; i < count; i++) {
      const j = i + Math.floor(random() * (candidates.length - i));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
      mines[candidates[i]] = 1;
    }

    for (let move = 0; move <= MAX_MOVES_PER_LAYOUT; move++) {
      const { solved, state } = solve(mines, start, neighbors);
      if (solved) return { mines, start, solvable: true };
      fallback = { mines: mines.slice(), start, solvable: false };
      if (Date.now() > deadline) break;

      // Move one mine from the stuck frontier to unexplored territory
      const frontierMines: number[] = [];
      const targets: number[] = [];
      for (let i = 0; i < n; i++) {
        if (state[i] !== UNKNOWN) continue;
        const touchesRevealed = neighbors[i].some((j) => state[j] === REVEALED);
        if (touchesRevealed && mines[i]) frontierMines.push(i);
        else if (!touchesRevealed && !mines[i] && !safeZone[i]) targets.push(i);
      }
      if (!frontierMines.length || !targets.length) break;
      mines[pick(frontierMines)] = 0;
      mines[pick(targets)] = 1;
    }
  } while (Date.now() <= deadline);

  return fallback!;
};
