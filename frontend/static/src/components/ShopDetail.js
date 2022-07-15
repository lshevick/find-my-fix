import { Rating } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
// import Cookies from "js-cookie";
import ReviewForm from "./ReviewForm";

function handleError(err) {
  console.warn(err);
}

// need to get services from shop itself to allow users to pick from the service they had done

const ShopDetail = () => {
  const [detail, setDetail] = useState([]);
  const [items, setItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const params = useParams();
  const [dataChanged, setDataChanged] = useState(false);
  const [isAuth, setIsAuth, navigate, location, setLocation] =
    useOutletContext();

  const getShopDetail = async () => {
    const response = await fetch(`/api/v1/shops/${params.shopId}/`).catch(
      handleError
    );
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
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
  }, [dataChanged]);

  const shopServiceList =
    detail.services &&
    detail.services.map((i) => (
      <li key={i} className="capitalize py-2">
        {i}
      </li>
    ));

  const reviewList = reviews.map((r) => (
    <li
      key={r.id}
      className="rounded shadow-md bg-base-300 p-2 my-1 flex flex-col items-start w-full"
    >
      <div>
        <span className="mr-2 font-bold">{r.username}</span>
        <Rating name="read-only" value={r.rating} precision={1} readOnly />
      </div>
      <div>
        <ul className="flex">
          {r.service &&
            r.service.map((s) => (
              <li
                key={s}
                className="font-light text-md capitalize mr-1 p-1 bg-base-200 shadow-sm rounded"
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
    <div
      key={detail.id}
      className="grid grid-cols-1 md:grid-cols-2 bg-base-100 h-full p-3 min-h-screen w-full lg:w-5/6"
    >
      <div className="col-start-1">
        <h1 className="text-accent-focus text-4xl font-semibold">
          {detail.name}
        </h1>
        <div className="flex flex-col items-center justify-center">
          <a href="phone" className="font-medium link">
            {detail.phone}
          </a>
          <p className="font-bold text-lg">{detail.address}</p>
          <a
            href={`${detail.website}`}
            target="blank"
            className="font-medium link visited:text-violet-700"
          >
            {detail.website}
          </a>
        </div>
      </div>
      <div className="flex flex-col sm:col-start-1 items-start justify-start ml-2 mt-10">
        <h2 className="font-medium text-3xl">Services</h2>
        <ul className="flex flex-col items-start divide-y-2 text-xl">
          {shopServiceList}
        </ul>
      </div>
      <div className="w-full mt-10 sm:col-start-1">
        <h2>This shop works on:</h2>
        <ul className="grid grid-flow-col-dense grid-rows-3 sm:grid-rows-2 md:grid-rows-1">
          {detail.makes &&
            detail.makes.map((m) => (
              <li
                key={m}
                className="capitalize m-1 p-1 bg-base-300 rounded-md w-5/6 mx-auto"
              >
                {m}
              </li>
            ))}
        </ul>
      </div>
      <div className="sm:col-start-2">
        <div>
          <ul>{items && items.map((i) => <li key={i}>{i}</li>)}</ul>
        </div>
        {isAuth && (
          <ReviewForm
            detail={detail}
            dataChanged={dataChanged}
            setDataChanged={setDataChanged}
            items={items}
            setItems={setItems}
          />
        )}
      </div>
      <div className="flex flex-col sm:col-start-2 rounded m-2 p-2">
        <p className="font-medium text-2xl">Reviews</p>
        <ul className="flex flex-col items-center">{reviewList}</ul>
      </div>
    </div>
  );

  return <>{shopInfo}</>;
};

export default ShopDetail;
