import { GameStates } from "@app/config";
import { gameStateAtom } from "@app/stores";
import { useAtomValue } from "jotai";
import ImgNun from "@app/assets/nun.jpg";

export const PauseOverlay = () => {
  const gameState = useAtomValue(gameStateAtom);
  if (gameState != GameStates.Paused) return <></>;
  return (
    <div className="absolute inset-0 z-5 flex flex-col items-center justify-center p-4 pause-veil board-card">
      <img
        src={ImgNun}
        alt=""
        className="w-full max-w-60 rounded-lg shadow-lg"
      />
      <div className="mt-3 font-semibold">🦌 NUN!</div>
      <div className="text-sm text-(--label-secondary)">
        Paused
      </div>
    </div>
  );
};
