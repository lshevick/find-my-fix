import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, Combobox, Popover } from "@headlessui/react";
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
  "custom exhaust",
  "exhasut repair",
  "supsension",
];

const Dashboard = () => {
  const [garage, setGarage] = useState([]);
  const [car, setCar] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
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

  const deleteCar = async (id) => {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };
    const response = await fetch(`/api/v1/cars/${id}/`, options).catch(
      handleError
    );
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
  };

  const handleDelete = (id) => {
    deleteCar(id);
    // settimeout is here to make sure these functions fire in order. Had an issue with the getCars() not working
    setTimeout(() => {
      setDeleteIsOpen(false);
      setIsOpen(false);
      getCars();
    }, 100);
  };

  const carModal = (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 w-full">
        <Dialog.Panel className="mx-5 max-w-lg rounded bg-white p-10 flex flex-col items-center jsutify-center w-5/6">
          <div className="max-w-60 max-h-72 overflow-hidden relative flex items-center justify-center">
            <img
              src={
                car.image
                  ? car.image
                  : "https://kaleidousercontent.com/removebg/designs/b6f1aec1-de72-4e0e-9921-6ab407475be2/thumbnail_image/car-photo-optimizer-thumbnail.png"
              }
              alt="car"
              className="object-cover"
              width="100%"
              height="auto"
            />
          </div>
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
              className="bg-emerald-700 px-2 m-1 rounded text-white hover:bg-emerald-600"
              onClick={() => {
                addService(car.id);
              }}
            >
              Add
            </button>
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
        <Dialog.Panel className="mx-5 max-w-lg rounded bg-white p-10 flex flex-col items-center jsutify-center w-5/6">
          <div className="max-w-60 max-h-72 overflow-hidden relative flex items-center justify-center">
            <img
              src={
                car.image
                  ? car.image
                  : "https://kaleidousercontent.com/removebg/designs/b6f1aec1-de72-4e0e-9921-6ab407475be2/thumbnail_image/car-photo-optimizer-thumbnail.png"
              }
              alt="car"
              className="object-cover"
              width="100%"
              height="auto"
            />
          </div>
          <div className="flex border-b-2 border-stone-600">
            <h2 className="mx-0.5">{car.year}</h2>
            <h2 className="mx-0.5">{car.make}</h2>
            <h2 className="mx-0.5">{car.model}</h2>
          </div>
          <div>
            <button
              type="button"
              className="font-bold text-red-700 hover:text-red-600"
              onClick={() => setDeleteIsOpen(true)}
            >
              Delete Car
            </button>
            <Dialog
              className="relative"
              open={deleteIsOpen}
              onClose={() => setDeleteIsOpen(false)}
            >
              <div className="fixed inset-0 bg-black/30">
                <div className="fixed inset-0 flex items-center justify-center p-4">
                  <Dialog.Panel className="absolute bg-white w-max rounded p-5">
                    <div className="flex flex-col items-center">
                      <p>Delete Car?</p>
                      <div className="flex p-2">
                        <button
                          type="button"
                          className=" mx-2 font-bold text-red-700 hover:text-red-600"
                          onClick={() => {
                            handleDelete(car.id);
                          }}
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          className=" mx-2 font-bold text-stone-700 hover:text-stone-500"
                          onClick={() => setDeleteIsOpen(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </div>
              </div>
            </Dialog>
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
                        className="flex items-center px-2 text-white bg-red-700 h-4 rounded hover:bg-red-600"
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
                className="bg-emerald-700 px-2 m-1 rounded text-white hover:bg-emerald-600"
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
        <div className="overflow-hidden w-1/2 max-h-52 relative flex items-center justify-center">
          <img
            src={
              c.image
                ? c.image
                : "https://kaleidousercontent.com/removebg/designs/b6f1aec1-de72-4e0e-9921-6ab407475be2/thumbnail_image/car-photo-optimizer-thumbnail.png"
            }
            alt="car"
            className="object-cover"
            width="100%"
            height="100%"
          />
        </div>
        <div className="px-20 w-1/2">
          <h2 className="w-full font-semibold">{c.model}</h2>
        </div>
      </button>
    </li>
  ));

  return (
    <>
      {isEditing ? editCarModal : carModal}
      <div
        className={`flex flex-col bg-stone-100 items-center shadows justify-center w-full min-h-screen ${
          isOpen && `blur`
        }`}
      >
        <div className="bg-stone-200 rounded flex flex-col pb-3 mx-auto my-5 sm:w-5/6 md:w-2/3 lg:w-1/2">
          <div className="w-full bg-stone-400 rounded-t py-2">
            <h2 className="text-3xl font-medium">My Garage</h2>
          </div>
          <ul className="divide-y-2 divide-stone-600 px-3 pt-1 lg:grid lg:grid-flow-col lg:grid-rows-2 lg:divide-y-0">
            {garageDisplay}
          </ul>
          <Link to="/add-car" className="text-emerald-500 hover:underline">
            Add a Car
          </Link>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
