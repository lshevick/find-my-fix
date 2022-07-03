import "./App.css";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Nav from "./components/Nav";

function App() {
  const [isAuth, setIsAuth] = useState(!!Cookies.get("Authorization"));

  const navigate = useNavigate();

  return (
    <div className="App">
      <Nav isAuth={isAuth} setIsAuth={setIsAuth} />
      <div className="flex">
      <Outlet context={[isAuth, setIsAuth, navigate]} />
      </div>
    </div>
  );
}

export default App;
