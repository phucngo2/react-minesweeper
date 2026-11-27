import { generateNoGuessBoard } from "../handlers/no-guess";

export interface NoGuessRequest {
  rows: number;
  cols: number;
  mineCount: number;
}

self.onmessage = ({ data }: MessageEvent<NoGuessRequest>) => {
  const board = generateNoGuessBoard(data.rows, data.cols, data.mineCount);
  self.postMessage(board, { transfer: [board.mines.buffer] });
};
