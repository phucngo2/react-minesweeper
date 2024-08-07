import { ButtonPause, ButtonPlay, Timer } from "@app/components";
import { GameStates } from "@app/config";
import { gameStateAtom } from "@app/stores";
import { useAtomValue } from "jotai";

export const Header = () => {
  const gameState = useAtomValue(gameStateAtom);

  return (
    <div className="flex flex-row items-center justify-between gap-3 font-semibold">
      <div className="flex flex-row items-center gap-2.5 card bg-neutral px-3 p-2">
        <button className="w-10 h-10 min-h-0 text-xl btn">⚙️</button>
        <ButtonPlay />
      </div>
      {gameState != GameStates.New && (
        <div className="flex flex-row items-center gap-2.5 card bg-neutral px-3 p-2">
          <Timer />
          <ButtonPause />
        </div>
      )}
    </div>
  );
};
