import { isNoGuessingModeAtom } from "@app/stores";
import { useAtom } from "jotai";
import { forwardRef, useImperativeHandle, useRef } from "react";

export interface SettingNoGuessingHandle {
  handleSaveNoGuessing: () => boolean;
}

// Over-engineered
export const SettingNoGuessing = forwardRef<SettingNoGuessingHandle>(
  (_props, ref) => {
    const [isNoGuessingMode, setIsNoGuessingMode] =
      useAtom(isNoGuessingModeAtom);
    const isNoGuessingModeRef = useRef<boolean>(isNoGuessingMode);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      isNoGuessingModeRef.current = e.target.checked;
    };

    const handleSaveNoGuessing = () => {
      const newIsNoGuessingMode = isNoGuessingModeRef.current;
      setIsNoGuessingMode(newIsNoGuessingMode);
      return newIsNoGuessingMode;
    };

    useImperativeHandle(
      ref,
      () => {
        return {
          handleSaveNoGuessing,
        };
      },
      []
    );

    return (
      <label className="form-control">
        <div className="label">First Move No Guessing</div>
        <input
          type="checkbox"
          className="toggle toggle-primary"
          onChange={handleChange}
          defaultChecked={isNoGuessingMode}
        />
      </label>
    );
  }
);
