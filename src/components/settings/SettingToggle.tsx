interface Props {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const SettingToggle: React.FC<Props> = ({
  label,
  description,
  checked,
  onChange,
}) => (
  <label className="cursor-pointer form-control">
    <div className="label">
      <span>{label}</span>
      <input
        type="checkbox"
        className="toggle toggle-primary"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
    {description && <p className="px-1 text-sm opacity-60">{description}</p>}
  </label>
);
