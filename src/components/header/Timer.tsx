import { isTimerRunningAtom, timeAtom } from "@app/stores";
import { formatTime } from "@app/utils";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";

export const Timer = () => {
  const isRunning = useAtomValue(isTimerRunningAtom);
  const [seconds, setSeconds] = useAtom(timeAtom);

  useEffect(() => {
    if (!isRunning) return;
    const interval = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(interval);
  }, [isRunning, setSeconds]);

  return (
    <div className="tooltip tooltip-bottom" data-tip="Time waits for no one!">
      <div className="h-10 min-h-0 text-base tabular-nums btn" role="timer">
        {formatTime(seconds)}
      </div>
    </div>
  );
};
