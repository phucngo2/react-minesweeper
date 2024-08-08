import { GameStates, PAUSED_TIMER_GAME_STATES } from "@app/config";
import { gameStateAtom, timeAtom } from "@app/stores";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo, useRef } from "react";

export const Timer = () => {
  const gameState = useAtomValue(gameStateAtom);
  const [seconds, setSeconds] = useAtom(timeAtom);
  const timeIntervalRef: React.MutableRefObject<number | null> = useRef(null);

  const startTimer = () => {
    if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
    timeIntervalRef.current = setInterval(() => {
      setSeconds((state) => state + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
  };

  useEffect(() => {
    if (gameState == GameStates.Playing) startTimer();
    if (PAUSED_TIMER_GAME_STATES.includes(gameState)) pauseTimer();
  }, [gameState]);

  const render = useMemo(() => {
    var date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substring(11, 19);
  }, [seconds]);

  return <div className="h-10 min-h-0 text-base btn">{render}</div>;
};
