import { forwardRef, useRef } from "react";
import {
  SettingGameLevels,
  SettingGameLevelsHandle,
  SettingNoGuessing,
  SettingNoGuessingHandle,
} from "@app/components";
import { useNewGame } from "@app/hooks";
import { saveAppStorage } from "@app/utils";

export const ModalSettings = forwardRef<HTMLDialogElement>((_props, ref) => {
  const settingGameLevelsRef = useRef<SettingGameLevelsHandle>(null);
  const settingIsNoGuessingModeRef = useRef<SettingNoGuessingHandle>(null);
  const { newGame } = useNewGame();

  const handleSave = () => {
    if (settingGameLevelsRef.current && settingIsNoGuessingModeRef.current) {
      const { gameLevel, gameLevelSetting } =
        settingGameLevelsRef.current.handleSaveGameLevel();
      const isNoGuessingMode =
        settingIsNoGuessingModeRef.current.handleSaveNoGuessing();

      saveAppStorage({ gameLevel, isNoGuessingMode });
      newGame({
        ...gameLevelSetting,
        isNoGuessingMode,
      });
    }
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <div className="flex flex-col gap-2">
          <SettingGameLevels ref={settingGameLevelsRef} />
          <SettingNoGuessing ref={settingIsNoGuessingModeRef} />
        </div>
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
