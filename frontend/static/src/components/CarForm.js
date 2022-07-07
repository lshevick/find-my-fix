import { useEffect, useState } from "react";
import { Combobox } from "@headlessui/react";
import Cookies from "js-cookie";

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
];

const CarForm = (year, make, model, type) => {
  const [state, setState] = useState(defaultState);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([{ id: 1, model: "Loading..." }]);
  const [form, setForm] = useState("car");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setState((p) => ({ ...p, [name]: value }));
  };

  const handleService = () => {
    setState((p) => ({ ...p, service_list: [...items] }));
    setForm("location");
    console.log(state);
    setItems([]);
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
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      body: JSON.stringify(state),
    };
    const response = await fetch(`/api/v1/cars/`, options).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    console.log(json);
    setState(defaultState);
  };

  const carForm = (
    <div className="flex flex-col w-full bg-stone-100 items-center">
      <div className="flex flex-col">
        <label htmlFor="year">Year</label>
        <select
          className="m-1 p-1"
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
          className="m-2 p-1"
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
          className="m-2 p-1"
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
      <div className="flex justify-end">
        <button
          type="button"
          className="bg-emerald-600 p-1 rounded-md hover:bg-emerald-700"
          onClick={() => setForm("service")}
        >
          Next
        </button>
      </div>
    </div>
  );

  const filteredServices =
    query === ""
      ? serviceList
      : serviceList.filter((s) => {
          return s.toLowerCase().includes(query.toLowerCase());
        });

  const serviceForm = (
    <>
      <div className="flex flex-col justify-between h-full">
        <h2>Choose Your Service(s):</h2>
        <Combobox
          name="service_list"
          value={items}
          onChange={setItems}
          multiple
        >
          <Combobox.Input onChange={(e) => setQuery(e.target.value)} />
          <Combobox.Options>
            {filteredServices.map((s) => (
              <Combobox.Option key={s} value={s}>
                {s}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>
      </div>
      <button
        type="button"
        onClick={handleService}
        className="bg-emerald-600 p-1 px-5 rounded-md hover:bg-emerald-700"
      >
        Next
      </button>
    </>
  );

  const getLocation = () => {
    // Sorcery!
    navigator.geolocation.getCurrentPosition((p) => {
      console.log(p.coords.latitude, p.coords.longitude);
    });
  };

  const locator = (
    <>
      <div>
        <button
          type="button"
          onClick={getLocation}
          className="p-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md shadow-md hover:shadow-lg transition-all"
        >
          Get my location
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="flex items-center justify-center p-2 my-auto mx-auto bg-stone-300 w-full min-h-screen">
        <div className="flex flex-col items-center rounded bg-stone-100 min-h-[300px]">
          <div className="flex justify-center rounded-t-md">
            <ul className="flex w-full mb-5">
              <li className="bg-stone-100 rounded-t-md">
                <button
                  type="button"
                  className={
                    form === "car"
                      ? `bg-stone-100 p-2 transition-all rounded-t rounded-r-none`
                      : `bg-stone-500 hover:bg-stone-400 p-2 transition-all grayscale rounded-t rounded-r-none`
                  }
                  onClick={() => setForm("car")}
                >
                  <span className="px-2 py-1 mx-1 text-white rounded-3xl bg-red-900">
                    1
                  </span>
                  Vehicle
                </button>
              </li>
              <li className="bg-stone-100">
                <button
                  type="button"
                  className={
                    form === "service"
                      ? `bg-stone-100 p-2 transition-all`
                      : `bg-stone-500 hover:bg-stone-400 p-2 transition-all grayscale`
                  }
                  onClick={() => setForm("service")}
                >
                  <span className="px-2 py-1 mx-1 text-white rounded-3xl bg-red-900">
                    2
                  </span>
                  Services
                </button>
              </li>
              <li className="bg-stone-100 rounded-t">
                <button
                  type="button"
                  className={
                    form === "location"
                      ? `bg-stone-100 p-2 transition-all rounded-t rounded-l-none`
                      : `bg-stone-500 hover:bg-stone-400 p-2 transition-all grayscale rounded-t rounded-l-none`
                  }
                  onClick={() => setForm("location")}
                >
                  <span className="px-2 py-1 mx-1 text-white rounded-3xl bg-red-900">
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
            className="w-full h-full flex items-end justify-center"
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
