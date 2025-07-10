import {postApi} from "./api.ts";

export interface Note {
  _title: string;
  _content: string;
  _id: string;
  _created_at: Date;
}

export async function getLatestNote(): Promise<Note | null> {
  let response = await postApi<Note>("/user/notes/get/latest", {token: localStorage.getItem("token")});
  if (response === "ERR_NETWORK") return null;

  if (response.status === 200) return response.data as Note;
  else return null;
}

export async function getAllNotes(): Promise<Note[]> {
  let response = await postApi<Note[]>("/user/notes/get", {token: localStorage.getItem("token")});
  if (response === "ERR_NETWORK") return [];

  if (response.status === 200) return response.data as Note[];
  else return [];
}

export async function getNote(id: string | undefined): Promise<Note | null> {
  if (id === undefined) return null;

  let response = await postApi<Note>(`/user/notes/get/${id}`, {token: localStorage.getItem("token")});
  if (response === "ERR_NETWORK") return null;

  if (response.status === 200) return response.data as Note;
  else return null;
}

export async function createNote(note: Note): Promise<boolean> {
  let response = await postApi<string>(`/user/notes/create`, {
    token: localStorage.getItem("token"),
    title: note._title,
    content: note._content
  });

  if (response === "ERR_NETWORK") return false;

  return response.status === 200;
}

export async function modifyNote(note: Note): Promise<boolean> {
  let response = await postApi<string>(`/user/notes/modify/${note._id}`, {
    token: localStorage.getItem("token"),
    title: note._title,
    content: note._content
  });

  if (response === "ERR_NETWORK") return false;

  return response.status === 200;
}

export async function deleteNote(id: string): Promise<boolean> {
  let response = await postApi<string>(`/user/notes/delete/${id}`, {
    token: localStorage.getItem("token"),
  });

  if (response === "ERR_NETWORK") return false;

  return response.status === 200;
}