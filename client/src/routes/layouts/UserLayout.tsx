import {Outlet, useLocation, useNavigate} from "react-router";
import {DesktopNavbar, MobileNavbar, Page} from "../../components/Navbar.tsx";
import {useEffect} from "react";
import {checkToken} from "../../net/api.ts";

export default function UserLayout() {
  let location = useLocation();
  let navigate = useNavigate();
  let activePage: Page = "home";

  if (location.pathname === "/user" || location.pathname === "/user/") {
    activePage = "home";
  } else if (location.pathname.includes("notes")) {
    activePage = "notes";
  } else if (location.pathname.includes("pomodoro")) {
    activePage = "pomodoro";
  } else if (location.pathname.includes("calendar")) {
    activePage = "calendar";
  } else if (location.pathname.includes("time_machine")) {
    activePage = "time_machine";
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token == null) {
      navigate("/");
      return;
    }
    checkToken(token).then((result) => {
      if (!result) navigate("/");
    });
  }, [navigate]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <DesktopNavbar activePage={activePage}/>
        <div className="flex flex-col h-screen justify-between">
          <Outlet/>
          <div
            className="lg:hidden sticky right-0 bottom-0 left-0">
            <MobileNavbar activePage={activePage}/>
          </div>
        </div>
      </div>
    </>
  );
}