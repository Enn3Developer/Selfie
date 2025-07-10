import {postApi} from "./api.ts";

export interface Event {
  _start: number,
  _end: number,
  _name: string,
  _description: string,
  _place?: string,
  _id: string,
  _repeat: boolean,
  _frequency: string,
  _repetitions: number,
}

export async function createEvent(event: Event): Promise<boolean> {
  let response = await postApi<string>("/user/events/create", {
    token: localStorage.getItem("token"),
    start: event._start,
    end: event._end,
    name: event._name,
    description: event._description,
    repeat: event._repeat,
    frequency: event._frequency,
    repetitions: event._repetitions,
    place: event._place,
  });

  if (response === "ERR_NETWORK") return false;

  return response.status === 200;
}

export async function getEvents(start: number, end: number): Promise<Event[]> {
  let response = await postApi<Event[]>("/user/events/get", {
    token: localStorage.getItem("token"),
    start: start,
    end: end
  });

  if (response === "ERR_NETWORK") return [];

  if (response.status === 200) {
    return response.data as Event[];
  }

  return [];
}

export async function getEvent(id: string): Promise<Event | null> {
  let response = await postApi<Event>(`/user/events/get/${id}`, {
    token: localStorage.getItem("token")
  });

  if (response === "ERR_NETWORK") return null;

  if (response.status === 200) return response.data as Event;
  return null;
}

export async function modifyEvent(event: Event): Promise<boolean> {
  let response = await postApi<string>(`/user/events/modify/${event._id}`, {
    token: localStorage.getItem("token"),
    start: event._start,
    end: event._end,
    name: event._name,
    description: event._description,
    repeat: event._repeat,
    frequency: event._frequency,
    repetitions: event._repetitions,
    place: event._place,
  });

  if (response === "ERR_NETWORK") return false;

  return response.status === 200;
}

export async function deleteEvent(id: string): Promise<boolean> {
  let response = await postApi<string>(`/user/events/delete/${id}`, {
    token: localStorage.getItem("token"),
  });

  if (response === "ERR_NETWORK") return false;

  return response.status === 200;
}