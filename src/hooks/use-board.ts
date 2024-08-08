import { boardAtom } from "@app/stores";
import { Cell } from "@app/types";
import { useAtom } from "jotai";
import { useCallback } from "react";

/**
 * @deprecated Use boardAtom instead
 */
// @ts-ignore
const useBoard = () => {
  const [board, _setBoard] = useAtom(boardAtom);

  const setBoard = useCallback((state: Cell[][]) => {
    _setBoard(JSON.parse(JSON.stringify(state)));
  }, []);

  return { board, setBoard };
};
