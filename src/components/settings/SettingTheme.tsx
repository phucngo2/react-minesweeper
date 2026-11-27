import { THEMES } from "@app/config";
import { ThemeType } from "@app/types";

interface Props {
  theme: ThemeType;
  onChange: (theme: ThemeType) => void;
}

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export const SettingTheme: React.FC<Props> = ({ theme, onChange }) => (
  <label className="flex flex-col">
    <div className="flex select-none items-center justify-between px-1 py-2">
      Theme
    </div>
    <select
      className="w-full h-12 select"
      value={theme}
      onChange={(e) => onChange(e.target.value as ThemeType)}
    >
      {THEMES.map((item) => (
        <option key={item} value={item}>
          {capitalize(item)}
        </option>
      ))}
    </select>
  </label>
);
