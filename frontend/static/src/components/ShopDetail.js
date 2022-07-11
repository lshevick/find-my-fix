import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import ReviewForm from "./ReviewForm";

function handleError(err) {
  console.warn(err);
}

// need to get services from shop itself to allow users to pick from the service they had done

const ShopDetail = () => {
  const [detail, setDetail] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState("");
  const params = useParams();
  const [dataChanged, setDataChanged] = useState(false);

  const getShopDetail = async () => {
    const response = await fetch(`/api/v1/shops/${params.shopId}/`).catch(
      handleError
    );
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    console.log(json);
    setDetail(json);
  };

  const getReviews = async () => {
    const response = await fetch(
      `/api/v1/shops/${params.shopId}/reviews/`
    ).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    setReviews(json);
  };

  useEffect(() => {
    getShopDetail();
    getReviews();
  }, []);

  useEffect(() => {
    getReviews();
  }, [dataChanged])


  const shopServiceList =
    detail.services && detail.services.map((i) => <li key={i}>{i}</li>);

  const reviewList = reviews.map((r) => (
    <li
      key={r.id}
      className="bg-stone-300 p-2 my-1 flex flex-col items-start w-full"
    >
      <div>
        <span className="mr-2 font-bold">{r.username}</span>
        <span>{r.rating} stars</span>
      </div>
      <div>
        <ul>
          {r.service &&
            r.service.map((s) => (
              <li
                key={s}
                className="font-light text-md p-1 bg-stone-100 rounded"
              >
                {s}
              </li>
            ))}
        </ul>
      </div>
      <p>{r.body}</p>
    </li>
  ));

  const shopInfo = (
    <div key={detail.id} className="grid grid-cols-1 md:grid-cols-2 bg-stone-100 h-full p-3 min-h-screen w-full lg:w-5/6">
      <div className="col-start-1">
        <h1 className="text-red-900 text-4xl font-semibold">{detail.name}</h1>
        <div className="flex flex-col items-center justify-center">
          <p className="font-bold">{detail.phone}</p>
          <p className="font-bold">{detail.address}</p>
          <a href={`${detail.website}`} target='blank' className='font-bold underline text-blue-600 hover:text-blue-700 visited:text-violet-700'>{detail.website}</a>
        </div>
      </div>
      <div className="flex flex-col items-start mx-auto">
        <h2 className="underline font-medium text-lg">Services</h2>
        <ul className="flex flex-col items-start list-disc text-lg">
          {shopServiceList}
        </ul>
      </div>
      <div className="w-full">
        <h2>This shop services:</h2>
        <ul className="grid grid-flow-col-dense grid-rows-3 sm:grid-rows-2 md:grid-rows-1">
            {detail.makes.map(m => <li key={m} className='capitalize m-1 p-1 bg-white rounded-md'>{m}</li>)}
        </ul>
      </div>
      <div>
        <ReviewForm detail={detail} setDataChanged={setDataChanged} />
      </div>
      <div className="flex flex-col bg-neutral-50 my-2 p-2">
        <p className="underline font-medium">Reviews</p>
        <ul className="flex flex-col items-center">{reviewList}</ul>
      </div>
    </div>
  );

  return <>{shopInfo}</>;
};

export default ShopDetail;
