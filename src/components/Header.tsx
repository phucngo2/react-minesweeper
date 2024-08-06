import { gameStateAtom } from "@app/stores";
import { useAtomValue } from "jotai";

export const Header = () => {
  const gameState = useAtomValue(gameStateAtom);

  return <div className="font-semibold">{gameState}</div>;
};
