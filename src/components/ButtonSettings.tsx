import { useRef } from "react";

export const ButtonSettings = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleClick = () => {
    dialogRef.current?.showModal();
  };

  return (
    <>
      <div className="tooltip tooltip-bottom" data-tip="Settings">
        <button onClick={handleClick} className="w-10 h-10 min-h-0 text-xl btn">
          ⚙️
        </button>
      </div>
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
        {/* Modal backdrop to handle close when click outside */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};
