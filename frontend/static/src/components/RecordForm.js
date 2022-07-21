import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ServicePicker from "./ServicePicker";

function handleError(err) {
  console.warn(err);
}

const RecordForm = ({
  currentCar,
  setCurrentCar,
  garage,
  dataChanged,
  setDataChanged,
  setFormIsOpen,
  deleteService,
}) => {
  const [shop, setShop] = useState("");
  const [formCar, setFormCar] = useState('');
  const [shops, setShops] = useState([]);
  const [image, setImage] = useState('');
  const [date, setDate] = useState('');
  const [cost, setCost] = useState('');
  const [note, setNote] = useState("");
  const [service, setService] = useState([]);
  const [preview, setPreview] = useState('');
  const [query, setQuery] = useState("");

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const getShops = async () => {
    const response = await fetch(`/api/v1/shops/`).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    setShops(json);
  };

  useEffect(() => {
    getShops();
  }, []);

  const submitRecord = async () => {
    const formData = new FormData();
    formData.append("shop", shop);
    image && formData.append("image", image);
    formData.append("note", note);
    formData.append("service", JSON.stringify(service));
    formData.append("cost", cost);
    currentCar && formData.append("car", currentCar.id);
    formCar && formData.append('car', formCar)
    formData.append("date", date);

    const options = {
      method: "POST",
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      body: formData,
    };
    const response = await fetch(
      `/api/v1/cars/${currentCar.id}/records/`,
      options
    ).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    console.log(json);
    deleteService(json.service, currentCar.id);
    setShop("");
    setImage(null);
    setPreview(null);
    setNote("");
    setDate(null);
    setService([]);
    setCost(0);
    setDataChanged(!dataChanged);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitRecord();
    setTimeout(() => {
      setFormIsOpen(false);
    }, 300);
  };

  return (
    <>
      {currentCar ? (
        <h2 className={`text-3xl font-bold`}>
          {currentCar.year} {currentCar.make} {currentCar.model}
        </h2>
      ) : (
        <h2 className={`text-3xl font-bold`}>
          {formCar.year} {formCar.make} {formCar.model}
        </h2>
      )}
      <div>
        <select
          name="currentCar"
          id="currentCar"
          className="p-1 rounded bg-white text-black"
          value={formCar}
          onChange={(e) => setFormCar(e.target.value)}
        >
          <option value="">Choose your Car</option>
          {garage.map((car) => (
            <option value={car.id}>
              {car.year} {car.make} {car.model}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full flex flex-col items-center">
        <form
          id="record-form"
          className="flex flex-col items-start m-3"
          onSubmit={handleSubmit}
        >
          <label htmlFor="services">Service</label>
          <div>
            <ServicePicker
              items={service}
              setItems={setService}
              serviceList={formCar && garage && garage.filter(car => car.id === formCar)[0]?.service_list.flat()}
              query={query}
              setQuery={setQuery}
            />
          </div>
          <label htmlFor="date">Date of Service</label>
          <input
            type="date"
            name="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded p-1 bg-white"
          />
          <label htmlFor="shop">Shop</label>
          <select
            name="shop"
            className="p-1 rounded bg-white"
            id="shop"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
          >
            <option value="">Choose a Shop</option>
            {shops &&
              shops.map((shop) => (
                <option value={shop.name}>{shop.name}</option>
              ))}
          </select>
          <div className="flex flex-col items-start">
            <label htmlFor="cost">Cost of Service</label>
            <div className="flex items-center justify-start relative sm:-left-6">
              <span className="px-2">$</span>
              <input
                type="number"
                name="cost"
                id="cost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="p-1 rounded w-1/2 bg-white"
              />
            </div>
          </div>
          <label htmlFor="image" className="mt-3 mb-1">
            Upload a Photo
          </label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleImage}
            className="w-5/6 file:btn file:btn-sm file:btn-accent file:hover:bg-accent-focus mb-3"
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              width="30%"
              className="sm:absolute right-0 bottom-36"
            />
          )}
          <label htmlFor="note">Note</label>
          <textarea
            name="note"
            id="note"
            cols="25"
            rows="5"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="text-neutral p-1 bg-white rounded"
          ></textarea>
          <div className="flex justify-center mt-3">
          <button type="submit" className="btn btn-sm mt-2 btn-accent rounded">
            Submit
          </button>
          <p className="italic text-sm p-1 ml-2">Submitting a record will remove the selected services from this car's Work Needed.</p>
          </div>
        </form>
      </div>
    </>
  );
};

export default RecordForm;
