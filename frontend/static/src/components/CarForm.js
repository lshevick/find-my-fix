import { useEffect, useState } from "react";
// import Cookies from "js-cookie";

function handleError(err) {
  console.warn(err);
}

const defaultState = {
  year: "",
  make: "",
  model: "",
  type: "",
};

const CarForm = (year, make, model, type) => {
  const [state, setState] = useState(defaultState);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setState((p) => ({ ...p, [name]: value }));
  };
  const queryCarMakes = async () => {
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "",
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
        "X-RapidAPI-Key": "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="flex items-center justify-center p-2 my-auto mx-auto bg-stone-300 w-full min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col bg-stone-200 p-2 rounded items-center">
          <div className="flex flex-col">
            <label htmlFor="year">Year</label>
            <select
              className="m-1 p-1"
              name="year"
              id="year"
              value={state.year}
              onChange={handleInput}
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
              onClick={() => queryCarModels(state.year, state.make)}
            >
              <option value="">Choose a Model</option>
              {modelsList}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-emerald-600 p-1 rounded-md hover:bg-emerald-700"
            >
              Enter
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CarForm;
