import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ServicePicker from "./ServicePicker";

function handleError(err) {
  console.warn(err);
}

const RecordForm = ({
  currentCar,
  garage,
  getCarDetail,
  dataChanged,
  setDataChanged,
  setFormIsOpen,
  deleteService,
}) => {
  const [shop, setShop] = useState("");
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
    formData.append("car", currentCar.id);
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
        <h2 className={`text-3xl font-bold h-10 transition-all flex-wrap ${currentCar ? 'opacity-1' : 'opacity-0'}`}>
          {currentCar.year} {currentCar.make} {currentCar.model}
        </h2>
      <div>
        <select
          name="currentCar"
          id="currentCar"
          className="p-1 rounded bg-base-100 text-base-content shadow-md"
          value={currentCar}
          onChange={(e) => getCarDetail(e.target.value)}
        >
          <option value="">Choose your Car</option>
          {garage.map((car) => (
            <option key={car.id} value={car.id}>
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
          <label htmlFor="services" className="mt-3">Service</label>
          <div>
            <ServicePicker
              items={service}
              setItems={setService}
              serviceList={currentCar.service_list && currentCar?.service_list.flat()}
              query={query}
              setQuery={setQuery}
            />
          </div>
          <label htmlFor="date" className="mt-3">Date of Service</label>
          <input
            type="date"
            name="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded p-1 bg-base-100 shadow-md"
          />
          <label htmlFor="shop" className="mt-3">Shop</label>
          <select
            name="shop"
            className="p-1 rounded bg-base-100 shadow-md"
            id="shop"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
          >
            <option value="">Choose a Shop</option>
            {shops &&
              shops.map((shop) => (
                <option key={shop.id} value={shop.name}>{shop.name}</option>
              ))}
          </select>
          <div className="flex flex-col items-start">
            <label htmlFor="cost" className="mt-3">Cost of Service</label>
            <div className="flex items-center justify-start">
              <span className="pr-1">$</span>
              <input
                type="number"
                name="cost"
                id="cost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="p-1 rounded w-1/2 bg-base-100 shadow-md"
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
            className="text-neutral p-1 bg-base-100 rounded shadow-md"
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
