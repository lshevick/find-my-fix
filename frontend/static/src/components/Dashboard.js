import { useEffect, useState, useRef } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import Cookies from "js-cookie";
import ServicePicker from "./ServicePicker";
import { ImSpinner8 } from "react-icons/im";
import { BiEdit } from "react-icons/bi";
import RecordForm from "./RecordForm";
import RecordDetail from "./RecordDetail";
import format from "date-fns/format";

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
  "exhaust repair",
  "suspension",
];

const Dashboard = () => {
  const [car, setCar] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [recordIsOpen, setRecordIsOpen] = useState(false);
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [record, setRecord] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [garage, setGarage] = useState([]);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [dataChanged, setDataChanged] = useState(false);
  const editButton = useRef();
  const [loading, setLoading] = useState(false);
  const [
    isAuth,
    setIsAuth,
    navigate,
    location,
    setLocation,
    queryCar,
    setQueryCar,
    theme,
  ] = useOutletContext();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setNewImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      console.log("updated preview");
    };
    reader.readAsDataURL(file);
  };

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

  useEffect(() => {
    getCars();
    getCarDetail(car.id);
  }, [dataChanged]);

  const getCarDetail = async (id) => {
    const response = await fetch(`/api/v1/cars/${id}/`).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    setCar(json);
  };

  const getRecordDetail = async (id, rec) => {
    const response = await fetch(`/api/v1/cars/${id}/records/${rec}`).catch(
      handleError
    );
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    setRecord(json);
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
      service_list: [...car.service_list, items].flat(),
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
    setItems([]);
  };

  const updateImage = async (id) => {
    const formData = new FormData();
    formData.append("image", newImage);
    const options = {
      method: "PATCH",
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      body: formData,
    };
    const response = await fetch(`/api/v1/cars/${id}/`, options).catch(
      handleError
    );
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    console.log(json);
    setNewImage(null);
    setPreview(null);
    setDataChanged(!dataChanged);
  };

  const uploadImage = (e) => {
    e.preventDefault();
    updateImage(car.id);
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

  const searchNav = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition((p) => {
      setLocation([p.coords.latitude, p.coords.longitude]);
      setLoading(false);
      setQueryCar(car);
      navigate("/shops");
    });
  };

  const formModal = (
    <>
      <Dialog
        open={formIsOpen}
        onClose={() => setFormIsOpen(false)}
        className="relative"
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true">
          <div className="fixed inset-0 flex items-center justify-center p-4 w-full">
            <Dialog.Panel className="max-w-52 z-50 absolute max-w-lg rounded bg-base-200 p-4 md:p-10 flex flex-col items-center justify-center w-5/6">
              <div className="w-full relative">
                <RecordForm
                  currentCar={car}
                  dataChanged={dataChanged}
                  setDataChanged={setDataChanged}
                />
              </div>
              <button type="button" onClick={() => setFormIsOpen(false)}>
                Close
              </button>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );

  const carModal = (
    <Dialog
      open={isOpen}
      initialFocus={editButton}
      onClose={() => setIsOpen(false)}
    >
      <div className="fixed inset-0" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 w-full">
        <Dialog.Panel className="mx-5 max-w-lg rounded bg-base-200 p-10 flex flex-col items-center justify-center w-5/6">
          <div className="max-w-60 max-h-72 overflow-hidden relative flex items-center justify-center">
            <img
              src={
                car.image
                  ? car.image
                  : "https://kaleidousercontent.com/removebg/designs/b6f1aec1-de72-4e0e-9921-6ab407475be2/thumbnail_image/car-photo-optimizer-thumbnail.png"
              }
              alt="car"
              className="object-cover object-center"
              width="100%"
              height="100%"
            />
          </div>
          <div className="flex border-b-2 border-stone-600 text-xl sm:text-3xl flex-wrap justify-center">
            <h2 className="mx-1">{car.year}</h2>
            <h2 className="mx-1">{car.make}</h2>
            <h2 className="mx-1">{car.model}</h2>
          </div>
          <button
              type="button"
              className="font-bold invisible text-red-700 hover:text-red-600"
              onClick={() => setDeleteIsOpen(true)}
            >
              Delete Car
            </button>
          <div className="my-3 w-full flex flex-col items-center">
            <div className="services">
              <h2 className="font-semibold underline mb-2 text-md md:text-2xl">
                Work Needed
              </h2>
              <div className="overflow-y-scroll max-h-[180px]">
              <ul className="overflow-y-hidden w-full">
                {car.service_list &&
                  car.service_list.flat().map((i) => (
                    <li
                    key={i}
                    className="capitalize font-light text-xl list-disc py-1"
                    >
                      {i}
                    </li>
                  ))}
              </ul>
                  </div>
            </div>
              </div>
            <div className="relative flex items-end mt-3 sm:mt-1">
              <ServicePicker
                items={items}
                setItems={setItems}
                serviceList={serviceList}
                query={query}
                setQuery={setQuery}
              />
              <button
                className="bg-accent hover:bg-accent-focus px-2 m-1 mt-2 rounded text-accent-content transition-all duration-300"
                onClick={() => {
                  addService(car.id);
                }}
              >
                Add
              </button>
            </div>
            <div className="records border-t-2 mt-2 py-2 border-base-300 w-full sm:w-1/2 flex justify-center">
              <button
                type="button"
                className="flex items-center transition-all bg-transparent border-2 border-accent hover:bg-accent text-accent hover:text-accent-content p-1 rounded"
                onClick={() => setFormIsOpen(true)}
              >
                Create New Record <BiEdit className="ml-2" />
              </button>
            </div>
          <div className="w-full flex justify-between mt-3">
            <button type="button" onClick={() => setIsOpen(false)}>
              Close
            </button>
            <div className="tooltip" data-tip="Requires Location">
              <button
                type="button"
                className="btn btn-sm btn-accent rounded text-md font-medium capitalize w-[120px]"
                onClick={searchNav}
              >
                {loading ? (
                  <ImSpinner8 className="animate-spin" />
                ) : (
                  "Find My Fix!"
                )}
              </button>
              <p className="text-2xs sm:hidden">Requires location</p>
            </div>
            <button
              type="button"
              ref={editButton}
              onClick={() => setIsEditing(!isEditing)}
            >
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
        <Dialog.Panel className="mx-5 max-w-lg rounded bg-base-200 p-10 flex flex-col items-center jsutify-center w-5/6">
          <div className="max-w-60 max-h-72 overflow-hidden relative flex items-center justify-center">
            {preview ? (
              <img src={preview} alt="preview" />
            ) : (
              <img
                src={
                  car.image
                    ? car.image
                    : "https://kaleidousercontent.com/removebg/designs/b6f1aec1-de72-4e0e-9921-6ab407475be2/thumbnail_image/car-photo-optimizer-thumbnail.png"
                }
                alt="car"
                className="object-cover z-10 blur-sm"
                width="100%"
                height="auto"
              />
            )}
            {!preview && (
              <p className="absolute text-white font-bold text-lg left-[100vw-50%] z-50 hover:text-accent hover:cursor-pointer">
                Edit Photo
              </p>
            )}
            <form id="change-image" onSubmit={uploadImage}>
              <input
                type="file"
                name="newImage"
                id="newImage"
                className="absolute z-50 hover:cursor-pointer left-[10%] top-[45%] opacity-0"
                onChange={handleImage}
              />
            </form>
          </div>
          {newImage && (
            <button
              type="submit"
              form="change-image"
              className="btn btn-sm capitalize mt-3"
            >
              Change Image
            </button>
          )}
          <div className="flex border-b-2 border-stone-600 text-xl sm:text-3xl flex-wrap justify-center">
            <h2 className="mx-1">{car.year}</h2>
            <h2 className="mx-1">{car.make}</h2>
            <h2 className="mx-1">{car.model}</h2>
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
                  <Dialog.Panel className="absolute bg-base-100 w-max rounded p-5">
                    <div className="flex flex-col items-center justify-between">
                      <p className="text-lg">Delete Car?</p>
                      <div className="flex m-1 mt-8 justify-between">
                        <button
                          type="button"
                          className=" mx-8 font-bold text-lg text-red-700 hover:text-red-600"
                          onClick={() => {
                            handleDelete(car.id);
                          }}
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          className=" mx-8 font-bold text-lg text-stone-700 hover:text-stone-500"
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
          <div className="m-3 w-full flex flex-col items-center">
            <h2 className="font-semibold underline text-2xl">Work needed</h2>
            <div className="overflow-y-scroll max-h-[180px] md:w-1/2 w-full">
            <ul className="overflow-y-hidden w-full">
              {car.service_list &&
                car.service_list.flat().map((i) => (
                  <li
                    key={i}
                    className="capitalize font-light text-xl list-disc py-1"
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
            </div>
              </div>
            <div className="relative flex items-end mt-3 sm:mt-1">
              <ServicePicker
                items={items}
                setItems={setItems}
                serviceList={serviceList}
                query={query}
                setQuery={setQuery}
              />
              <button
                className="bg-accent hover:bg-accent-focus px-2 m-1 mt-2 rounded text-accent-content transition-all duration-300"
                onClick={() => {
                  addService(car.id);
                }}
              >
                Add
              </button>
            </div>
            <div className="records invisible border-t-2 mt-2 py-2 border-base-300 w-full sm:w-1/2 flex justify-center">
              <button
                type="button"
                className="flex items-center transition-all bg-transparent border-2 border-accent hover:bg-accent text-accent hover:text-accent-content p-1 rounded"
                onClick={() => setFormIsOpen(true)}
              >
                Create New Record <BiEdit className="ml-2" />
              </button>
            </div>
          <div className="w-full flex justify-between">
            <button type="button" onClick={() => setIsOpen(false)}>
              Close
            </button>
            <div className="tooltip" data-tip="Requires Location">
              <button
                type="button"
                className="btn btn-sm btn-accent rounded invisible text-md font-medium capitalize w-[120px]"
                onClick={searchNav}
              >
                {loading ? (
                  <ImSpinner8 className="animate-spin" />
                ) : (
                  "Find My Fix!"
                )}
              </button>
              <p className="text-2xs invisible">Requires location</p>
            </div>
            <button type="button" onClick={() => setIsEditing(!isEditing)}>
              Done
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );

  const recordModal = (
    <>
      <Dialog
        open={recordIsOpen}
        onClose={() => {
          setRecordIsOpen(false);
          setIsEditing(false);
        }}
        className="relative"
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true">
          <div className="fixed inset-0 flex items-center justify-center p-4 w-full">
            <Dialog.Panel className="z-50 absolute rounded-2xl max-w-lg bg-base-200 flex flex-col items-center justify-center w-5/6">
              <div className="w-full">
                <RecordDetail
                  key={record.id}
                  {...record}
                  currentCar={car}
                  getRecordDetail={getRecordDetail}
                  setRecordIsOpen={setRecordIsOpen}
                  dataChanged={dataChanged}
                  setDataChanged={setDataChanged}
                />
              </div>
              <button
                type="button"
                className="font-medium text-lg"
                onClick={() => setRecordIsOpen(false)}
              >
                Close
              </button>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );

  const garageDisplay = garage.map((car) => (
    <li
      key={car.id}
      className="flex items-center m-2 p-2 bg-base-300 rounded shadow-md"
    >
      <button
        type="button"
        onClick={() => {
          getCarDetail(car.id);
          setIsOpen(!isOpen);
        }}
        className={`flex items-center border-4 border-transparent hover:border-accent-focus rounded py-2`}
      >
        <div className="overflow-hidden w-1/2 max-h-52 relative flex items-center justify-center">
          <img
            src={
              car.image
                ? car.image
                : "https://kaleidousercontent.com/removebg/designs/b6f1aec1-de72-4e0e-9921-6ab407475be2/thumbnail_image/car-photo-optimizer-thumbnail.png"
            }
            alt="car"
            className="object-cover"
            width="100%"
            height="100%"
          />
        </div>
        <div className="w-1/2">
          <h2 className="w-full font-semibold">
            {car.year} {car.make} {car.model}
          </h2>
        </div>
      </button>
    </li>
  ));

  const recordDisplay = garage.map((car) => (
    <li key={car.id} className="my-10">
      <h2 className="w-full font-semibold">
        {car.year} {car.make} {car.model}
      </h2>
      <div>
        <ul className="">
          {car.records &&
            car.records.map((record) => (
              <li key={record.id}>
                <button
                  type="button"
                  className="w-5/6 md:w-2/3 hover:bg-accent-focus rounded"
                  onClick={() => {
                    getRecordDetail(car.id, record.id);
                    setRecordIsOpen(true);
                  }}
                >
                  <div className="flex justify-between w-full">
                    <p>{record.date && format(new Date(record.date), 'MM-dd-yyyy')}</p>
                    <p className="capitalize">{record.service}</p>
                  </div>
                </button>
              </li>
            ))}
        </ul>
      </div>
    </li>
  ));

  return (
    <>
      {recordModal}
      {isEditing ? editCarModal : carModal}
      {formModal}
      <div
        className={`flex flex-col bg-base-100 items-center shadows justify-center w-full min-h-screen ${
          isOpen && `blur`
        }`}
      >
        <div className="bg-base-100 border-2 border-base-200 shadow-xl rounded flex flex-col pb-3 mx-auto my-5 sm:w-5/6 md:w-2/3 lg:w-1/2">
          <div className="w-full bg-neutral rounded-t py-2">
            <h2 className="text-3xl font-medium text-neutral-content">
              My Garage
            </h2>
          </div>
          <ul className="px-3 pt-1 lg:grid lg:grid-flow-col lg:grid-rows-2 lg:divide-y-0">
            {garageDisplay}
          </ul>
          <Link
            to="/add-car"
            className="text-accent font-medium text-xl hover:underline hover:text-accent-focus"
          >
            Add a Car
          </Link>
        </div>
        <div className="bg-base-100 border-2 border-base-200 shadow-xl rounded flex flex-col pb-3 mx-auto my-5 w-full sm:w-5/6 md:w-2/3 lg:w-1/2">
          <div className="w-full bg-neutral rounded-t py-2">
            <h2 className="text-3xl font-medium text-neutral-content">
              My Records
            </h2>
          </div>
          <ul className="px-3 pt-1 lg:grid lg:grid-flow-col lg:grid-rows-2 lg:divide-y-0">
            {recordDisplay}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
