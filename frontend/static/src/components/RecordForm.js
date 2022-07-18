import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ServicePicker from "./ServicePicker";

function handleError(err) {
  console.warn(err);
}

const RecordForm = ({ currentCar }) => {
  const [shop, setShop] = useState("");
  const [shops, setShops] = useState([]);
  const [image, setImage] = useState(null);
  const [note, setNote] = useState("");
  const [service, setService] = useState([]);
  const [preview, setPreview] = useState(null);
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

    const options = {
      method: "POST",
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      body: formData,
    };
    const response = await fetch(`//`, options).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    console.log(json);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitRecord();
  };

  return (
    <>
      <h2>
        {currentCar.year} {currentCar.make} {currentCar.model}
      </h2>
      <form
        id="record-form"
        className="flex flex-col items-center m-3"
        onSubmit={handleSubmit}
      >
        <label htmlFor="shop">Shop</label>
        <select
          className="p-1 rounded"
          name="shop"
          id="shop"
          value={shop}
          onChange={(e) => setShop(e.target.value)}
        >
          <option value="">Choose a Shop</option>
          {shops &&
            shops.map((shop) => <option value={shop.name}>{shop.name}</option>)}
        </select>
        <label htmlFor="image" className="mt-3 mb-1">
          Upload a Photo
        </label>
        <input
          type="file"
          name="image"
          id="image"
          onChange={(e) => setImage(e.target.value)}
          className="w-5/6 file:btn file:btn-sm file:btn-accent mb-3"
        />
        <label htmlFor="services">Service</label>
        <div>
          <ServicePicker
            items={service}
            setItems={setService}
            serviceList={currentCar.service_list.flat()}
            query={query}
            setQuery={setQuery}
          />
        </div>
        <label htmlFor="note">Note</label>
        <textarea
          name="note"
          id="note"
          cols="25"
          rows="5"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
        <button type="submit" className="btn btn-sm btn-accent mt-3">
          Submit
        </button>
      </form>
    </>
  );
};

export default RecordForm;
