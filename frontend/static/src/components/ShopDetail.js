import { Rating } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import Cookies from "js-cookie";
import ReviewForm from "./ReviewForm";
import {AiFillEdit} from 'react-icons/ai';
import ReviewDetail from "./ReviewDetail";

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
      <li
        key={i}
        className="capitalize font-medium p-2 my-2 md:m-2 bg-base-300 rounded"
      >
        {i}
      </li>
    ));

  const reviewList = reviews.map((r) =>
    <ReviewDetail key={r.id} {...r} reviews={reviews} getReviews={getReviews} shopId={params.shopId} />
  );

  const shopInfo = (
    <div
      key={detail.id}
      className="grid md:gap-4 grid-cols-1 md:grid-cols-4 bg-base-100 h-full p-3 min-h-screen w-full lg:w-5/6"
    >
      <div className="md:col-start-2 md:col-span-2 md:row-start-2">
        <h1 className="text-accent-focus text-4xl lg:text-6xl lg:mb-3 lg:font-bold font-semibold">
          {detail.name}
        </h1>
        <div className="flex flex-col items-center justify-center">
          <a href={`tel:${detail.phone}`} className="font-medium link">
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
      <div className="flex flex-col md:col-start-1 md:col-span-2 md:row-start-3 md:self-center items-center justify-start">
        <h2 className="font-medium text-3xl">Services</h2>
        <ul className="grid grid-cols-1 sm:grid-flow-col grid-rows-3 sm:grid-rows-2 md:grid-rows-2 text-xl">
          {shopServiceList}
        </ul>
      </div>
      <div className="w-full mt-10 md:my-auto md:col-start-3 md:row-start-3 md:col-span-2 text-xl items-center">
        <h2 className="text-2xl font-medium">This shop works on:</h2>
        <ul className="grid grid-flow-col-dense grid-rows-3 sm:grid-rows-2 md:grid-rows-2">
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
      <div className="md:col-start-2 md:col-span-2 md:row-start-4 self-start m-2 p-2">
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
      <div className="flex flex-col md:col-start-2 md:col-span-2 md:row-start-5 rounded self-start m-2 p-2">
        <p className="font-medium text-2xl">Reviews</p>
        <ul className="flex flex-col items-center">{reviewList}</ul>
      </div>
    </div>
  );

  return <>{shopInfo}</>;
};

export default ShopDetail;
