import { timeAtom } from "@app/stores";
import { useAtom } from "jotai";
import { useEffect, useMemo } from "react";

export const Timer = () => {
  const [seconds, setSeconds] = useAtom(timeAtom);

  useEffect(() => {
    const interval = setInterval(() => setSeconds((state) => state + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const render = useMemo(() => {
    var date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substring(11, 19);
  }, [seconds]);

  return <div>{render}</div>;
};
