import { ModalSettings } from "@app/components";
import { pauseGameAtom } from "@app/stores";
import { useSetAtom } from "jotai";
import { useState } from "react";

export const ButtonSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pauseGame = useSetAtom(pauseGameAtom);

  const handleClick = () => {
    pauseGame();
    setIsOpen(true);
  };

  return (
    <>
      <div className="tooltip tooltip-bottom" data-tip="Settings">
        <button
          onClick={handleClick}
          className="w-10 h-10 min-h-0 text-xl btn"
          aria-label="Settings"
        >
          ⚙️
        </button>
      </div>
      <ModalSettings open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
