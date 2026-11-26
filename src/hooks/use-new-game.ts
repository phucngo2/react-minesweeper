import { newGameAtom } from "@app/stores";
import { useSetAtom } from "jotai";

export const useNewGame = () => {
  const newGame = useSetAtom(newGameAtom);
  return { newGame };
};
