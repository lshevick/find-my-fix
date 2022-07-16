import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Cookies from "js-cookie";
import { FaLocationArrow } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { GoCheck } from "react-icons/go";
import { Listbox, Popover } from "@headlessui/react";
import { Rating } from "@mui/material";

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
  const [
    isAuth,
    setIsAuth,
    navigate,
    location,
    setLocation,
    queryCar,
    setQueryCar,
  ] = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("distance");
  const [garage, setGarage] = useState([]);
  // const [queryCar, setQueryCar] = useState(undefined);
  const [specificService, setSpecificService] = useState("");

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

  shops &&
    console.log(
      shops[1].reviews
        .filter((r) => r.service.join("") === "oil change")
        .map((i) => i)
    );

  const shopListTemplate = (shop) => (
    <li
      key={shop.id}
      className="mx-auto my-3 p-2 rounded shadow-md w-5/6 bg-base-300"
    >
      <div className="flex items-start">
        <Link to={`/shops/${shop.id}`}>
          <h2 className="text-xl font-sans font-medium text-base-content hover:scale-105 hover:text-accent-focus transition-all">
            {shop.name}
          </h2>
        </Link>
      </div>
      <div className="flex items-start">
        <p>
          {shop.distance &&
            shop.distance.toFixed() +
              ` mile${Math.floor(shop.distance) === 1 ? "" : "s"}`}
        </p>
      </div>
      <div className="flex items-start">
           {shop.average === 0 ? <p className="italic text-sm">No reviews</p> : <Rating name="read-only" value={shop.average} precision={1} readOnly/>}
      </div>
      <ul className="text-sm font-light flex flex-wrap">
        {shop.services && shop.services.map((service) => (
          <li
            key={service}
            className={`shadow-sm m-1 px-1 captalize rounded ${
              queryCar && queryCar.service_list.flat().includes(service)
                ? "font-bold bg-accent-focus text-accent-content"
                : "bg-base-300"
            }`}
          >
            <label
              htmlFor={`info-modal-${shop.id}-${service}`}
              className="modal-button cursor-pointer"
            >
              {service}
              <span className="pl-1 inline-block font-extrabold">
                {shop.reviews &&
                shop.reviews.filter((r) => r.service.flat().includes(service)).length ===
                  0
                  ? ""
                  : shop.reviews.filter((r) => r.service.flat().includes(service))
                      .length}
              </span>
            </label>
            <input
              type="checkbox"
              id={`info-modal-${shop.id}-${service}`}
              className="modal-toggle"
            />
            <label htmlFor={`info-modal-${shop.id}-${service}`} className="modal cursor-pointer">
              <label htmlFor="" className="modal-box relative">
                <h3 className="text-xl capitalize font-medium">{service}</h3>
                <p className="text-lg">Reviews:</p>
                <div className="overflow-y-scroll sm:overflow-auto max-h-[150px] sm:max-h-fit">
                <ul className="overflow-y-hidden sm:overflow-auto divide-y">
                  {shop.reviews && shop.reviews
                    .filter((r) => r.service.includes(service))
                    .map((x) => (
                      <li key={x.id} className='flex py-5 ml-3'>
                        <p className="mr-5 font-medium">{x.username}</p>
                         <Rating name="read-only" value={x.rating} precision={1} size='small' readOnly />
                      </li>
                    ))}
                </ul>
                    </div>
              </label>
            </label>
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
        garage && queryCar
          ? `&specific_year=${queryCar.year}&specific_make=${queryCar.make}&specific_model=${queryCar.model}`
          : ``
      }`
    ).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    setShops(json);
  };

  useEffect(() => {
    getServiceShops();
  }, [queryCar]);

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
    setShops(json);
  };

  useEffect(() => {
    location && getDistanceShops();
  }, []);

  const reviewFilteredShops =
    shops &&
    [...shops]
      .sort((a, b) => b.average - a.average)
      .map((i) => shopListTemplate(i));

  const shopList = shops && shops.map((i) => shopListTemplate(i));

  const serviceFilteredShops =
    shops &&
    queryCar &&
    [...shops]
      .sort(
        (a, b) =>
          b.services.filter((s) => queryCar.service_list.flat().includes(s))
            .length -
          a.services.filter((s) => queryCar.service_list.flat().includes(s))
            .length
      )
      .map((i) => shopListTemplate(i));

  const specificServiceListFunc = (service) => {
    const filteredShops =
      shops &&
      [...shops].sort(
        (a, b) =>
          b.reviews.filter((r) => r.service.join("") === service).length -
          a.reviews.filter((r) => r.service.join("") === service).length
      );

    setSpecificService(filteredShops);
    setFilter("specificService");
  };

  const specificServiceFilter =
    specificService && specificService.map((i) => shopListTemplate(i));

  const getLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition((p) => {
      setLocation([p.coords.latitude, p.coords.longitude]);
      setLoading(false);
    });
  };

  return (
    <>
      <div className="flex flex-col w-full items-center bg-base-100 relative">
        <h1 className="font-bold text-lg mt-5 text-base-content">
          Enter Zip code or City, or get current location
        </h1>
        <div className="flex flex-col items-center">
          <div className="flex items-end">
            <input
              className={`mt-3 p-1 shadow-sm rounded-l-md`}
              type="text"
              value={Array.isArray(location) ? "Successful" : location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter ZIP or City, State..."
            />
            <button
              type="button"
              className="p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-r-md shadow-md hover:shadow-lg transition-all"
              onClick={getLocation}
            >
              {location ? (
                <GoCheck />
              ) : loading ? (
                <ImSpinner8 className="animate-spin" />
              ) : (
                <FaLocationArrow />
              )}
            </button>
          </div>
          {isAuth && (
            <div
              className={`relative flex items-center flex-col mt-3 border-t-2 border-stone-500 ${
                location ? "px-16" : "px-48"
              }`}
            >
              {location && (
                <>
                  <p className="font-bold text-xl mt-3">Choose your car</p>
                  <Listbox value={queryCar} onChange={setQueryCar}>
                    {location && (
                      <Listbox.Button className="px-2 text-xl m-2 border-2 border-stone-500 rounded">
                        {queryCar ? queryCar.model : "Car"}
                      </Listbox.Button>
                    )}
                    <Listbox.Options className="absolute top-32 sm:top-20 z-10 bg-stone-300/30 backdrop-blur-sm border-white/30 rounded shadow-sm w-fit p-1">
                      {garage.map((car) => (
                        <Listbox.Option
                          key={car.id}
                          value={car}
                          className="p-1 cursor-pointer"
                        >
                          {car.make} {car.model}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Listbox>
                </>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center mt-3">
          {!isAuth && location && !queryCar && (
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
                      className={`hover:underline mt-2 p-1 rounded ${
                        filter === "distance"
                          ? `font-medium bg-accent text-accent-content`
                          : ``
                      }`}
                      onClick={() => setFilter("distance")}
                    >
                      by Distance
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`hover:underline mt-2 p-1 rounded ${
                        filter === "reviews"
                          ? `font-medium bg-accent text-accent-content`
                          : ``
                      }`}
                      onClick={() => setFilter("reviews")}
                    >
                      by Reviews
                    </button>
                  </li>
                  {isAuth && <li>
                    <button
                      type="button"
                      className={`hover:underline mt-2 p-1 rounded ${
                        filter === "services"
                          ? `font-medium bg-accent text-accent-content`
                          : ``
                      }`}
                      onClick={() => {
                        setFilter("services");
                      }}
                    >
                      by Service
                    </button>
                  </li>}
                </ul>
              </Popover.Panel>
              {location && (
                <Popover.Button className="px-2 text-xl m-2 border-2 border-stone-500 rounded">
                  Sort
                </Popover.Button>
              )}
            </Popover>

            <Popover className="relative">
              <Popover.Panel className="absolute z-30 top-10 bg-white/30 backdrop-blur-sm border-white/30 rounded shadow-sm min-w-max p-1">
                <ul>
                  {queryCar &&
                    queryCar.service_list.flat().map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          className={`hover:underline mt-2 p-1 rounded ${
                            specificService === { s }
                              ? `font-medium bg-accent text-accent-content`
                              : ``
                          }`}
                          onClick={() => {
                            specificServiceListFunc(s);
                          }}
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                </ul>
              </Popover.Panel>
              {isAuth && location && (
                <Popover.Button className="px-2 text-xl m-2 border-2 border-stone-500 rounded">
                  Pick a service
                </Popover.Button>
              )}
            </Popover>
          </div>
        </div>
        {!isAuth && location && (
          <p>
            <Link to="/register" className="link">
              Sign up
            </Link>{" "}
            to access more features
          </p>
        )}
        <ul className="mt-10 md:grid md:grid-cols-2 lg:grid-cols-3">
          {filter === "distance" && shopList}
          {filter === "reviews" && reviewFilteredShops}
          {filter === "services" && serviceFilteredShops}
          {filter === "specificService" && specificServiceFilter}
        </ul>
      </div>
    </>
  );
};

export default ShopList;
