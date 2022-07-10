import { useState } from "react";
import Cookies from "js-cookie";
import { Combobox } from "@headlessui/react";

function handleError(err) {
    console.warn(err);
  }

const ReviewForm = ({ detail, setDataChanged }) => {
  const [body, setBody] = useState("");
  const [items, setItems] = useState([])
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
    setQuery('');
    setDataChanged(true);
  };

  return (
    <>
      <form onSubmit={handleReviewSubmit}>
        <label htmlFor="body">Write A Review</label>
        <div className="flex flex-col items-center">
          <Combobox
            name="service_list"
            value={items}
            onChange={setItems}
            multiple
          >
            <Combobox.Input
              displayValue={(items) => items}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a service..."
            />
            <Combobox.Options className="bg-stone-400 w-1/2 border-2 border-stone-600 rounded">
              {filteredServices &&
                filteredServices.map((s) => (
                  <Combobox.Option
                    key={s}
                    value={s}
                    className="cursor-pointer hover:underline"
                  >
                    {s}
                  </Combobox.Option>
                ))}
            </Combobox.Options>
          </Combobox>
        </div>
        <input
          className="my-3"
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
      </form>
    </>
  );
};

export default ReviewForm;
