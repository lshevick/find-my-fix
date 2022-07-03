import { useEffect, useState } from 'react';
// import Cookies from "js-cookie";

function handleError(err) {
  console.warn(err);
}

const defaultState = {
    year: '',
    make: '',
    model: '',
    type: '',
}

const CarForm = (year, make, model, type) => {
    const [state, setState] = useState(defaultState);
    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);

    const handleInput = e => {
        const { name, value } = e.target;
        setState((p) => ({...p, [name]: value,}));
    }
    const queryCarMakes = async () => {
        const options = {
            method: "GET",
            headers: {
        'X-RapidAPI-Key': 'd6c14947a1msh9b6d57b1655b815p1ee12bjsned335cc92e12',
		'X-RapidAPI-Host': 'car-data.p.rapidapi.com'
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
    console.log(json);
    setMakes(json);
};


const queryCarModels = async (year, make) => {
    const options = {
        method: "GET",
        headers: {
    'X-RapidAPI-Key': 'd6c14947a1msh9b6d57b1655b815p1ee12bjsned335cc92e12',
    'X-RapidAPI-Host': 'car-data.p.rapidapi.com'
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
console.log(json);
setModels(json);
};

useEffect(() => {
    queryCarMakes()
}, [])

  const makesList = makes.sort().map(m => (
      <option key={m} value={m}>{m}</option>
  ))

  const modelsList = models.map(m => (
    <option key={m.id} value={m.model}>{m.model}</option>
  ))

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <>
      <div className="flex flex-col p-2 m-1">
        <form onSubmit={handleSubmit}>
            <label htmlFor="year">Year</label>
            <input type="text" name='year' id='year' value={state.year} onChange={handleInput} placeholder='e.g. 1997' autoComplete='off'/>
            <label htmlFor="make">Make</label>
            <select name='make' id='make' value={state.make} onChange={handleInput}>
                <option value=''>Choose A Make</option>
                {makesList}
            </select>
            <label htmlFor="model">Model</label>
            <select name='model' id='model' value={state.model} onChange={handleInput} onClick={() => queryCarModels(state.year, state.make)}>
                <option value="">Choose a Model</option>
                {modelsList}
            </select>
            <button type='submit'>Enter</button>
        </form>
      </div>
    </>
  );
};

export default CarForm;
