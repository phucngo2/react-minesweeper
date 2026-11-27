import { THEMES } from "@app/config";
import { ThemeType } from "@app/types";
import { useLayoutEffect, useRef } from "react";

interface Props {
  theme: ThemeType;
  onChange: (theme: ThemeType) => void;
}

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const KEY_STEPS: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

export const SettingTheme: React.FC<Props> = ({ theme, onChange }) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    ref.current
      ?.querySelector('[aria-checked="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const step = KEY_STEPS[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (index + step + THEMES.length) % THEMES.length;
    onChange(THEMES[next]);
    ref.current?.querySelectorAll("button")[next]?.focus();
  };

  return (
    <section>
      <h4 className="list-header">Appearance</h4>
      <div
        ref={ref}
        role="radiogroup"
        aria-label="Theme"
        className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2 p-1 -m-1 overflow-y-auto max-h-80"
      >
        {THEMES.map((item, index) => {
          const selected = item === theme;
          return (
            <button
              key={item}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              className="theme-swatch"
              onClick={() => onChange(item)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              <div data-theme={item} aria-hidden>
                <div className="w-2/3 h-1.5 rounded-full bg-base-content/25" />
                <div className="flex gap-1">
                  <span className="rounded-full size-3 bg-primary" />
                  <span className="rounded-full size-3 bg-secondary" />
                  <span className="rounded-full size-3 bg-accent" />
                  <span className="rounded-full size-3 bg-neutral" />
                </div>
              </div>
              <span className="truncate">{capitalize(item)}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
