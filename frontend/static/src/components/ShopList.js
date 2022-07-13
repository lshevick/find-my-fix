import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Cookies from "js-cookie";
import { FaLocationArrow } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { Listbox, Popover } from "@headlessui/react";

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
  const [isAuth, setIsAuth, navigate, location, setLocation] =
    useOutletContext();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("distance");
  const [garage, setGarage] = useState([]);
  const [queryCar, setQueryCar] = useState(undefined);

  const getCars = async () => {
    const response = await fetch(`/api/v1/cars/`).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    setGarage(json);
  };

  useEffect(() => {
    getCars();
  }, []);

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
          <li key={i} className={`bg-stone-300 shadow-sm m-1 px-1 rounded ${queryCar && queryCar.service_list.includes(i) ? 'font-bold bg-teal-400' : '' }`}>
            {i}
          </li>
        ))}
      </ul>
    </li>
  );

  const getServiceShops = async () => {
    const response = await fetch(
      `/api/v1/shops/services/?location_string=${
        Array.isArray(location) ? location.join(",") : location
      }${
        garage
          ? `&specific_year=${queryCar.year}&specific_make=${queryCar.make}&specific_model=${queryCar.model}`
          : ``
      }`
    ).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    console.log(json);
    setShops(json);
  };

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

  const reviewFilteredShops =
    shops &&
    [...shops]
      .sort((a, b) => b.reviews.length - a.reviews.length)
      .map((i) => shopListTemplate(i));

  const shopList = shops && shops.map((i) => shopListTemplate(i));

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
        <div className="flex flex-col items-center">
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
          <div className={`relative mt-3 border-t-2 border-stone-500 ${location ? 'px-16' : 'px-48'}`}>
            {location && (
              <>
                <p className="font-bold text-xl mt-3">Choose your car (optional)</p>
                <Listbox value={queryCar} onChange={setQueryCar}>
                  {location && (
                    <Listbox.Button className="px-1 text-xl m-2 border-2 border-stone-500 rounded">
                      {queryCar ? queryCar.make : 'Car' }
                    </Listbox.Button>
                  )}
                  <Listbox.Options className="absolute z-10 top-10 bg-white/30 backdrop-blur-sm border-white/30 rounded shadow-sm min-w-max p-1">
                    {garage.map((car) => (
                      <Listbox.Option
                        key={car.id}
                        value={car}
                        className="p-1 cursor-pointer hover:underline"
                      >
                        {car.make} {car.model}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center mt-3">
          {location && (
            <button
              type="button"
              className="px-1 text-xl rounded text-emerald-700 border-emerald-700 border-2 hover:bg-emerald-700 hover:text-white transition-all"
              onClick={getDistanceShops}
            >
              Find My Fix!
            </button>
          )}
          <div className="flex">
            <Popover className="relative">
              <Popover.Panel className="absolute z-30 top-10 bg-white/30 backdrop-blur-sm border-white/30 rounded shadow-sm min-w-max p-1">
                <ul>
                  <li>
                    <button
                      type="button"
                      className="hover:underline mt-2"
                      onClick={() => setFilter("distance")}
                    >
                      by Distance
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="hover:underline mt-2"
                      onClick={() => setFilter("reviews")}
                    >
                      by Reviews
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="hover:underline mt-2"
                      onClick={() => {
                        setFilter("services");
                        getServiceShops();
                      }}
                    >
                      by Service
                    </button>
                  </li>
                </ul>
              </Popover.Panel>
              {location && (
                <Popover.Button className="px-1 text-xl m-2 border-2 border-stone-500 rounded">
                  Sort
                </Popover.Button>
              )}
            </Popover>
          </div>
        </div>
        <ul className="mt-10 md:grid md:grid-cols-2 lg:grid-cols-3">
          {filter === "distance" && shopList}
          {filter === "reviews" && reviewFilteredShops}
          {filter === "services" && shopList}
        </ul>
      </div>
    </>
  );
};

export default ShopList;
