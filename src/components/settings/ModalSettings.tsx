import {
  Modal,
  SettingGameLevels,
  SettingTheme,
  SettingToggle,
} from "@app/components";
import { useNewGame } from "@app/hooks";
import {
  customLevelAtom,
  gameLevelAtom,
  isNoGuessingModeAtom,
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
  { id: "game", label: "🎮 Game" },
  { id: "theme", label: "🎨 Theme" },
] as const;
type SettingsTab = (typeof SETTINGS_TABS)[number]["id"];

const SettingsForm = ({ onClose }: { onClose: () => void }) => {
  const [tab, setTab] = useState<SettingsTab>("game");
  const [gameLevel, setGameLevel] = useAtom(gameLevelAtom);
  const [customLevel, setCustomLevel] = useAtom(customLevelAtom);
  const [isNoGuessingMode, setIsNoGuessingMode] = useAtom(isNoGuessingModeAtom);
  const [useQuestionMarks, setUseQuestionMarks] = useAtom(useQuestionMarksAtom);
  const [theme, setTheme] = useAtom(themeAtom);
  const { newGame } = useNewGame();

  const [level, setLevel] = useState(gameLevel);
  const [custom, setCustom] = useState(customLevel);
  const [noGuessing, setNoGuessing] = useState(isNoGuessingMode);
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
      <div role="tablist" className="mb-2 tabs tabs-boxed">
        {SETTINGS_TABS.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={item.id === tab}
            className={`tab ${item.id === tab ? "tab-active" : ""}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {tab === "game" ? (
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
        </>
      ) : (
        <>
          <SettingTheme theme={theme} onChange={handleThemeChange} />
          <p className="mt-6 text-sm">
            The theme is applied instantly without restarting the game.
          </p>
        </>
      )}
      <div className="mt-6 modal-action">
        <div className="flex flex-row items-center justify-end gap-4">
          <button className="h-10 min-h-10 btn" onClick={onClose}>
            Close
          </button>
          {tab === "game" && (
            <button
              onClick={handleSave}
              className="h-10 btn btn-secondary min-h-10"
            >
              Save and Restart
            </button>
          )}
        </div>
      </div>
    </>
  );
};
