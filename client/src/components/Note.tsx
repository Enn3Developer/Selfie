import {createNote, deleteNote, Note} from "../net/notes.ts";
import Card from "./Card.tsx";
import {Link} from "react-router";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import React, {Key} from "react";
import Markdown from "./Markdown.tsx";

export interface NoteProps {
  note?: Note | null;
  state?: boolean | null;
  setState?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NoteComponent(props: NoteProps) {
  return (
    <Card title={props.note ? props.note._title : "No Notes"}>
      <div className="flex flex-col text-xl">
        <Markdown truncate={true}>{props.note ? props.note._content : "Create a note!"}</Markdown>
        {props.note ? <div className="justify-end card-actions">
          <button onClick={async () => {
            await deleteNote(props.note!._id);
            props.setState!(!props.state);
          }}
                  className="btn btn-error btn-outline btn-square inline-flex flex-row items-center justify-center gap-2 lg:w-auto p-2">
            <DeleteRoundedIcon/> <p className="hidden lg:flex">Delete</p>
          </button>
          <button onClick={async () => {
            await createNote(props.note!);
            props.setState!(!props.state);
          }}
                  className="btn btn-primary btn-outline btn-square inline-flex flex-row items-center justify-center gap-2 lg:w-auto p-2">
            <ContentCopyRoundedIcon/> <p className="hidden lg:flex">Duplicate</p>
          </button>
          <Link to={`/user/notes/edit/${props.note._id}`}
                className="btn btn-primary btn-outline btn-square inline-flex flex-row items-center justify-center gap-2 lg:w-auto p-2">
            <EditRoundedIcon/> <p className="hidden lg:flex">Edit</p>
          </Link>
          <Link to={`/user/notes/${props.note._id}`}
                className="btn btn-primary btn-outline btn-square inline-flex flex-row items-center justify-center gap-2 lg:w-auto p-2">
            <OpenInFullRoundedIcon/><p className="hidden lg:flex">Open</p>
          </Link>
        </div> : null}
      </div>
    </Card>
  );
}