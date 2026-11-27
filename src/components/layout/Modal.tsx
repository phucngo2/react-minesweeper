import { Fragment, useEffect, useRef, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// Content mounts on open (fresh each time, so forms reset) and stays mounted
// through the closing transition so the box doesn't collapse while fading out.
export const Modal: React.FC<Props> = ({ open, onClose, children }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [content, setContent] = useState({ open, mounted: open, key: 0 });

  if (open !== content.open) {
    setContent((prev) => ({
      open,
      mounted: open || prev.mounted,
      key: open ? prev.key + 1 : prev.key,
    }));
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
      return;
    }
    if (dialog.open) dialog.close();

    // Unmount once the exit transitions finish (immediately if there are none)
    let cancelled = false;
    Promise.allSettled(
      dialog.getAnimations({ subtree: true }).map((a) => a.finished)
    ).then(() => {
      if (cancelled) return;
      setContent((prev) => (prev.open ? prev : { ...prev, mounted: false }));
    });
    return () => {
      cancelled = true;
    };
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
      <div className="modal-box">
        {content.mounted && <Fragment key={content.key}>{children}</Fragment>}
      </div>
      {/* Modal backdrop to handle close when click outside */}
      <form method="dialog" className="modal-backdrop">
        <button type="submit">close</button>
      </form>
    </dialog>
  );
};
