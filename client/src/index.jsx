import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from "react-router";
import {Home} from "./routes/Home";
import {Login} from "./routes/Login";
import {Register} from "./routes/Register";
import UserLayout from "./routes/layouts/UserLayout";
import UserHome from "./routes/UserHome";
import UserNotes from "./routes/UserNotes";
import UserNotesEdit from "./routes/UserNotesEdit";
import {UserNote} from "./routes/UserNote";
import Pomodoro from "./routes/Pomodoro";
import HomeLayout from "./routes/layouts/HomeLayout";
import UserCalendar from "./routes/UserCalendar";
import {TimeMachine} from "./routes/TimeMachine";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeLayout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="login" element={<Login/>}/>
                    <Route path="register" element={<Register/>}/>
                </Route>
                <Route path="user" element={<UserLayout/>}>
                    <Route index element={<UserHome/>}/>
                    <Route path="pomodoro" element={<Pomodoro/>}/>
                    <Route path="calendar" element={<UserCalendar/>}/>
                    <Route path="time_machine" element={<TimeMachine/>}/>
                    <Route path="notes" element={<UserNotes/>}/>
                    <Route path="notes/edit/:id?" element={<UserNotesEdit/>}/>
                    <Route path="notes/:id" element={<UserNote/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
