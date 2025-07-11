import {TextInput} from "../components/TextInput.tsx";
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import {RefObject, useMemo, useRef} from "react";
import {createNote, getNote, modifyNote, Note} from "../net/notes.ts";
import {NavigateFunction, useNavigate, useParams} from "react-router";
import {getNowDate} from "../utils/time_machine.ts";

interface HasValue {
  value: string,
}

export default function UserNotesEdit() {
  let {id} = useParams();

  let titleRef: RefObject<HTMLInputElement | null> = useRef(null);
  let contentRef: RefObject<HTMLTextAreaElement | null> = useRef(null);

  let navigate = useNavigate();

  useMemo(() => {
    getNote(id).then(note => {
      console.log(`id: ${id}`);
      console.log(`Note: ${note}`);

      if (titleRef.current) titleRef.current.value = note?._title ?? "";
      if (contentRef.current) contentRef.current.value = note?._content ?? "";
    });
  }, [id]);

  return (
    <>
      <div className="flex flex-col gap-4 p-2">
        <button className="btn btn-accent btn-sm w-fit"
                onClick={async () => await onDone(id, titleRef, contentRef, navigate)}>
          <DoneRoundedIcon/> <p>Confirm</p>
        </button>
        <TextInput ref={titleRef} title="Title" className="w-full"></TextInput>
        <textarea ref={contentRef} className="textarea w-full h-dvh font-mono" placeholder="Your note..."></textarea>
      </div>
    </>
  );
}

async function onDone<T extends HasValue, C extends HasValue>(id: string | undefined, titleRef: RefObject<T | null>, contentRef: RefObject<C | null>, navigate: NavigateFunction) {
  if (titleRef.current === null) return;
  if (contentRef.current === null) return;

  let note: Note = {
    _title: titleRef.current.value,
    _content: contentRef.current.value,
    _id: id ?? "",
    _created_at: getNowDate()
  }

  if (id) await modifyNote(note);
  else await createNote(note);

  navigate("/user/notes/");
}