import {
  Modal,
  SettingGameLevels,
  SettingToggle,
} from "@app/components";
import { useNewGame } from "@app/hooks";
import {
  customLevelAtom,
  gameLevelAtom,
  isNoGuessingModeAtom,
  useQuestionMarksAtom,
} from "@app/stores";
import { normalizeCustomLevel, saveAppStorage } from "@app/utils";
import { useAtom } from "jotai";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ModalSettings: React.FC<Props> = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose}>
    <SettingsForm onClose={onClose} />
  </Modal>
);

const SettingsForm = ({ onClose }: { onClose: () => void }) => {
  const [gameLevel, setGameLevel] = useAtom(gameLevelAtom);
  const [customLevel, setCustomLevel] = useAtom(customLevelAtom);
  const [isNoGuessingMode, setIsNoGuessingMode] = useAtom(isNoGuessingModeAtom);
  const [useQuestionMarks, setUseQuestionMarks] = useAtom(useQuestionMarksAtom);
  const { newGame } = useNewGame();

  const [level, setLevel] = useState(gameLevel);
  const [custom, setCustom] = useState(customLevel);
  const [noGuessing, setNoGuessing] = useState(isNoGuessingMode);
  const [questionMarks, setQuestionMarks] = useState(useQuestionMarks);

  const handleSave = () => {
    const normalizedCustom = normalizeCustomLevel(custom);
    setGameLevel(level);
    setCustomLevel(normalizedCustom);
    setIsNoGuessingMode(noGuessing);
    setUseQuestionMarks(questionMarks);
    saveAppStorage({
      gameLevel: level,
      customLevel: normalizedCustom,
      isNoGuessingMode: noGuessing,
      useQuestionMarks: questionMarks,
    });
    newGame();
    onClose();
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <SettingGameLevels
          level={level}
          onLevelChange={setLevel}
          customLevel={custom}
          onCustomLevelChange={setCustom}
        />
        <SettingToggle
          label="First Move No Guessing"
          description="The first click always opens an empty area."
          checked={noGuessing}
          onChange={setNoGuessing}
        />
        <SettingToggle
          label="Question Marks"
          description="Right-click / long-press cycles 🚩 → ❓ → empty."
          checked={questionMarks}
          onChange={setQuestionMarks}
        />
      </div>
      <p className="mt-6 text-sm">
        The settings will take effect when you click{" "}
        <span className="underline">Save and Restart</span>
      </p>
      <div className="mt-3 modal-action">
        <div className="flex flex-row items-center justify-end gap-4">
          <button className="h-10 min-h-10 btn" onClick={onClose}>
            Close
          </button>
          <button
            onClick={handleSave}
            className="h-10 btn btn-secondary min-h-10"
          >
            Save and Restart
          </button>
        </div>
      </div>
    </>
  );
};
