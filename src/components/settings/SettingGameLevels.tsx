import { CUSTOM_LEVEL_LIMITS, GameLevels } from "@app/config";
import { GameLevelSetting, GameLevelsType } from "@app/types";
import { clamp, normalizeCustomLevel } from "@app/utils";

const BLOCKED_KEYS = new Set(["-", "+", "e", "E", ".", ","]);

interface Props {
  level: GameLevelsType;
  onLevelChange: (level: GameLevelsType) => void;
  customLevel: GameLevelSetting;
  onCustomLevelChange: (customLevel: GameLevelSetting) => void;
}

const LEVEL_OPTIONS: { level: GameLevelsType; label: string }[] = [
  { level: GameLevels.Beginner, label: `1️⃣ ${GameLevels.Beginner}` },
  { level: GameLevels.Intermediate, label: `2️⃣ ${GameLevels.Intermediate}` },
  { level: GameLevels.Expert, label: `3️⃣ ${GameLevels.Expert}` },
  { level: GameLevels.Custom, label: `🛠️ ${GameLevels.Custom}` },
];

export const SettingGameLevels: React.FC<Props> = ({
  level,
  onLevelChange,
  customLevel,
  onCustomLevelChange,
}) => {
  const { minRows, maxRows, minCols, maxCols, minMines, maxMines } =
    CUSTOM_LEVEL_LIMITS;

  const customFields: {
    key: keyof GameLevelSetting;
    label: string;
    min: number;
    max: number;
  }[] = [
    { key: "rows", label: "Height", min: minRows, max: maxRows },
    { key: "cols", label: "Width", min: minCols, max: maxCols },
    {
      key: "mineCount",
      label: "Mines",
      min: minMines,
      max: maxMines(
        clamp(customLevel.rows, minRows, maxRows),
        clamp(customLevel.cols, minCols, maxCols)
      ),
    },
  ];

  return (
    <div className="form-control">
      <div className="label">Game Level</div>
      <div className="flex-wrap join">
        {LEVEL_OPTIONS.map((option) => (
          <input
            key={option.level}
            name="level"
            type="radio"
            className="h-10 btn join-item min-h-10"
            value={option.level}
            aria-label={option.label}
            checked={level === option.level}
            onChange={() => onLevelChange(option.level)}
          />
        ))}
      </div>
      {level === GameLevels.Custom && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {customFields.map(({ key, label, min, max }) => (
            <label key={key} className="form-control">
              <div className="label label-text">
                {label} ({min}–{max})
              </div>
              <input
                type="number"
                inputMode="numeric"
                className="w-full input input-bordered input-sm"
                min={min}
                max={max}
                // 0 means "empty" so the field can be cleared while typing
                value={customLevel[key] || ""}
                onKeyDown={(e) => {
                  if (BLOCKED_KEYS.has(e.key)) e.preventDefault();
                }}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  onCustomLevelChange({
                    ...customLevel,
                    [key]: digits ? Math.min(Number(digits), max) : 0,
                  });
                }}
                onBlur={() =>
                  onCustomLevelChange(normalizeCustomLevel(customLevel))
                }
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
