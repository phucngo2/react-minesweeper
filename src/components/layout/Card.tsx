import { PauseOverlay } from "@app/components";
import { isGameNewAtom } from "@app/stores";
import { useAtomValue } from "jotai";

interface Props {
  children: React.ReactNode;
}

export const Card: React.FC<Props> = ({ children }) => {
  const isNewGame = useAtomValue(isGameNewAtom);
  if (isNewGame) return <></>;
  return (
    <div className="relative p-3 bg-neutral card w-fit">
      {children}
      <PauseOverlay />
    </div>
  );
};
