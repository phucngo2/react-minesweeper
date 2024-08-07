import { GameStates } from "@app/config";
import { gameStateAtom } from "@app/stores";
import { useAtomValue } from "jotai";

export const PauseOverlay = () => {
  const gameState = useAtomValue(gameStateAtom);
  if (gameState != GameStates.Paused) return <></>;
  return (
    <div className="absolute top-0 left-0 z-10 flex items-center justify-center w-full h-full text-6xl opacity-15 bg-neutral-content card"></div>
  );
};
