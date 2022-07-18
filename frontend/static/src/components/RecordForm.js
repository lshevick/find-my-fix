import { useState } from "react";

const RecordForm = ({ currentCar }) => {
  const [shop, setShop] = useState("");
  const [image, setImage] = useState(null);
  const [note, setNote] = useState("");
  const [service, setService] = useState("");
  const [preview, setPreview] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
    <h2> {currentCar.year} {currentCar.make} {currentCar.model}</h2>
      <form id="record-form" className="flex flex-col items-start">
        <label htmlFor="shop">Shop</label>
        <input
          type="text"
          name="shop"
          id="shop"
          value={shop}
          onChange={(e) => setShop(e.target.value)}
        />
        <label htmlFor="image">Upload a Photo</label>
        <input
          type="file"
          name="image"
          id="image"
          onChange={(e) => setImage(e.target.value)}
        />
        <label htmlFor="note">Note</label>
        <input
          type="text"
          name="note"
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </form>
    </>
  );
};

export default RecordForm;
