import { useState } from "react";
import Cookies from "js-cookie";
import { Combobox } from "@headlessui/react";
import { Rating } from "@mui/material";
import { TbSelector } from "react-icons/tb";

function handleError(err) {
  console.warn(err);
}

const ReviewForm = ({ detail, setDataChanged, items, setItems }) => {
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(0.5);
  const [query, setQuery] = useState("");

  const serviceList = detail.services && detail.services;

  const filteredServices =
    query === ""
      ? serviceList
      : serviceList.filter((s) => {
          return s.toLowerCase().includes(query.toLowerCase());
        });

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
    setRating(0)
    setDataChanged(true);
  };

  return (
    <>
      <form onSubmit={handleReviewSubmit} className="bg-red-300 rounded">
        <label htmlFor="body" className="text-2xl">
          Write A Review
        </label>
        <div className="flex flex-col items-center relative">
          <Combobox
            name="service_list"
            value={items}
            onChange={setItems}
            multiple
          >
            <div className="relative">
              <Combobox.Input
                displayValue={(items) => items}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a service..."
                className="p-1 pr-10 rounded-md shadow-md text-gray-900"
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <TbSelector className="h-5 w-5 text-gray-400" />
              </Combobox.Button>
            </div>
            <Combobox.Options className="bg-stone-200/60 w-1/2 border-2 border-stone-200/40 absolute top-8 z-20 rounded">
              {filteredServices && (filteredServices.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing Found.
                </div>
              ) : (
                filteredServices.map((s) => (
                  <Combobox.Option
                    key={s}
                    value={s}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-4 pr-2 ${
                        active ? "bg-teal-600 text-white" : "text-gray-900"
                      }`
                    }
                  >
                    {({items, active}) => (
                        <>
                            <span className={`block truncate ${items ? 'font-medium' : 'font-normal'}`}>
                                {s}
                            </span>
                            {items ? (
                                <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'}`}>
                                    check
                                </span>
                            ) : null}
                        </>
                    )}
                  </Combobox.Option>
                ))
              ))}
            </Combobox.Options>
          </Combobox>
        </div>
        <div className="flex items-center justify-center">
        <input
          className="m-3 p-1 rounded-md"
          type="text"
          name="body"
          id="body"
          value={body}
          disabled={items === [] ? true : false}
          onChange={(e) => setBody(e.target.value)}
          autoComplete="off"
          placeholder="Write your review..."
          />
        <button
          type="submit"
          className="p-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md shadow-md hover:shadow-lg transition-all"
          >
          Send
        </button>
            </div>
            <div>
                <Rating name='rating' value={rating} onChange={(e, newRating) => {setRating(newRating)}} precision={0.5} />
            </div>
      </form>
    </>
  );
};

export default ReviewForm;
