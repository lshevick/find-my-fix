import "./App.css";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Nav from "./components/Nav";


// need to make a homepage with a lil blurb about the app and how to use it, check wireframes
// want to put the car/service/location form next to logo in desktop view,
// and put logo above forms in mobile
// will probably just use regular javascript and state to select form screens 🤷🏼


function App() {
  const [isAuth, setIsAuth] = useState(!!Cookies.get("Authorization"));

  const navigate = useNavigate();

  return (
    <div className="App">
      <Nav isAuth={isAuth} setIsAuth={setIsAuth} />
      <div className="flex justify-center min-h-screen">
      <Outlet context={[isAuth, setIsAuth, navigate]} />
      </div>
    </div>
  );
}

export default App;
