import {getAllNotes, Note} from "../net/notes.ts";
import {useEffect, useState} from "react";
import NoteComponent from "../components/Note.tsx";
import {Link} from "react-router";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

type SortBy = "date" | "title" | "length";

export default function UserNotes() {
  const reverseNumber = (): number => {
    return reverse ? -1 : 1;
  }

  let [sortBy, setSortBy] = useState<SortBy>("date");
  let [reverse, setReverse] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    getAllNotes().then(notes => setNotes(notes));
  }, [changed]);

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-8">
      <div className="flex flex-row items-center justify-center w-full gap-4 lg:gap-8">
        <select className="select" defaultValue="date" onChange={(event) => {
          event.preventDefault();
          setSortBy(event.target.value as SortBy);
        }}>
          <option disabled={true}>Sort by</option>
          <option value="date">Date</option>
          <option value="title">Title</option>
          <option value="length">Content length</option>
        </select>
        <label className="label">
          <input type="checkbox" className="checkbox" onChange={(_) => {
            setReverse(!reverse);
          }}/>
          Reverse
        </label>
        <Link to="/user/notes/edit"
              className="btn btn-primary btn-soft btn-square inline-flex flex-row items-center justify-center gap-2 lg:w-30">
          <AddOutlinedIcon/> <p className="hidden lg:flex">New note</p>
        </Link>
      </div>
      {notes.sort((a, b) => {
        switch (sortBy) {
          case "date":
            let date_a = new Date(a._created_at);
            let date_b = new Date(b._created_at);
            return (date_b.getTime() - date_a.getTime()) * reverseNumber();
          case "title":
            return a._title.localeCompare(b._title) * reverseNumber();
          case "length":
            return (b._content.length - a._content.length) * reverseNumber();
          default:
            return (b._created_at.getTime() - a._created_at.getTime()) * reverseNumber();
        }
      }).map(note => (
        <NoteComponent note={note} state={changed} setState={setChanged} key={note._id}/>
      ))}
    </div>
  );
}