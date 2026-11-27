import type { NoGuessRequest } from "../workers/no-guess.worker";
import type { NoGuessBoard } from "./no-guess";

let activeWorker: Worker | null = null;

/**
 * Generates a no-guess board off the main thread. Starting a new request
 * terminates the previous one, so only the latest game's board is built.
 */
export const requestNoGuessBoard = (
  request: NoGuessRequest
): Promise<NoGuessBoard> => {
  activeWorker?.terminate();
  const worker = new Worker(
    new URL("../workers/no-guess.worker.ts", import.meta.url),
    { type: "module" }
  );
  activeWorker = worker;

  return new Promise((resolve, reject) => {
    const finish = () => {
      worker.terminate();
      if (activeWorker === worker) activeWorker = null;
    };
    worker.onmessage = ({ data }: MessageEvent<NoGuessBoard>) => {
      finish();
      resolve(data);
    };
    worker.onerror = (error) => {
      finish();
      reject(error);
    };
    worker.postMessage(request);
  });
};

/** Stops any in-flight generation (e.g. when No Guessing Mode is turned off). */
export const cancelNoGuessBoard = () => {
  activeWorker?.terminate();
  activeWorker = null;
};
