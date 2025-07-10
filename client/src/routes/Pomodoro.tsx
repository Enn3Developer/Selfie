import {useState} from "react";

type PomodoroCycle = "main" | "pause"

type PomodoroState = {
  cycles: number,
  cycle: PomodoroCycle,
  main_timer: number,
  pause_timer: number,
  current: number
}

export default function Pomodoro() {
  const [pomodoro, setPomodoro] = useState<PomodoroState | null>(null);

  return (
    <>
      <div className="flex flex-col p-4 gap-8 items-center justify-center">

      </div>
    </>
  );
}