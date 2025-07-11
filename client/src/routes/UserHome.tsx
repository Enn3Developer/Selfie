import {useEffect, useState} from "react";
import {getLatestNote, Note} from "../net/notes.ts";
import NoteComponent from "../components/Note.tsx";
import Card from "../components/Card.tsx";
import {Event, getEvents} from "../net/events.ts";
import {getNowDate} from "../utils/time_machine.ts";
import {Activity, getActivities} from "../net/activities.ts";

export default function UserHome() {
  const [note, setNote] = useState<Note | null>(null);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    getLatestNote().then(note => setNote(note));
  }, [changed]);

  return (
    <div className="flex flex-col p-4 gap-8 items-center justify-center">
      <ActivitiesPreview/>
      <EventsPreview/>
      <NoteComponent note={note} state={changed} setState={setChanged}/>
    </div>
  );
}

function ActivitiesPreview() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    getActivities().then((activities) => setActivities(activities));
  }, []);

  return (
    <>
      <Card title={"Activities"}>
        <div className="flex flex-col gap-2 text-lg">
          {
            activities.length === 0 ?
              <div>
                No activities
              </div>
              : undefined
          }
          {
            activities.map(activity => {
              return (
                <div className="flex flex-col" key={activity._id}>
                  <p><span
                    className="font-bold text-lg">{activity._name}</span> {activity._late ?
                    <span className="font-bold text-lg text-error">LATE</span> : undefined} <span
                    className="text-sm align-center">({new Date(activity._originalEnd ?? activity._end).toLocaleString()})</span>: {activity._description}
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
          {events.length === 0 ?
            <div>
              No events today
            </div>
            : undefined}
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