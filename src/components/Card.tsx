import { GameStates } from "@app/config";
import { gameStateAtom } from "@app/stores";
import { useAtomValue } from "jotai";
import { PauseOverlay } from "./PauseOverlay";

interface Props {
  children: React.ReactNode;
}

export const Card: React.FC<Props> = ({ children }) => {
  const gameState = useAtomValue(gameStateAtom);
  if (gameState == GameStates.New) return <></>;
  return (
    <div className="relative p-3 bg-neutral card">
      {children}
      <PauseOverlay />
    </div>
  );
};
