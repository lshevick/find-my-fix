import { useEffect, useState } from "react";
import { Combobox } from "@headlessui/react";
import Cookies from "js-cookie";
import { useOutletContext, Link } from "react-router-dom";
import ServicePicker from "./ServicePicker";
import { FaLocationArrow } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { GoCheck } from "react-icons/go";

function handleError(err) {
  console.warn(err);
}

// need to add another form here that adds servieces to the car model.
// will need to also add a component that is like a car profile that lists details of the car
// also will need to implement CRUD for cars and services. Users need to be able to removes services
// they have completed.
// need to be able to filter shops based on work needed

const defaultState = {
  year: "",
  make: "",
  model: "",
  service_list: [],
};

const serviceList = [
  "oil change",
  "tires",
  "alignment",
  "diagnosis",
  "engine service",
  "air conditioning",
  "body work",
  "paint",
  "brakes",
  "suspension",
  "exhaust repair",
  "custom exhaust",
];

const CarForm = () => {
  const [state, setState] = useState(defaultState);
  const [image, setImage] = useState(null);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([{ id: 1, model: "Loading..." }]);
  const [form, setForm] = useState("car");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [car, setCar] = useState([]);
  const [
    isAuth,
    setIsAuth,
    navigate,
    location,
    setLocation,
    queryCar,
    setQueryCar,
  ] = useOutletContext();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setState((p) => ({ ...p, [name]: value }));
  };

  const handleService = () => {
    console.log(items, "these are the selected services");
    setState((p) => ({ ...p, service_list: [...items] }));
    console.log(state);
    setItems([]);
  };

  const getCarDetail = async (id) => {
    const response = await fetch(`/api/v1/cars/${id}/`).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    setCar(json);
  };

  const deleteService = async (item, id) => {
    const newList = car.service_list.slice();
    const i = newList.indexOf(item);
    newList.splice(i, 1);
    const data = {
      service_list: newList,
    };
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(`/api/v1/cars/${id}/`, options).catch(
      handleError
    );
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    console.log(json);
    getCarDetail(id);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const queryCarMakes = async () => {
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_CAR_API_KEY,
        "X-RapidAPI-Host": "car-data.p.rapidapi.com",
      },
    };
    const response = await fetch(
      `https://car-data.p.rapidapi.com/cars/makes/`,
      options
    ).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    setMakes(json);
  };

  const queryCarModels = async (year, make) => {
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_CAR_API_KEY,
        "X-RapidAPI-Host": "car-data.p.rapidapi.com",
      },
    };
    const response = await fetch(
      `https://car-data.p.rapidapi.com/cars?limit=50&page=0&year=${year}&make=${make}`,
      options
    ).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    setModels(json);
  };

  useEffect(() => {
    queryCarMakes();
  }, []);

  const makesList = makes.sort().map((m) => (
    <option key={m} value={m}>
      {m}
    </option>
  ));

  const modelsList = models.map((m) => (
    <option key={m.id} value={m.model}>
      {m.model}
    </option>
  ));

  const years = [];

  const populateYears = () => {
    for (let i = 1990; i <= 2022; i++) {
      years.unshift(i);
    }
  };
  populateYears();

  const yearList = years.map((i) => <option key={i}>{i}</option>);

  const handleCarSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("year", state.year);
    formData.append("make", state.make);
    formData.append("model", state.model);
    image && formData.append("image", image);
    formData.append("service_list", JSON.stringify(state.service_list));

    const options = {
      method: "POST",
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      body: formData,
    };
    const response = await fetch(`/api/v1/cars/`, options).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    console.log(json, "submitted car!");
    setQueryCar(json);
    setCar(json);
    setState(defaultState);
    // setServices(defaultServices);
    setImage(null);
    setItems([]);
  };

  const carForm = (
    <>
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col">
          <label htmlFor="year">Year</label>
          <select
            className="m-1 p-1 bg-neutral-content text-neutral border-2 border-neutral-focus rounded"
            name="year"
            id="year"
            value={state.year}
            onChange={handleInput}
            form="car-form"
          >
            <option value=""> Choose A Year</option>
            {yearList}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="make">Make</label>
          <select
            className="m-2 p-1 bg-neutral-content text-neutral border-2 border-neutral-focus rounded"
            name="make"
            id="make"
            value={state.make}
            onChange={handleInput}
            form="car-form"
          >
            <option value="">Choose A Make</option>
            {makesList}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="model">Model</label>
          <select
            className="m-2 p-1 bg-neutral-content text-neutral border-2 border-neutral-focus rounded"
            name="model"
            id="model"
            value={state.model}
            onChange={handleInput}
            form="car-form"
            onClick={() => queryCarModels(state.year, state.make)}
          >
            <option value="">Choose a Model</option>
            {modelsList}
          </select>
        </div>
        <div className="flex flex-col items-center w-5/6 inset-0">
          {image && <img className="md:w-48" src={preview} alt="car" width="100%" />}
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleImage}
            className="w-full file:bg-emerald-600 file:border-2 file:rounded file:text-white file:font-medium hover:file:bg-emerald-700 file:cursor-pointer"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="m-2 p-1 sm:absolute right-2 bottom-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md shadow-md hover:shadow-lg transition-all"
            onClick={() => setForm("service")}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );

  const serviceForm = (
    <>
      <div className="flex flex-col items-center">
        <div className="flex items-end">
          <div className="flex flex-col justify-between h-full">
            <h2>Choose Your Service(s):</h2>
            <ServicePicker
              items={items}
              setItems={setItems}
              serviceList={serviceList}
              query={query}
              setQuery={setQuery}
            />
          </div>
          <button
            type="submit"
            form="car-form"
            onClick={handleService}
            className="p-1 m-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md shadow-md hover:shadow-lg transition-all"
          >
            Add services
          </button>
        </div>
        <ul className="divide-y mt-4">
          {car.service_list &&
            car.service_list.flat().map((i) => (
              <li key={i} className="capitalize text-xl font-light py-3">
                <div className="w-full flex justify-between">
                  <p className="truncate pr-4">{i}</p>
                  <button
                    type="button"
                    className="flex items-center px-2 text-white bg-red-700 h-4 rounded hover:bg-red-600"
                    onClick={() => deleteService(i, car.id)}
                  >
                    -
                  </button>
                </div>
              </li>
            ))}
        </ul>

        <button
          type="button"
          onClick={() => setForm("location")}
          className="p-1 m-2 sm:absolute right-2 bottom-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md shadow-md hover:shadow-lg transition-all"
        >
          Next
        </button>
      </div>
    </>
  );

  const getLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition((p) => {
      console.log(p.coords.latitude, p.coords.longitude);
      setLocation([p.coords.latitude, p.coords.longitude]);
      setLoading(false);
    });
  };

  const locator = (
    <>
      <div className="flex flex-col">
        <div className="flex items-end">
          <input
            className={`mt-3 p-1 shadow-sm rounded-l-md`}
            type="text"
            value={Array.isArray(location) ? "Successful" : location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter ZIP or City, State..."
          />
          <button
            type="button"
            className="p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-r-md shadow-md hover:shadow-lg transition-all"
            onClick={getLocation}
          >
            {location ? (
              <GoCheck />
            ) : loading ? (
              <ImSpinner8 className="animate-spin" />
            ) : (
              <FaLocationArrow />
            )}
          </button>
        </div>
        <div className="mt-3">
          <Link
            to="/shops"
            className="p-1 bg-[#3c6e71] text-white rounded hover:shadow-md transition-all"
          >
            Search for shops
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="flex items-center justify-center p-3 bg-base-300 w-full min-h-screen">
        <div className="flex flex-col items-center rounded relative bg-base-100 w-full sm:w-1/2 md:min-w-1/3 min-h-[calc(100vh-10rem)] sm:min-h-[350px]">
          <div className="flex justify-center items-center rounded-t-md w-full">
            <ul className="flex justify-center w-full mb-5">
              <li className="bg-base-100 w-full rounded-t-md">
                <button
                  type="button"
                  className={
                    form === "car"
                      ? `bg-base-100 p-2 transition-all w-full rounded-t rounded-r-none`
                      : `bg-neutral hover:bg-stone-400 p-2 transition-all w-full grayscale rounded-t rounded-r-none`
                  }
                  onClick={() => setForm("car")}
                >
                  <span className="px-2 py-1 mx-1 text-white rounded-3xl bg-accent-focus">
                    1
                  </span>
                  Vehicle
                </button>
              </li>
              <li className="bg-stone-100 w-full">
                <button
                  type="button"
                  className={
                    form === "service"
                      ? `bg-base-100 p-2 transition-all w-full overflow-x-hidden`
                      : `bg-neutral hover:bg-stone-400 p-2 transition-all w-full grayscale`
                  }
                  onClick={() => setForm("service")}
                >
                  <span className="px-2 py-1 mx-1 text-white rounded-3xl bg-accent-focus">
                    2
                  </span>
                  Services
                </button>
              </li>
              <li className="bg-base-100 w-full rounded-t">
                <button
                  type="button"
                  className={
                    form === "location"
                      ? `bg-base-100 p-2 transition-all w-full rounded-t rounded-l-none`
                      : `bg-neutral hover:bg-stone-400 p-2 transition-all w-full grayscale rounded-t rounded-l-none`
                  }
                  onClick={() => setForm("location")}
                >
                  <span className="px-2 py-1 mx-1 text-base-content rounded-3xl bg-accent-focus">
                    3
                  </span>
                  Location
                </button>
              </li>
            </ul>
          </div>
          <form
            id="car-form"
            onSubmit={handleCarSubmit}
            className="h-full flex items-end justify-center"
          >
            {form === "car" && carForm}
            {form === "service" && serviceForm}
            {form === "location" && locator}
          </form>
        </div>
      </div>
    </>
  );
};

export default CarForm;
