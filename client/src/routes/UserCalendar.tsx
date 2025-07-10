import {Calendar, momentLocalizer, NavigateAction, View} from 'react-big-calendar';
import moment from "moment";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {createEvent, deleteEvent, Event, getEvents, modifyEvent} from "../net/events";
import {TextInput} from "../components/TextInput.tsx";
import {getNowDate} from "../utils/time_machine.ts";

const localizer = momentLocalizer(moment);
type TupleDate = {
  start: Date,
  end: Date
}

const frequencyDefaultValue = "Select frequency (optional)";
const repetitionDefaultValue = "Select repetitions (optional)";

export default function UserCalendar() {
  const {views, defaultView}: { views: View[], defaultView: View } = useMemo(() => ({
    views: ["month", "week", "day"],
    defaultView: "month",
  }), []);

  const [view, setView] = useState<View>(defaultView);
  const [date, setDate] = useState<Date>(getNowDate());
  const [events, setEvents] = useState<Event[]>([]);
  const [tupleDate, setTupleDate] = useState<TupleDate | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let start: Date;
    let end: Date;

    switch (view) {
      case "month":
        start = new Date(date.getFullYear(), date.getMonth());
        end = new Date(start.getTime());
        end.setMonth(end.getMonth() + 1);
        break;
      case "week":
        let offsetDays = date.getDay();
        start = new Date(date.getTime() - offsetDays * 24 * 60 * 60 * 1000);
        end = new Date(date.getTime() + (6 - offsetDays) * 24 * 60 * 60 * 1000);
        break;
      case "day":
      default:
        start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
        break;
    }

    getEvents(start.getTime(), end.getTime()).then((events) => setEvents(events));
  }, [date, view]);

  const refName = useRef<HTMLInputElement | null>(null);
  const refDesc = useRef<HTMLInputElement | null>(null);
  const refPlace = useRef<HTMLInputElement | null>(null);
  const refFreq = useRef<HTMLSelectElement | null>(null);
  const refRep = useRef<HTMLSelectElement | null>(null);
  const refAmount = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (refRep.current != null && refRep.current.value == "choose") setVisible(true);
    else setVisible(false);
  }, [refRep]);

  const onView = useCallback((newView: View) => setView(newView), [setView]);
  const onNavigate = useCallback((newDate: Date, newView: View, action: NavigateAction) => {
    if (action == "DATE") {
      setDate(newDate);
      setView("day");
      return;
    }

    setDate(newDate);
    setView(newView);
  }, []);

  const calendarEvents = useMemo(() => {
    return events.map((event) => {
      return {
        title: event._name,
        desc: event._description,
        place: event._place,
        start: new Date(event._start),
        end: new Date(event._end),
        id: event._id,
      }
    })
  }, [events]);

  const titleAccessor = useCallback(({title, desc, place}: { title: string, desc: string, place?: string }) => {
    let content = title;
    if (place) content += " (" + place + ")";
    content += ": " + desc;
    return content;
  }, []);

  const handleSelectSlot = useCallback(({start, end}: { start: Date, end: Date }) => {
    setTupleDate({start: start, end: end});
    if (refName.current && refDesc.current && refPlace.current && refFreq.current && refRep.current) {
      refName.current.value = "";
      refDesc.current.value = "";
      refPlace.current.value = "";
      refFreq.current.value = frequencyDefaultValue;
      refRep.current.value = repetitionDefaultValue;
      setEventId(null);
      setVisible(false);
    }

    // @ts-ignore
    document.getElementById("modal")?.showModal();
    return true;
  }, []);

  const handleSelectEvent = useCallback(({title, start, end, id}: {
    title: string,
    start: Date,
    end: Date,
    id: string
  }) => {
    if (!refName.current || !refDesc.current || !refPlace.current || !refFreq.current || !refRep.current || !refAmount.current) return;

    let event = events.find(event => event._id == id);

    if (!event) return;

    setEventId(event._id);
    setTupleDate({start: start, end: end});
    refName.current.value = event._name;
    refDesc.current.value = event._description;
    refPlace.current.value = event._place ?? "";
    refFreq.current.value = event._frequency != "" ? event._frequency : frequencyDefaultValue;

    switch (event._repetitions) {
      case 0:
        refRep.current.value = repetitionDefaultValue;
        refAmount.current.value = "";
        break;
      case -1:
        refRep.current.value = "infinite";
        refAmount.current.value = "";
        break;
      case 1:
        refRep.current.value = "1";
        refAmount.current.value = "";
        break;
      case 2:
        refRep.current.value = "2";
        refAmount.current.value = "";
        break;
      case 5:
        refRep.current.value = "5";
        refAmount.current.value = "";
        break;
      default:
        refRep.current.value = "choose";
        refAmount.current.value = event._repetitions.toString();
        break;
    }

    // @ts-ignore
    document.getElementById("modal")?.showModal();
  }, [events, tupleDate]);

  const handleClick = useCallback(async () => {
    if (!refName.current || !refDesc.current || !refPlace.current || !refFreq.current || !refRep.current || !refAmount.current) return;
    if (tupleDate === null) return;

    let name = refName.current.value;
    let desc = refDesc.current.value;
    let place = refPlace.current.value.length === 0 ? undefined : refPlace.current.value;
    let freq = refFreq.current.value;
    let rep = refRep.current.value;
    let amount = parseInt(refAmount.current.value);

    let repeat = refFreq.current.value != frequencyDefaultValue && refRep.current.value != repetitionDefaultValue;

    let repAmount = 0;

    switch (rep) {
      case "infinite":
        repAmount = -1;
        break;
      case "1":
        repAmount = 1;
        break;
      case "2":
        repAmount = 2;
        break;
      case "5":
        repAmount = 5;
        break;
      case "choose":
        repAmount = !isNaN(amount) ? amount : 0;
    }

    if (eventId) {
      // by asking various people, most prefer to start the repetitions (if there are any) from the date the user selected to modify
      // instead than starting from the first date of the repetitions
      await modifyEvent({
        _start: tupleDate.start.getTime(),
        _end: tupleDate.end.getTime(),
        _name: name,
        _description: desc,
        _place: place,
        _id: eventId,
        _repeat: repeat,
        _frequency: freq,
        _repetitions: repAmount,
      });
    } else {
      await createEvent({
        _start: tupleDate.start.getTime(),
        _end: tupleDate.end.getTime(),
        _name: name,
        _description: desc,
        _place: place,
        _id: "",
        _repeat: repeat,
        _frequency: freq,
        _repetitions: repAmount,
      });
    }

    setDate(tupleDate.start);
    refName.current.value = "";
    refDesc.current.value = "";
    refPlace.current.value = "";
    setVisible(false);
    setEventId(null);
    setTupleDate(null);

    document.getElementById("close_modal")?.click();
  }, [eventId, events, tupleDate]);

  const handleDelete = useCallback(async () => {
    if (eventId === null) return;

    console.log(eventId);
    await deleteEvent(eventId);

    setDate(tupleDate?.start ?? getNowDate());
    setTupleDate(null);
    document.getElementById("close_modal")?.click();
  }, [eventId]);

  return (
    <>
      <div className="p-2 h-full">
        <Calendar localizer={localizer}
                  defaultView={defaultView}
                  onView={onView}
                  view={view}
                  views={views}
                  step={60}
                  timeslots={1}
                  onNavigate={onNavigate}
                  date={date}
                  events={calendarEvents}
                  selectable
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelectEvent}
                  getNow={getNowDate}
                  titleAccessor={titleAccessor}
        ></Calendar>
      </div>
      <dialog id="modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form method="dialog">
            <button id="close_modal" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h1 className="font-bold absolute left-3 top-3">Event</h1>
          <div className="flex flex-col p-1 pt-6 pb-10 gap-4">
            <TextInput className="w-full" title="Name" placeholder="Event name..." ref={refName}/>
            <TextInput className="w-full" title="Description" placeholder="Event description..." ref={refDesc}/>
            <TextInput className="w-full" title="Place" placeholder="Event place... (optional)" ref={refPlace}/>
            <select defaultValue={frequencyDefaultValue} className="select w-full" ref={refFreq}>
              <option disabled={true}>{frequencyDefaultValue}</option>
              <option value="day">Every Day</option>
              <option value="week">Every Week</option>
              <option value="month">Every Month</option>
              <option value="year">Every Year</option>
            </select>
            <div className="flex flex-row w-full gap-2">
              <select defaultValue={repetitionDefaultValue} className="select w-full" ref={refRep}
                      onChange={(event) => {
                        if (event.target.value == "choose") setVisible(true);
                        else setVisible(false);
                      }}>
                <option disabled={true}>{repetitionDefaultValue}</option>
                <option value="infinite">Indefinite repetitions</option>
                <option value="1">1 repetitions</option>
                <option value="2">2 repetitions</option>
                <option value="5">5 repetitions</option>
                <option value="choose">Choose repetitions</option>
              </select>
              <TextInput className={!visible ? "hidden" : ""} type="number" placeholder="Write repetitions..."
                         ref={refAmount}/>
            </div>
          </div>
          <div className="flex flex-row-reverse absolute right-2 bottom-2 gap-2">
            <input type="button" className="btn" value="Confirm" onClick={handleClick}/>
            {eventId === null ? undefined :
              <input type="button" className="btn btn-error" value="Delete" onClick={handleDelete}/>}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}