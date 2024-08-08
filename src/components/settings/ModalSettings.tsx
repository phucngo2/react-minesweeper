import { forwardRef, useRef } from "react";
import { SettingsGameLevels, SettingsGameLevelsHandle } from "@app/components";
import { useNewGame } from "@app/hooks";

export const ModalSettings = forwardRef<HTMLDialogElement>((_props, ref) => {
  const settingsGameLevelsRef = useRef<SettingsGameLevelsHandle>(null);
  const newGame = useNewGame();

  const handleSave = () => {
    const gameLevelSetting =
      settingsGameLevelsRef.current?.handleSaveGameLevel();
    newGame(gameLevelSetting);
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <SettingsGameLevels ref={settingsGameLevelsRef} />
        <p className="mt-8 text-sm">
          The settings will take effect when you click{" "}
          <span className="underline">Save and Restart</span>
        </p>
        {/* Modal action to handle close when click button */}
        <div className="mt-3 modal-action">
          <form method="dialog">
            <div className="flex flex-row items-center justify-end gap-4">
              <button className="h-10 min-h-10 btn">Close</button>
              <button
                onClick={handleSave}
                className="h-10 btn btn-secondary min-h-10"
              >
                Save and Restart
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Modal backdrop to handle close when click outside */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});
