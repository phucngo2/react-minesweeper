import { useEffect, useRef } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// Content only mounts while open, so forms start fresh each time.
export const Modal: React.FC<Props> = ({ open, onClose, children }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClose={(e) => {
        // React propagates `close` to ancestors; ignore nested dialogs closing.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-box">{open && children}</div>
      {/* Modal backdrop to handle close when click outside */}
      <form method="dialog" className="modal-backdrop">
        <button type="submit">close</button>
      </form>
    </dialog>
  );
};
