import { ModalSettings } from "@app/components";
import { GameStates } from "@app/config";
import { gameStateAtom } from "@app/stores";
import { useAtom } from "jotai";
import { useRef } from "react";

export const ButtonSettings = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [gameState, setGameState] = useAtom(gameStateAtom);

  const handleClick = () => {
    dialogRef.current?.showModal();
    if (gameState === GameStates.Playing) {
      setGameState(GameStates.Paused);
    }
  };

  return (
    <>
      <div className="tooltip tooltip-bottom" data-tip="Settings">
        <button onClick={handleClick} className="w-10 h-10 min-h-0 text-xl btn">
          ⚙️
        </button>
      </div>
      <ModalSettings ref={dialogRef} />
    </>
  );
};
