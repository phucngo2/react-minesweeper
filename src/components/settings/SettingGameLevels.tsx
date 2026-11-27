import { SegmentedControl } from "@app/components";
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

const LEVEL_OPTIONS = Object.values(GameLevels).map((level) => ({
  value: level,
  label: level,
}));

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
    <section>
      <h4 className="list-header">Difficulty</h4>
      <SegmentedControl
        label="Difficulty"
        options={LEVEL_OPTIONS}
        value={level}
        onChange={onLevelChange}
        className="segmented-wrap"
      />
      {level === GameLevels.Custom && (
        <div className="mt-3 list-group">
          {customFields.map(({ key, label, min, max }) => (
            <label key={key} className="list-row">
              <span>
                {label}{" "}
                <span className="text-sm text-(--label-secondary) tabular-nums">
                  {min}–{max}
                </span>
              </span>
              <input
                type="number"
                inputMode="numeric"
                className="w-20 text-right input input-sm tabular-nums"
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
    </section>
  );
};
