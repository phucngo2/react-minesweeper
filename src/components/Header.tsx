import { gameStateAtom } from "@app/stores";
import { useAtomValue } from "jotai";

export const Header = () => {
  const gameState = useAtomValue(gameStateAtom);

  return (
    <div className="flex flex-row items-center justify-between gap-4 font-semibold">
      <div className="flex flex-row items-center gap-2.5">
        <button className="w-10 h-10 min-h-0 btn">⚙️</button>
        <button className="w-10 h-10 min-h-0 btn">🙂</button>
        <div>{gameState}</div>
      </div>
      <div>00:00</div>
    </div>
  );
};
