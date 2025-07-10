import {useEffect, useState} from "react";
import {getLatestNote, Note} from "../net/notes.ts";
import NoteComponent from "../components/Note.tsx";
import Card from "../components/Card.tsx";
import {Event, getEvents} from "../net/events.ts";
import {getNowDate} from "../utils/time_machine.ts";

export default function UserHome() {
  const [note, setNote] = useState<Note | null>(null);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    getLatestNote().then(note => setNote(note));
  }, [changed]);

  return (
    <div className="flex flex-col p-4 gap-8 items-center justify-center">
      <EventsPreview/>
      <NoteComponent note={note} state={changed} setState={setChanged}/>
    </div>
  );
}

function EventsPreview() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const date = getNowDate();

    let start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

    getEvents(start.getTime(), end.getTime()).then((events) => setEvents(events));
  }, []);

  return (
    <>
      <Card title="Events">
        <div className="flex flex-col gap-2 text-lg">
          {
            events.map((event) => {
              return (
                <div className="flex flex-col" key={event._id}>
                  <p><span
                    className="font-bold text-lg">{event._name}</span> <span
                    className="text-sm align-center">({new Date(event._start).toLocaleString()} - {new Date(event._end).toLocaleString()})</span>: {event._description}
                  </p>
                </div>
              );
            })
          }
        </div>
      </Card>
    </>
  );
}