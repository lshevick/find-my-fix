import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Cookies from "js-cookie";
import { FaLocationArrow } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { Popover } from "@headlessui/react";

function handleError(err) {
  console.warn(err);
}

// need to implement some sort of checkbox/selection menu or search w/ filtering so users
// can pull up relevant shops based off of the services needed on their car.
// should probably somehow link the user's cars to this page so results that come up are relavant
// to what services and what the make of their car is
// they can filter these results by location, reviews based on a service

const ShopList = () => {
  const [shops, setShops] = useState(undefined);
  const [open, setOpen] = useState(false);
  const [isAuth, setIsAuth, navigate, location, setLocation] =
    useOutletContext();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("distance");

  const shopListTemplate = (i) => (
    <li
      key={i.id}
      className="mx-auto my-3 p-2 rounded shadow-md w-5/6 bg-stone-300"
    >
      <div className="flex items-start">
        <Link to={`/shops/${i.id}`}>
          <h2 className="text-xl font-sans font-medium text-black hover:scale-105 hover:text-red-900 transition-all">
            {i.name}
          </h2>
        </Link>
      </div>
      <div className="flex items-start">
        <p>
          {i.distance &&
            i.distance.toFixed() +
              ` mile${Math.floor(i.distance) === 1 ? "" : "s"}`}
        </p>
      </div>
      <div className="flex items-start">
        <p className="italic font-light text-sm">
          Total reviews {i.reviews.length}
        </p>
      </div>
      <ul className="text-sm font-light flex flex-wrap">
        {i.services.map((i) => (
          <li key={i} className="bg-stone-300 shadow-sm m-1 px-1 rounded">
            {i}
          </li>
        ))}
      </ul>
    </li>
  );

  const reviewFilteredShops =
    shops &&
    [...shops]
      .sort((a, b) => b.reviews.length - a.reviews.length)
      .map((i) => shopListTemplate(i));

  const getDistanceShops = async () => {
    const response = await fetch(
      `/api/v1/shops/?location_string=${
        Array.isArray(location) ? location.join(",") : location
      }`
    ).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    console.log(json);
    setShops(json);
  };

  useEffect(() => {
    location && getDistanceShops();
  }, []);

  const shopList = shops && shops.map((i) => shopListTemplate(i));

  // const getShopsByReviews = async () => {
  //   const response = await fetch(`/api/v1/shops/sorted_reviews/`).catch(
  //     handleError
  //   );
  //   if (!response.ok) {
  //     throw new Error("Network response not ok");
  //   }
  //   const json = await response.json();
  //   console.log(json);
  //   setShops(json);
  // };

  const getLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition((p) => {
      console.log(p.coords.latitude, p.coords.longitude);
      setLocation([p.coords.latitude, p.coords.longitude]);
      setLoading(false);
    });
  };

  return (
    <>
      <div className="flex flex-col w-full items-center bg-[#f1faee] relative">
        <h1 className="font-bold text-xl mt-5">
          Enter your location to find shops
        </h1>
        <div className="flex items-end">
          <input
            className={`mt-3 p-1 shadow-sm ${!location && `rounded-l-md`}`}
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter ZIP code..."
          />

          {!location && (
            <button
              type="button"
              className="p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-r-md shadow-md hover:shadow-lg transition-all"
              onClick={getLocation}
            >
              {loading ? (
                <ImSpinner8 className="animate-spin" />
              ) : (
                <FaLocationArrow />
              )}
            </button>
          )}
        </div>
        <div className="flex items-center mt-3">
          {location && (
            <button
              type="button"
              className="px-1 rounded text-emerald-700 border-emerald-700 border-2 hover:bg-emerald-700 hover:text-white transition-all"
              onClick={getDistanceShops}
            >
              Find My Fix!
            </button>
          )}
          <Popover className="relative">
            <Popover.Panel className='absolute z-10 top-10 bg-white/80 rounded shadow-sm min-w-max p-1'>
              <ul>
                <li>
                  <button
                    type="button"
                    className="underline m-1 hover:bg-stone-400 hover:rounded p-1"
                    onClick={() => setFilter("distance")}
                  >
                    by Distance
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="underline hover:bg-stone-400 hover:rounded p-1"
                    onClick={() => setFilter("reviews")}
                  >
                    by Reviews
                  </button>
                </li>
              </ul>
            </Popover.Panel>
            {location && <Popover.Button className='px-1 m-2 border-2 border-stone-500 rounded'>Filter</Popover.Button>}
          </Popover>
        </div>
        <ul className="mt-10 md:grid md:grid-cols-2 lg:grid-cols-3">
          {filter === "distance" && shopList}
          {filter === "reviews" && reviewFilteredShops}
        </ul>
      </div>
    </>
  );
};

export default ShopList;
