import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, Combobox } from "@headlessui/react";
import Cookies from "js-cookie";

function handleError(err) {
  console.warn(err);
}

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

const Dashboard = () => {
  const [garage, setGarage] = useState([]);
  const [car, setCar] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [query, setQuery] = useState("");
  const [newItems, setNewItems] = useState([]);

  const filteredServices =
    query === ""
      ? serviceList
      : serviceList.filter((s) => {
          return s.toLowerCase().includes(query.toLowerCase());
        });

  const getCars = async () => {
    const response = await fetch(`/api/v1/cars/`).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    setGarage(json);
  };

  useEffect(() => {
    getCars();
  }, []);

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

  const addService = async (id) => {
    const data = {
      service_list: [...car.service_list, newItems],
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
    setNewItems([]);
  };

  const carModal = (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-10">
          {car.image && (
            <div className="w-48 h-48 overflow-hidden">
              <img src={car.image} alt="car" className="object-cover" />
            </div>
          )}
          <div className="flex border-b-2 border-stone-600">
            <h2 className="mx-0.5">{car.year}</h2>
            <h2 className="mx-0.5">{car.make}</h2>
            <h2 className="mx-0.5">{car.model}</h2>
          </div>
          <div className="m-3">
            <h2 className="font-semibold underline">Services</h2>
            <ul>
              {car.service_list &&
                car.service_list.map((i) => (
                  <li
                    key={i}
                    className="capitalize font-light text-sm list-disc"
                  >
                    {i}
                  </li>
                ))}
            </ul>
          </div>
          <div className="w-full flex justify-between">
            <button type="button" onClick={() => setIsOpen(false)}>
              Close
            </button>
            <button type="button" onClick={() => setIsEditing(!isEditing)}>
              Edit
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );

  const editCarModal = (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        setIsEditing(false);
      }}
    >
      <div className="fixed inset-0" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-10">
          {car.image && (
            <div className="w-48 h-48 overflow-hidden">
              <img src={car.image} alt="car" className="object-cover" />
            </div>
          )}
          <div className="flex border-b-2 border-stone-600">
            <h2 className="mx-0.5">{car.year}</h2>
            <h2 className="mx-0.5">{car.make}</h2>
            <h2 className="mx-0.5">{car.model}</h2>
          </div>
          <div className="m-3">
            <h2 className="font-semibold underline">Services</h2>
            <ul>
              {car.service_list &&
                car.service_list.map((i) => (
                  <li
                    key={i}
                    className="capitalize font-light text-sm list-disc"
                  >
                    <div className="w-full flex justify-between">
                      {i}
                      <button
                        type="button"
                        className="flex items-center px-1 text-white bg-red-700 h-4 rounded hover:bg-red-600"
                        onClick={() => deleteService(i, car.id)}
                      >
                        -
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
            <div className="relative">
              <p>Add a service</p>
              <Combobox
                name="service_list"
                value={newItems}
                onChange={setNewItems}
                multiple
              >
                <Combobox.Input
                  displayValue={(items) => items}
                  onChange={(e) => setQuery(e.target.value)}
                  className="p-1 bg-stone-100 rounded"
                />
                <Combobox.Options className="bg-stone-100/90 p-2 rounded absolute right-0 sm:left-0">
                  {filteredServices.map((s) => (
                    <Combobox.Option
                      key={s}
                      value={s}
                      className="cursor-pointer hover:bg-stone-300"
                    >
                      {s}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </Combobox>
              <button
                className="bg-emerald-700 px-2 m-1 rounded hover:bg-emerald-600"
                onClick={() => {
                  addService(car.id);
                }}
              >
                Add
              </button>
            </div>
          </div>
          <div className="w-full flex justify-between">
            <button type="button" onClick={() => setIsOpen(false)}>
              Close
            </button>
            <button type="button" onClick={() => setIsEditing(!isEditing)}>
              Done
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );

  const garageDisplay = garage.map((c) => (
    <li key={c.id} className="flex items-center">
      <button
        type="button"
        onClick={() => {
          getCarDetail(c.id);
          setIsOpen(!isOpen);
        }}
        className="flex items-center hover:bg-stone-400 py-2"
      >
        <img src={c.image} alt="" width="45%" />
        <div>
          <h2 className="px-10 font-semibold">{c.model}</h2>
        </div>
      </button>
    </li>
  ));

  return (
    <>
      {isEditing ? editCarModal : carModal}
      <div
        className={`flex flex-col bg-stone-300 items-center justify-center w-full min-h-screen ${
          isOpen && `blur`
        }`}
      >
        <div className="bg-stone-200 flex flex-col mx-auto p-3 my-5 sm:w-5/6 md:w-2/3 lg:w-1/2">
          <h2 className="border-b-2 border-stone-500">My Garage</h2>
          <ul className="divide-y-2 divide-stone-600">{garageDisplay}</ul>
          <Link to="/add-car" className="text-emerald-500 hover:underline">
            Add a Car
          </Link>
        </div>
        <div className="bg-stone-200 flex flex-col mx-auto p-3 my-5">
          <h2 className="border-b-2 border-stone-500">Find My Fix!</h2>
          <ul>
            {garage.map((c) => (
              <li key={c.id}>
                <button>{c.model}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
