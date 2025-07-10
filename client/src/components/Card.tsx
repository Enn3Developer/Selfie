import {Key, ReactNode} from "react";

export interface CardProps {
  title: string;
  children: ReactNode;
}

export default function Card(props: CardProps) {
  return (
    <div className="card card-border shadow-sm w-full lg:w-9/12 p-2">
      <div className="card-title flex items-center justify-center">
        <h2 className="">{props.title}</h2>
      </div>
      <div className="card-body flex flex-col">
        {props.children}
      </div>
    </div>
  );
}