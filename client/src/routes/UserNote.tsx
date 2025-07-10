import {useParams} from "react-router";
import React, {useEffect, useState} from "react";
import {getNote, Note} from "../net/notes.ts";
import Markdown from "../components/Markdown.tsx";

export function UserNote() {
  let {id} = useParams();
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    getNote(id).then(note => setNote(note));
  }, [id]);

  return (
    <>
      <div className="flex flex-col gap-4 p-2 justify-center items-center mb-auto flex-grow">
        <h1 className="text-2xl font-bold">
          {note?._title}
        </h1>
        <div className="items-start justify-start w-full">
          <Markdown>{note?._content}</Markdown>
        </div>
      </div>
    </>
  );
}