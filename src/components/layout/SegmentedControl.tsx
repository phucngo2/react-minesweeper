import { useRef } from "react";

interface Props<T extends string> {
  options: readonly { value: T; label: React.ReactNode }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  /** "tablist" when it switches panels, "radiogroup" when it picks a value */
  role?: "tablist" | "radiogroup";
  className?: string;
}

export const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  label,
  role = "radiogroup",
  className = "",
}: Props<T>) => {
  const ref = useRef<HTMLDivElement>(null);
  const isTabs = role === "tablist";

  // Arrow keys move the selection, like native segmented controls
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[
      e.key
    ];
    if (!step) return;
    e.preventDefault();
    const next = (index + step + options.length) % options.length;
    onChange(options[next].value);
    ref.current?.querySelectorAll("button")[next]?.focus();
  };

  return (
    <div
      ref={ref}
      role={role}
      aria-label={label}
      className={`segmented ${className}`}
    >
      {options.map((option, index) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role={isTabs ? "tab" : "radio"}
            aria-selected={isTabs ? selected : undefined}
            aria-checked={isTabs ? undefined : selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
