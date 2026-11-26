import {
  ButtonFlagMode,
  ButtonPause,
  ButtonPlay,
  ButtonSettings,
  ButtonStats,
  FlagCount,
  Timer,
} from "@app/components";
import { isGameNewAtom } from "@app/stores";
import { useAtomValue } from "jotai";

export const Header = () => {
  const isNewGame = useAtomValue(isGameNewAtom);
  return (
    // z-10: frosted panels create stacking contexts, so lift the header (and its tooltips) above the board
    <div className="relative z-10 flex flex-row flex-wrap items-center justify-between gap-3 font-semibold">
      <div className="flex flex-row items-center gap-2.5 card card-header frosted px-3 p-2">
        <ButtonSettings />
        <ButtonStats />
        <ButtonPlay />
        {!isNewGame && <FlagCount />}
      </div>
      {!isNewGame && (
        <div className="flex flex-row items-center gap-2.5 card card-header frosted px-3 p-2">
          <Timer />
          <ButtonPause />
          <ButtonFlagMode />
        </div>
      )}
    </div>
  );
};
