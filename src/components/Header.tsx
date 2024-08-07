import {
  ButtonPause,
  ButtonPlay,
  ButtonSettings,
  FlagCount,
  Timer,
} from "@app/components";
import { GameStates } from "@app/config";
import { gameStateAtom } from "@app/stores";
import { useAtomValue } from "jotai";

export const Header = () => {
  const gameState = useAtomValue(gameStateAtom);

  const isNewGame = gameState == GameStates.New;
  return (
    <div className="flex flex-row items-center justify-between gap-3 font-semibold">
      <div className="flex flex-row items-center gap-2.5 card bg-neutral px-3 p-2">
        <ButtonSettings />
        <ButtonPlay />
        {!isNewGame && <FlagCount />}
      </div>
      {!isNewGame && (
        <div className="flex flex-row items-center gap-2.5 card bg-neutral px-3 p-2">
          <Timer />
          <ButtonPause />
        </div>
      )}
    </div>
  );
};
