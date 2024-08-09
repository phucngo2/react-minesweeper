import { GameStates } from "@app/config";
import { gameStateAtom } from "@app/stores";
import { useAtomValue } from "jotai";
import ImgNun from "@app/assets/nun.jpg";

export const PauseOverlay = () => {
  const gameState = useAtomValue(gameStateAtom);
  if (gameState != GameStates.Paused) return <></>;
  return (
    <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full p-4 z-5 bg-neutral card">
      <img src={ImgNun} className="rounded-lg w-full max-w-[240px]" />
      <div className="mt-2 font-semibold">🦌 NUN!</div>
    </div>
  );
};
