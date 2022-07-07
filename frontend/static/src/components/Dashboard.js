import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog } from "@headlessui/react";

function handleError(err) {
  console.warn(err);
}

const Dashboard = () => {
  const [garage, setGarage] = useState([]);
  const [car, setCar] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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

  const carModal = (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-10">
          <div className="w-48 h-48 overflow-hidden">
            <img src={car.image} alt="car" className="object-cover" />
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
          <div className="w-full flex justify-between">
            <button type="button" onClick={() => setIsOpen(false)}>
              Close
            </button>
            <button type="button" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );

  const editCarModal = (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-10">
            <div className="w-48 h-48 overflow-hidden">
              <img src={car.image} alt="car" className="object-cover" />
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
                      <div className="w-full flex justify-between">
                        {i}
                        <button type="button" className="px-1 flex items-center h-5 text-white font-bold text-lg rounded hover:bg-red-600 bg-red-700">
                          -
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          <div className="w-full flex justify-between">
            <button type="button" onClick={() => setIsOpen(false)}>
              Close
            </button>
            <button type="button" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );

  const garageDisplay = garage.map((c) => (
    <li key={c.id}>
      <div>
        <button
          type="button"
          onClick={() => {
            getCarDetail(c.id);
            setIsOpen(!isOpen);
          }}
        >
          {c.model}
        </button>
      </div>
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
        <div className="bg-stone-200 flex flex-col mx-auto p-3 my-5">
          <h2 className="border-b-2 border-stone-500">My Garage</h2>
          <ul>{garageDisplay}</ul>
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
