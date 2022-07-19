import { useState } from "react";
import Cookies from "js-cookie";
import { Rating } from "@mui/material";
import ServicePicker from "./ServicePicker";

function handleError(err) {
  console.warn(err);
}

const ReviewForm = ({
  detail,
  dataChanged,
  setDataChanged,
  items,
  setItems,
}) => {
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(1);
  const [query, setQuery] = useState("");

  const serviceList = detail.services && detail.services;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const data = {
      service: items,
      body: body,
      rating: rating,
      shop: detail.id,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(
      `/api/v1/shops/${detail.id}/reviews/`,
      options
    ).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    console.log(json);
    setItems([]);
    setBody("");
    setQuery("");
    setRating(1);
    setDataChanged(!dataChanged);
  };

  return (
    <>
      <form
        onSubmit={handleReviewSubmit}
        className="bg-base-300 rounded flex flex-col items-center"
      >
        <label htmlFor="body" className="text-3xl">
          Review a Service
        </label>
        <div className="w-1/2">
          <ServicePicker
            items={items}
            setItems={setItems}
            serviceList={serviceList}
            query={query}
            setQuery={setQuery}
          />
        </div>
        <div className="mt-3">
          <Rating
            name="rating"
            value={rating}
            onChange={(e, newRating) => {
              setRating(newRating);
            }}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-end justify-center">
          <textarea
            className="m-3 p-1 rounded-md text-stone-900"
            name="body"
            id="body"
            cols="30"
            rows="5"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={items === [] ? true : false}
            autoComplete="off"
            placeholder="Write your review..."
          ></textarea>
          <button
            type="submit"
            className="p-1 my-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md shadow-md hover:shadow-lg transition-all"
          >
            Send
          </button>
        </div>
      </form>
    </>
  );
};

export default ReviewForm;
