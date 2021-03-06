import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Cookies from "js-cookie";
import { FaEyeSlash, FaEye } from "react-icons/fa";

function handleError(err) {
  console.warn(err);
}

const defaultState = {
  username: "",
  email: "",
  password1: "",
  password2: "",
};

const RegisterForm = () => {
  const [state, setState] = useState(defaultState);
  const { navigate } = useOutletContext();
  const [visible, setVisible] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const registerUser = async () => {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
        body: JSON.stringify(state),
      };
      const response = await fetch(
        `/dj-rest-auth/registration/`,
        options
      ).catch(handleError);
      if (!response.ok) {
        alert("Something doesn't add up here...");
        throw new Error("Network response not ok");
      }
      navigate("/login");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
      registerUser();
  };

  return (
    <>
      <div className="bg-base-100 h-screen w-full p-5 flex flex-col items-center">
        <form
          className="p-10 flex flex-col items-end bg-base-300 rounded-sm"
          onSubmit={handleSubmit}
        >
          <div className="w-full">
            <h1 className="font-bold text-2xl">Register</h1>
          </div>
          <input
            className={`text-black my-4 p-1 rounded-sm`}
            type="text"
            name="username"
            id="username"
            value={state.username}
            onChange={handleInput}
            placeholder="Username"
          />
          <input
            className={`text-black my-4 p-1 rounded-sm`}
            type="email"
            name="email"
            id="email"
            value={state.email}
            onChange={handleInput}
            placeholder="E-mail"
          />
          <div className="relative">
            <input
              className={`text-black my-4 p-1 rounded-sm`}
              type={visible ? `text` : `password`}
              name="password1"
              id="password1"
              value={state.password1}
              onChange={handleInput}
              placeholder="Password"
            />
            <button
              type="button"
              className="absolute right-2 bottom-6"
              onClick={() => setVisible(!visible)}
            >
              {visible ? (
                <FaEyeSlash className="text-stone-400" />
              ) : (
                <FaEye className="text-stone-400" />
              )}
            </button>
          </div>
          <input
            className={`text-black my-4 p-1 rounded-sm`}
            type={visible ? `text` : `password`}
            name="password2"
            id="password2"
            value={state.password2}
            onChange={handleInput}
            placeholder="Re-enter password"
          />
          <button
            type="submit"
            className="py-1 px-2 mt-3 text-accent-content bg-accent hover:bg-accent-focus hover:rounded-md rounded-sm transition-all font-semibold w-1/2"
          >
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default RegisterForm;
