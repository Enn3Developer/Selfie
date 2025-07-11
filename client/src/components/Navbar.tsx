import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import ContactPageRoundedIcon from '@mui/icons-material/ContactPageRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import MicrowaveRoundedIcon from '@mui/icons-material/MicrowaveRounded';
import RunningWithErrorsRoundedIcon from '@mui/icons-material/RunningWithErrorsRounded';
import {Link} from 'react-router';
import {ReactElement} from "react";

export type Page = "home" | "notes" | "pomodoro" | "calendar" | "time_machine" | "activities";

const links: { url: string, label: string, icon: ReactElement, page: Page }[] = [
  {
    url: "/user",
    label: "Home",
    icon: <HomeRoundedIcon/>,
    page: "home"
  },
  {
    url: "/user/notes",
    label: "Notes",
    icon: <DescriptionRoundedIcon/>,
    page: "notes"
  },
  {
    url: "/user/calendar",
    label: "Calendar",
    icon: <CalendarMonthRoundedIcon/>,
    page: "calendar"
  },
  {
    url: "/user/activities",
    label: "Activities",
    icon: <RunningWithErrorsRoundedIcon/>,
    page: "activities",
  },
  {
    url: "/user/time_machine",
    label: "Time Machine",
    icon: <MicrowaveRoundedIcon/>,
    page: "time_machine",
  }
];

export interface NavbarProps {
  activePage: Page
}

export function DesktopNavbar(props: NavbarProps) {
  let linkClass = "text-xl "
  return (
    <div className="hidden lg:flex navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <h1 className="text-2xl font-bold"><ContactPageRoundedIcon/> Selfie</h1>
      </div>
      <div className="navbar-center">
        <ul className="menu menu-horizontal px-1">
          {
            links.map((link) => {
              return (
                <li key={link.page}>
                  <Link to={link.url}>
                    <p className={linkClass + (props.activePage === link.page ? "text-accent" : "")}>
                      {link.icon} {link.label}
                    </p>
                  </Link>
                </li>
              );
            })
          }
        </ul>
      </div>
      <div className="navbar-end"/>
    </div>
  );
}

export function MobileNavbar(props: NavbarProps) {
  return (
    <div className="flex lg:hidden dock dock-sm">
      {
        links.map((link) => {
          return (
            <Link key={link.page} to={link.url} className={props.activePage === link.page ? "dock-active" : undefined}>
              {link.icon}
              <span className="dock-label">{link.label}</span>
            </Link>
          );
        })
      }
    </div>
  );
}