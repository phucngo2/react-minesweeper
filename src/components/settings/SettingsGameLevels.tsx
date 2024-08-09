import { GAME_LEVEL_SETTING_OPTIONS, GameLevels } from "@app/config";
import { gameLevelAtom } from "@app/stores";
import { GameLevelSetting, GameLevelsType } from "@app/types";
import { useAtom } from "jotai";
import { forwardRef, useImperativeHandle, useRef } from "react";

export interface SettingsGameLevelsHandle {
  handleSaveGameLevel: () => {
    gameLevel: GameLevelsType;
    gameLevelSetting: GameLevelSetting;
  };
}

export const SettingsGameLevels = forwardRef<SettingsGameLevelsHandle>(
  (_props, ref) => {
    const [gameLevel, setGameLevel] = useAtom(gameLevelAtom);
    const selectedLevelRef = useRef<GameLevelsType>(gameLevel);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      selectedLevelRef.current = e.target.value as GameLevelsType;
    };
    const handleSaveGameLevel = () => {
      const newGameLevel = selectedLevelRef.current;
      setGameLevel(newGameLevel);
      return {
        gameLevel: newGameLevel,
        gameLevelSetting: GAME_LEVEL_SETTING_OPTIONS[newGameLevel],
      };
    };

    useImperativeHandle(
      ref,
      () => {
        return {
          handleSaveGameLevel,
        };
      },
      []
    );

    return (
      <label className="form-control">
        <div className="label">Game Level</div>
        <div className="join">
          <input
            name="level"
            type="radio"
            className="h-10 btn join-item min-h-10"
            value={GameLevels.Beginner}
            aria-label={`1️⃣ ${GameLevels.Beginner}`}
            defaultChecked={selectedLevelRef.current == GameLevels.Beginner}
            onChange={handleChange}
          />
          <input
            name="level"
            type="radio"
            className="h-10 btn join-item min-h-10"
            value={GameLevels.Intermediate}
            aria-label={`2️⃣ ${GameLevels.Intermediate}`}
            defaultChecked={selectedLevelRef.current == GameLevels.Intermediate}
            onChange={handleChange}
          />
          <input
            name="level"
            type="radio"
            className="h-10 btn join-item min-h-10"
            value={GameLevels.Expert}
            aria-label={`3️⃣ ${GameLevels.Expert}`}
            defaultChecked={selectedLevelRef.current == GameLevels.Expert}
            onChange={handleChange}
          />
        </div>
      </label>
    );
  }
);
