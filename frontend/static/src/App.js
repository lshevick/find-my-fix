import "./App.css";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Nav from "./components/Nav";
// import { themeChange } from "theme-change";

// need to make a homepage with a lil blurb about the app and how to use it, check wireframes
// want to put the car/service/location form next to logo in desktop view,
// and put logo above forms in mobile

function App() {
  const [isAuth, setIsAuth] = useState(!!Cookies.get("Authorization"));
  const [location, setLocation] = useState(undefined);
  const [queryCar, setQueryCar] = useState(undefined);
  const [theme, setTheme] = useState(true);
  const navigate = useNavigate();

  // useEffect(() => {
  //   themeChange(false)
  // }, [])

  return (
    <div className="App">
      <Nav isAuth={isAuth} setIsAuth={setIsAuth} theme={theme} setTheme={setTheme} />
      <div className="flex justify-center min-h-screen pt-28">
        <Outlet
          context={[isAuth, setIsAuth, navigate, location, setLocation, queryCar, setQueryCar, theme]}
        />
      </div>
    </div>
  );
}

export default App;
