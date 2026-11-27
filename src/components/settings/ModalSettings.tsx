import {
  Modal,
  SegmentedControl,
  SettingGameLevels,
  SettingTheme,
  SettingToggle,
} from "@app/components";
import { useNewGame } from "@app/hooks";
import {
  customLevelAtom,
  gameLevelAtom,
  isFirstMoveNoGuessingAtom,
  isNoGuessingBoardAtom,
  themeAtom,
  useQuestionMarksAtom,
} from "@app/stores";
import { ThemeType } from "@app/types";
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

const SETTINGS_TABS = [
  { value: "game", label: "Game" },
  { value: "theme", label: "Theme" },
] as const;
type SettingsTab = (typeof SETTINGS_TABS)[number]["value"];

const SettingsForm = ({ onClose }: { onClose: () => void }) => {
  const [tab, setTab] = useState<SettingsTab>("game");
  const [gameLevel, setGameLevel] = useAtom(gameLevelAtom);
  const [customLevel, setCustomLevel] = useAtom(customLevelAtom);
  const [isFirstMoveNoGuessing, setIsFirstMoveNoGuessing] = useAtom(
    isFirstMoveNoGuessingAtom
  );
  const [isNoGuessingBoard, setIsNoGuessingBoard] = useAtom(
    isNoGuessingBoardAtom
  );
  const [useQuestionMarks, setUseQuestionMarks] = useAtom(useQuestionMarksAtom);
  const [theme, setTheme] = useAtom(themeAtom);
  const { newGame } = useNewGame();

  const [level, setLevel] = useState(gameLevel);
  const [custom, setCustom] = useState(customLevel);
  const [firstMoveNoGuessing, setFirstMoveNoGuessing] = useState(
    isFirstMoveNoGuessing
  );
  const [noGuessingBoard, setNoGuessingBoard] = useState(isNoGuessingBoard);

  // The two no-guessing modes are mutually exclusive: enabling one turns the
  // other off.
  const handleNoGuessingBoardChange = (checked: boolean) => {
    setNoGuessingBoard(checked);
    if (checked) setFirstMoveNoGuessing(false);
  };
  const handleFirstMoveNoGuessingChange = (checked: boolean) => {
    setFirstMoveNoGuessing(checked);
    if (checked) setNoGuessingBoard(false);
  };
  const [questionMarks, setQuestionMarks] = useState(useQuestionMarks);

  // Theme is cosmetic: apply and persist right away, no restart needed.
  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    saveAppStorage({ theme: newTheme });
  };

  const handleSave = () => {
    const normalizedCustom = normalizeCustomLevel(custom);
    setGameLevel(level);
    setCustomLevel(normalizedCustom);
    setIsFirstMoveNoGuessing(firstMoveNoGuessing);
    setIsNoGuessingBoard(noGuessingBoard);
    setUseQuestionMarks(questionMarks);
    saveAppStorage({
      gameLevel: level,
      customLevel: normalizedCustom,
      isNoGuessingMode: firstMoveNoGuessing,
      isNoGuessingBoard: noGuessingBoard,
      useQuestionMarks: questionMarks,
    });
    newGame();
    onClose();
  };

  return (
    <>
      <h3 className="mb-4 text-lg font-bold">Settings</h3>
      <SegmentedControl
        role="tablist"
        label="Settings sections"
        options={SETTINGS_TABS}
        value={tab}
        onChange={setTab}
        className="mb-5"
      />
      {tab === "game" ? (
        <div className="flex flex-col gap-5">
          <SettingGameLevels
            level={level}
            onLevelChange={setLevel}
            customLevel={custom}
            onCustomLevelChange={setCustom}
          />
          <section>
            <h4 className="list-header">Gameplay</h4>
            <div className="list-group">
              <SettingToggle
                label="No Guessing Mode"
                description="Every board can be solved by logic alone. Start on the ✕ cell."
                checked={noGuessingBoard}
                onChange={handleNoGuessingBoardChange}
              />
              <SettingToggle
                label="First Move No Guessing"
                description="The first click always opens an empty area."
                checked={firstMoveNoGuessing}
                onChange={handleFirstMoveNoGuessingChange}
              />
              <SettingToggle
                label="Question Marks"
                description="Right-click / long-press cycles 🚩 → ❓ → empty."
                checked={questionMarks}
                onChange={setQuestionMarks}
              />
            </div>
            <p className="list-footer">
              Changes take effect when you click Save and Restart.
            </p>
          </section>
        </div>
      ) : (
        <>
          <SettingTheme theme={theme} onChange={handleThemeChange} />
          <p className="list-footer">
            Themes apply instantly without restarting the game.
          </p>
        </>
      )}
      <div className="modal-action">
        <button className="btn btn-gray" onClick={onClose}>
          Close
        </button>
        {tab === "game" && (
          <button
            onClick={handleSave}
            className="btn btn-primary btn-frosted"
          >
            Save and Restart
          </button>
        )}
      </div>
    </>
  );
};
