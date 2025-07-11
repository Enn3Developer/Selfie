import {postApi} from "./api.ts";
import {getNow} from "../utils/time_machine.ts";

export interface Activity {
  _end: number,
  _name: string,
  _description: string,
  _completed?: boolean,
  _id: string,
}

export async function createActivity(activity: Activity): Promise<boolean> {
  let response = await postApi<string>("/user/activities/create", {
    token: localStorage.getItem("token"),
    end: activity._end,
    name: activity._name,
    description: activity._description,
    completed: activity._completed,
  });

  if (response === "ERR_NETWORK") return false;

  return response.status === 200;
}

export async function getActivities(today?: number): Promise<Activity[]> {
  today = today ?? getNow();

  let response = await postApi<Activity[]>("/user/activities/get", {
    token: localStorage.getItem("token"),
    today: today,
  });

  if (response === "ERR_NETWORK") return [];

  if (response.status === 200) return response.data as Activity[];
  else return [];
}

export async function getActivity(id: string, today?: number): Promise<Activity | null> {
  today = today ?? getNow();

  let response = await postApi<Activity>(`/user/activities/get/${id}`, {
    token: localStorage.getItem("token"),
    today: today,
  });

  if (response === "ERR_NETWORK") return null;

  if (response.status === 200) return response.data as Activity;
  else return null;
}

export async function modifyActivity(activity: Activity): Promise<boolean> {
  let response = await postApi<string>(`/user/activities/modify/${activity._id}`, {
    token: localStorage.getItem("token"),
    end: activity._end,
    name: activity._name,
    description: activity._description,
    completed: activity._completed,
  });

  if (response === "ERR_NETWORK") return false;

  return response.status === 200;
}

export async function deleteActivity(id: string): Promise<boolean> {
  let response = await postApi<string>(`/user/activities/delete/${id}`, {
    token: localStorage.getItem("token"),
  });

  if (response === "ERR_NETWORK") return false;

  return response.status === 200;
}