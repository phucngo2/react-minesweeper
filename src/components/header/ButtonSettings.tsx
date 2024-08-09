import { ModalSettings } from "@app/components";
import { GameStates } from "@app/config";
import { gameStateAtom, isGamePlayingAtom } from "@app/stores";
import { useAtomValue, useSetAtom } from "jotai";
import { useRef } from "react";

export const ButtonSettings = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const setGameState = useSetAtom(gameStateAtom);
  const isPlaying = useAtomValue(isGamePlayingAtom);

  const handleClick = () => {
    dialogRef.current?.showModal();
    if (isPlaying) {
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
