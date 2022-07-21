import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import Cookies from "js-cookie";
import { Dialog } from "@headlessui/react";
import format from "date-fns/format";
import {AiOutlineClose} from 'react-icons/ai';

function handleError(err) {
  console.warn(err);
}

const RecordDetail = ({
  id,
  note,
  shop,
  service,
  cost,
  date,
  image,
  car,
  getRecordDetail,
  setRecordIsOpen,
  dataChanged,
  setDataChanged,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newNote, setNewNote] = useState(note);
  const [newRecordImage, setNewRecordImage] = useState(null);
  const [newDate, setNewDate] = useState(date);
  const [recordPreview, setRecordPreview] = useState(image);
  const [openDelete, setOpenDelete] = useState(false);

  const handleRecordImage = (e) => {
    const file = e.target.files[0];
    setNewRecordImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setRecordPreview(reader.result);
      console.log("updated preview");
    };
    reader.readAsDataURL(file);
  };

  const handleDate = (e) => {
    setNewDate(format(new Date(e.target.value), 'yyyy-MM-dd'))
  }

  const updateRecord = async () => {
    const formData = new FormData();
    formData.append("note", newNote);
    formData.append("date", newDate);
    newRecordImage && formData.append("image", newRecordImage);

    const options = {
      method: "PATCH",
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      body: formData,
    };
    const response = await fetch(
      `/api/v1/cars/${car}/records/${id}/`,
      options
    ).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    console.log(json);
    setIsEditing(false);
};

const handleSubmit = (e) => {
    e.preventDefault();
    updateRecord();
    setTimeout(() => {
        getRecordDetail(car, id);
    }, 300);
  };

  const deleteRecord = async (id) => {
    const options = {
      method: "DELETE",
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };
    const response = await fetch(
      `/api/v1/cars/${car}/records/${id}/`,
      options
    ).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    console.log(json);
  };

  const handleRecordDelete = (id) => {
    deleteRecord(id);
    setTimeout(() => {
      setOpenDelete(false);
      setRecordIsOpen(false);
      setDataChanged(!dataChanged);
    }, 300);
  };

  const recordDetail = (
    <>
    <div className="card w-full relative shadow-md">
      <div className="absolute top-2 right-2">
        <label
          className={`btn btn-sm px-2 rounded-3xl swap swap-rotate btn-accent text-accent-content`}
          onChange={() => setIsEditing(!isEditing)}
        >
          <input type="checkbox" className="hidden" />
          <BiEdit className="swap-off" />
          <p className="swap-on">X</p>
        </label>
      </div>
      <div className="card-body">
        <h3 className="card-title">{shop}</h3>
        <p>{date && format(new Date(date), 'LLLL dd, yyyy')}</p>
        <p>Cost: ${cost}</p>
        <div>
          <ul className="capitalize grid grid-flow-cols w-1/2">
            {service &&
              service.map((service) => (
                <li key={service} className="bg-base-300 w-fit p-1 m-1 rounded">
                  {service}
                </li>
              ))}
          </ul>
        </div>
        {note}
      </div>
    </div>
      {image && (
        <img src={image} alt="record" className="self-center" />
      )}
      </>
  );

  const editRecordDetail = (
    <div className="card relative overflow-scroll h-96 sm:h-full">
      <form onSubmit={handleSubmit}>
        <div className="absolute top-2 right-2">
          <label
            className="btn btn-sm px-2 rounded-3xl swap swap-rotate btn-error text-accent-content"
            onChange={() => setIsEditing(!isEditing)}
          >
            <input type="checkbox" className="hidden" />
            <AiOutlineClose className="swap-off" />
            <p className="swap-on font-extrabold">X</p>
          </label>
        </div>
        <div className="card-body">
          <h3 className="card-title">{shop}</h3>
          <input
            type="date"
            name="date"
            id="date"
            value={newDate}
            onChange={(e) => handleDate(e)}
            className="bg-stone-200 p-1 rounded w-1/2"
          />
        <p>Cost: ${cost}</p>
          <div className="flex flex-col sm:flex-row">
            <ul className="capitalize flex">
              {service &&
                service.map((service) => (
                  <li key={service} className="bg-base-300 w-fit p-1 m-1 rounded">
                    {service}
                  </li>
                ))}
            </ul>
          </div>
          <textarea
            name="newNote"
            id="newNote"
            cols="10"
            rows="2"
            className="p-1 rounded bg-stone-200 text-black"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          ></textarea>
        </div>
        <figure className="relative flex justify-center max-h-[180px] overflow-hidden">
            <p className="absolute z-30 text-xl text-neutral font-bold">{image ? 'Change Image' : ''}</p>
          <input
            type="file"
            name="newRecordImage"
            id="newRecordImage"
            onChange={handleRecordImage}
            className="absolute z-40 opacity-0 file:cursor-pointer w-1/2"
          />
          {image ? (
            <img
              src={recordPreview}
              alt="record"
              className="object-cover blur-sm"
            />
          ) : (
            <div className="bg-stone-300 p-4 px-2 font-meduim text-lg text-black rounded">
              Add an Image +
            </div>
          )}
        </figure>
        <div className="flex items-center justify-end p-3">
          <button
            type="button"
            className="mx-1 px-2 font-bold text-lg text-error border-2 rounded border-error hover:bg-error hover:text-error-content"
            onClick={() => setOpenDelete(true)}
          >
            Delete
          </button>
          <Dialog
            className="relative"
            open={openDelete}
            onClose={() => setOpenDelete(false)}
          >
            <div className="fixed inset-0 bg-black/30">
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="absolute bg-base-100 w-max rounded p-5">
                  <div className="flex flex-col items-center justify-between">
                    <p className="text-lg">Delete this Record?</p>
                    <div className="flex m-1 mt-8 justify-between">
                      <button
                        type="button"
                        className=" mx-8 font-bold text-lg text-red-700 hover:text-red-600"
                        onClick={() => {
                          handleRecordDelete(id);
                        }}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        className=" mx-8 font-bold text-lg text-stone-700 hover:text-stone-500"
                        onClick={() => setOpenDelete(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </div>
            </div>
          </Dialog>
          <button
            type="submit"
            className="text-success font-bold text-lg px-2 rounded border-2 border-success hover:bg-success hover:text-success-content"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );

  return <>{isEditing ? editRecordDetail : recordDetail}</>;
};

export default RecordDetail;
