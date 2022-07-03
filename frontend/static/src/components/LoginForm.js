import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Cookies from "js-cookie";
import { Link } from 'react-router-dom';

function handleError(err) {
    console.warn(err);
}

const defaultState = {
    username: '',
    password: '',
}

const LoginForm = () => {
    const [state, setState] = useState(defaultState)
    const [isAuth, setIsAuth, navigate] = useOutletContext();
    
      const handleInput = (e) => {
        const {name, value} = e.target;
        setState((prevState) => ({
          ...prevState,
          [name]: value,
        }))
      }
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        
        const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: JSON.stringify(state),
        }
        const response = await fetch(`/dj-rest-auth/login/`, options).catch(handleError);
        if(!response.ok) {
        throw new Error('Network response not ok');
        }
        const json = await response.json(); 
        Cookies.set('Authorization', `Token ${json.key}`);
        setIsAuth(true);
        console.log(isAuth);
        navigate('/');
      }
  return (
    <>
      <div className="pt-20 bg-stone-200 h-screen w-full p-5 flex flex-col justify-center items-center">
        <form className='p-10 flex flex-col items-end bg-stone-300 rounded-sm' onSubmit={handleSubmit}>
            <div className="w-full">
            <h1 className="font-bold text-2xl">Login</h1>
            </div>
          <input
          className="my-2 p-1 rounded-sm"
            type="text"
            name="username"
            id="username"
            value={state.username}
            onChange={handleInput}
            placeholder="Username"
          />
          <input
          className="my-2 p-1 rounded-sm"
            type="password"
            name="password"
            id="password"
            value={state.password}
            onChange={handleInput}
            placeholder="Password"
          />
          <button type="submit" className="py-1 px-2 bg-green-400 hover:bg-green-500 hover:rounded-md rounded-sm transition-all font-semibold w-1/2">Login</button>
        </form>
        <span>Sign up <Link to='/register' className="underline hover:text-neutral-600">here</Link> to make an account.</span>
      </div>
    </>
  );
};

export default LoginForm;