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
        Cookies.remove('Authorization')
        setIsAuth(false);
    }

    const authView = (
      // find a way to use a 50/50 logo / sliding pill menu for this? maybe hamburger menu with slide out list on mobile?
        <ul className="flex text-lg">
        <li className="mx-2 p-1"><Link to='/dashboard'>Dashboard</Link></li>
        <li className="mx-2 p-1"><Link to='/shops'>Search</Link></li>
        <li className="mx-2 p-1"><button type="button" onClick={logout}><Link to='/'>Logout</Link></button></li>
      </ul>
    )

    const guestView = (
        <ul className="flex items-center"> 
        <li className="mx-2 p-1"><Link to='/shops'>Search</Link></li>

            <li>
              
                <Link to='/login' className="hover:text-stone-800 hover:underline text-stone-600">Login</Link>
            </li>
        </ul>
    )


  return (
    <>
      <div className="flex p-2 py-6 sm:py-2 justify-between items-center bg-stone-400">
        <Link to='/'>
        <div className="font-bold text-lg text-red-900">Find <span className="text-stone-200">My</span> Fix</div>
        </Link>
        <div>
        {isAuth ? authView : guestView}
        </div>
      </div>
    </>
  );
};

export default Nav;
