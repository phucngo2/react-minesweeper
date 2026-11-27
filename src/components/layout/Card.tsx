import { GeneratingOverlay, PauseOverlay } from "@app/components";
import { isGameNewAtom, noGuessLayoutAtom } from "@app/stores";
import { useAtomValue } from "jotai";

interface Props {
  children: React.ReactNode;
}

export const Card: React.FC<Props> = ({ children }) => {
  const isNewGame = useAtomValue(isGameNewAtom);
  const noGuessLayout = useAtomValue(noGuessLayoutAtom);
  if (isNewGame) return <></>;
  return (
    <div className="relative p-3 frosted board-card w-fit">
      {children}
      {noGuessLayout && !noGuessLayout.solvable && (
        // w-0 + min-w-full: wrap to the board's width instead of widening it
        <p className="w-0 min-w-full mt-2 text-xs text-center text-(--label-secondary)">
          No no-guess layout was found in time, so this board may need a guess.
        </p>
      )}
      <GeneratingOverlay />
      <PauseOverlay />
    </div>
  );
};
