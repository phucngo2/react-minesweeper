import { ButtonPlay, Timer } from "@app/components";
import { GameStates } from "@app/config";
import { gameStateAtom } from "@app/stores";
import { useAtomValue } from "jotai";

export const Header = () => {
  const gameState = useAtomValue(gameStateAtom);

  return (
    <div className="flex flex-row items-center justify-between gap-4 font-semibold">
      <div className="flex flex-row items-center gap-2.5">
        <button className="w-10 h-10 min-h-0 btn">⚙️</button>
        <ButtonPlay />
        <div>{gameState}</div>
      </div>
      <div className="flex flex-row items-center gap-2.5">
        {gameState != GameStates.New && <Timer />}
      </div>
    </div>
  );
};
