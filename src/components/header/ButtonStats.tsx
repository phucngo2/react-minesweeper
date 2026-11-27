import { ModalStats } from "@app/components";
import { pauseGameAtom } from "@app/stores";
import { useSetAtom } from "jotai";
import { useState } from "react";

export const ButtonStats = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pauseGame = useSetAtom(pauseGameAtom);

  const handleClick = () => {
    pauseGame();
    setIsOpen(true);
  };

  return (
    <>
      <div className="tooltip tooltip-bottom" data-tip="Statistics">
        <button
          onClick={handleClick}
          className="btn size-10 text-xl"
          aria-label="Statistics"
        >
          📊
        </button>
      </div>
      <ModalStats open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
