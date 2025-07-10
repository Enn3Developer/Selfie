import * as time from "../utils/time_machine.ts";
import {TextInput} from "../components/TextInput.tsx";
import {useCallback, useRef, useState} from "react";

export function TimeMachine() {
  const [offset, setOffset] = useState(time.getOffset());

  let offsetKindRef = useRef<HTMLSelectElement | null>(null);
  let positiveRef = useRef<HTMLInputElement | null>(null);
  let amountRef = useRef<HTMLInputElement | null>(null);

  const handleOffset = useCallback(() => {
    if (!offsetKindRef.current || !positiveRef.current || !amountRef.current) return;

    const positive = positiveRef.current.checked;
    let amount = parseInt(amountRef.current.value);

    if (isNaN(amount)) amount = 0;

    amount = positive ? amount : -amount;

    if (offsetKindRef.current.value == "days") {
      time.addOffsetByDays(amount);
    } else if (offsetKindRef.current.value == "hours") {
      time.addOffsetByHours(amount);
    } else if (offsetKindRef.current.value == "minutes") {
      time.addOffsetByMinutes(amount);
    }

    setOffset(time.getOffset());
  }, [offsetKindRef, positiveRef, amountRef, setOffset]);

  const handleReset = useCallback(() => {
    time.setOffset(0);

    setOffset(time.getOffset());
  }, [setOffset])

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-wrap p-2 gap-6 text-xl">
          <p>Current offset: {offset}</p>
          <button className="btn btn-accent" onClick={handleReset}>Reset</button>
        </div>

        <div className="flex flex-wrap p-2 gap-6 text-xl">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Offset Kind</legend>
            <select className="select" ref={offsetKindRef}>
              <option value="days">Days</option>
              <option value="hours">Hours</option>
              <option value="minutes">Minutes</option>
            </select>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Positive</legend>
            <label className="label">
              <input type="checkbox" defaultChecked className="checkbox" ref={positiveRef}/>
              Positive offset
            </label>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Amount of offset</legend>
            <TextInput placeholder="Enter amount of offset..." ref={amountRef}/>
          </fieldset>
          <button className="btn btn-accent" onClick={handleOffset}>Add offset</button>
        </div>
      </div>
    </>
  );
}