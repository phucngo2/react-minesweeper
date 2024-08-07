import { GameStates } from "@app/config";
import { gameStateAtom } from "@app/stores";
import { useAtomValue } from "jotai";

interface Props {
  children: React.ReactNode;
}

export const Card: React.FC<Props> = ({ children }) => {
  const gameState = useAtomValue(gameStateAtom);
  if (gameState == GameStates.New) return <></>;
  return <div className="p-3 bg-neutral card">{children}</div>;
};
