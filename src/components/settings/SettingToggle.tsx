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
  <label className="cursor-pointer list-row">
    <span className="flex flex-col">
      <span>{label}</span>
      {description && (
        <span className="text-xs text-(--label-secondary)">{description}</span>
      )}
    </span>
    <input
      type="checkbox"
      role="switch"
      className="switch"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  </label>
);
