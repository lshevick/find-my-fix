// import { useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

function handleError(err) {
    console.warn(err)
}

const Nav = ({ isAuth, setIsAuth }) => {
    
    const logout = async () => {
        const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
        },
        }
        const response = await fetch(`/dj-rest-auth/logout/`, options).catch(handleError);
        if(!response.ok) {
        throw new Error('Network response not ok');
        }
        const json = await response.json(); 
        console.log(json);
        setIsAuth(false);
    }

    const authView = (
        <ul className="flex">
        <li className="mx-2 p-1">Home</li>
        <li className="mx-2 p-1">Glovebox</li>
        <li className="mx-2 p-1"><button type="button" onClick={logout}>Logout</button></li>
      </ul>
    )

    const guestView = (
        <ul className="flex">
            <li>
                <Link to='/login' className="hover:text-stone-800 hover:underline text-stone-600">Login</Link>
            </li>
        </ul>
    )


  return (
    <>
      <div className="flex p-2 justify-between items-center bg-stone-400">
        <div className="font-bold text-lg text-red-900">Find <span className="text-stone-200">My</span> Fix</div>
        <div>
        {isAuth ? authView : guestView}
        </div>
      </div>
    </>
  );
};

export default Nav;
