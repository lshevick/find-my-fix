import { useState } from "react";
import Cookies from "js-cookie";
import { AiFillEdit, AiOutlineClose } from "react-icons/ai";
import { Rating } from "@mui/material";
import {BiTrashAlt} from 'react-icons/bi'

function handleError(err) {
  console.warn(err);
}

const ReviewDetail = ({
  id,
  body,
  rating,
  username,
  service,
  shopId,
  getReviews,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBody, setNewBody] = useState(body);
  const [newRating, setNewRating] = useState(rating);
  const [newService, setNewService] = useState(service);

  const saveNewReview = async () => {
    const data = {
      body: newBody,
      rating: newRating,
      service: newService,
    };
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(
      `/api/v1/shops/${shopId}/reviews/${id}`,
      options
    ).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    console.log(json);
    getReviews();
  };

  const deleteReview = async() => {
    const options = {
    method: 'DELETE',
    headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': Cookies.get('csrftoken'),
    },
    }
    const response = await fetch(`/api/v1/shops/${shopId}/reviews/${id}/`, options).catch(handleError);
    if(!response.ok) {
    throw new Error('Network response not ok');
    }
    const json = await response.json(); 
    console.log(json)
    getReviews();
    setIsEditing(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    saveNewReview();
    setNewBody(newBody);
    setNewRating(newRating);
    setNewService(newService);
    setIsEditing(false);
  };

  const reviewDetail = (
    <li className="rounded relative shadow-md bg-base-300 p-2 my-1 flex flex-col items-start w-full">
      <div>
        <span className="mr-2 font-bold">{username}</span>
        <Rating name="read-only" value={rating} precision={1} readOnly />
      </div>
      <div>
        <ul className="flex">
          {service &&
            service.map((s) => (
              <li
                key={s}
                className="font-light text-md capitalize mr-1 p-1 bg-base-200 shadow-sm rounded"
              >
                {s}
              </li>
            ))}
        </ul>
      </div>
      <p>{body}</p>
      {Cookies.get("username") === username && (
        <div className="absolute top-2 right-3">
          <button type="button" onClick={() => setIsEditing(!isEditing)}>
            <AiFillEdit />
          </button>
        </div>
      )}
    </li>
  );

  const editReviewDetail = (
    <li className="rounded relative shadow-md bg-base-300 p-2 my-1 flex flex-col items-start w-full">
      <form id="newReviewForm" onSubmit={handleSubmit}>
        <div>
          <span className="mr-2 font-bold">{username}</span>
          <Rating name="rating" value={newRating} precision={1} onChange={(e, r) => setNewRating(r) } />
        </div>
        <div>
          <ul className="flex">
            {service &&
              service.map((s) => (
                <li
                  key={s}
                  className="font-light text-md capitalize mr-1 p-1 bg-base-200 shadow-sm rounded"
                >
                  {s}
                </li>
              ))}
          </ul>
        </div>
        <input
          type="text"
          name="newBody"
          id="newBody"
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
        />
        {Cookies.get("username") === username && (
          <div className="absolute top-2 right-3">
            <button type="button" onClick={() => deleteReview()} className='px-2 mx-3 hover:text-error'><BiTrashAlt/></button>
            <button type="button" onClick={() => setIsEditing(!isEditing)}>
              <AiOutlineClose/>
            </button>
          </div>
        )}
        <div className="absolute bottom-2 right-2">
          <button type="submit" form="newReviewForm" className="text-success hover:text-accent-focus">
            Save Changes
          </button>
        </div>
      </form>
    </li>
  );

  return <>{isEditing ? editReviewDetail : reviewDetail}</>;
};

export default ReviewDetail;
