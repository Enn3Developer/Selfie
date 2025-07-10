import {Link, Outlet, useLocation} from "react-router";
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import ContactPageRoundedIcon from '@mui/icons-material/ContactPageRounded';

export default function HomeLayout() {
  let location = useLocation();
  let activePage = location.pathname.replace("/", "");

  return (
    <>
      <div className="flex flex-col gap-4">
        <DesktopNavbar activePage={activePage}/>
        <div className="flex flex-col h-screen justify-between">
          <div className="flex flex-col p-2 gap-4">
            <h1 className="text-2xl lg:hidden text-center font-bold">Selfie</h1>
            <Outlet/>
          </div>
          <div
            className="lg:hidden sticky right-0 bottom-0 left-0">
            <MobileNavbar activePage={activePage}/>
          </div>
        </div>
      </div>
    </>
  );
}

type NavbarProps = {
  activePage: string,
}

function DesktopNavbar({activePage}: NavbarProps) {
  let linkClass = "text-xl "

  return (
    <>
      <div className="hidden lg:flex navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <h1 className="text-2xl font-bold"><ContactPageRoundedIcon/> Selfie</h1>
        </div>
        <div className="navbar-center">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/login">
                <p className={linkClass + (activePage === "login" ? "text-primary" : "")}><LoginRoundedIcon/> Login</p>
              </Link>
            </li>
            <li>
              <Link to="/register">
                <p className={linkClass + (activePage === "register" ? "text-primary" : "")}>
                  <AppRegistrationRoundedIcon/> Register</p>
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end"/>
      </div>
    </>
  );
}

function MobileNavbar({activePage}: NavbarProps) {
  return (
    <>
      <div className="flex lg:hidden dock dock-sm">
        <Link className={activePage === "login" ? "dock-active" : undefined} to="/login">
          <LoginRoundedIcon/>
          <span className="dock-label">Login</span>
        </Link>

        <Link className={activePage === "register" ? "dock-active" : undefined} to="/register">
          <AppRegistrationRoundedIcon/>
          <span className="dock-label">Register</span>
        </Link>
      </div>
    </>
  );
}