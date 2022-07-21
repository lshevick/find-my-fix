import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { FaLocationArrow } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { GoCheck } from "react-icons/go";
import { Listbox, Popover } from "@headlessui/react";
import { Rating } from "@mui/material";
import { BsCaretDownFill } from "react-icons/bs";

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
  const { isAuth, location, setLocation, queryCar, setQueryCar } =
    useOutletContext();
  const [loading, setLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [filter, setFilter] = useState("distance");
  const [garage, setGarage] = useState([]);
  // const [specificService, setSpecificService] = useState("");
  const [exactLocation, setExactLocation] = useState("");
  const [error, setError] = useState("");

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
      <div className="flex items-center">
        {shop.average === 0 ? (
          <p className="italic text-sm">No reviews</p>
        ) : (
          <>
            <Rating
              name="read-only"
              value={shop.average}
              precision={1}
              readOnly
            />
            <p className="text-sm px-2 italic">{shop.reviews.length} Reviews</p>
          </>
        )}
      </div>
      <ul className="text-sm font-light flex flex-wrap">
        {shop.services &&
          shop.services.map((service) => (
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
                  shop.reviews.filter((r) => r.service.flat().includes(service))
                    .length === 0
                    ? ""
                    : shop.reviews.filter((r) =>
                        r.service.flat().includes(service)
                      ).length}
                </span>
              </label>
              <input
                type="checkbox"
                id={`info-modal-${shop.id}-${service}`}
                className="modal-toggle"
              />
              <label
                htmlFor={`info-modal-${shop.id}-${service}`}
                className="modal cursor-pointer"
              >
                <label htmlFor="" className="modal-box relative">
                  <h3 className="text-xl capitalize font-medium">{service}</h3>
                  <p className="text-lg">Reviews:</p>
                  <div className="overflow-y-scroll sm:overflow-auto max-h-[150px] sm:max-h-fit">
                    <ul className="overflow-y-hidden sm:overflow-auto divide-y">
                      {shop.reviews &&
                        shop.reviews
                          .filter((r) => r.service.includes(service))
                          .map((x) => (
                            <li key={x.id} className="flex py-5 ml-3">
                              <p className="mr-5 font-medium">{x.username}</p>
                              <Rating
                                name="read-only"
                                value={x.rating}
                                precision={1}
                                size="small"
                                readOnly
                              />
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
    setContentLoading(true);
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
    setContentLoading(false);
    setShops(json);
  };

  // useEffect(() => {
  //   getServiceShops();
  //   // eslint-disable-next-line
  // }, [queryCar]);

  const getDistanceShops = async () => {
    setContentLoading(true);
    const response = await fetch(
      `/api/v1/shops/?location_string=${
        Array.isArray(location) ? location.join(",") : location
      }`
    ).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    setContentLoading(false);
    setShops(json);
  };

  const handleShopSubmit = (e) => {
    e.preventDefault();
    queryCar ? getServiceShops() : getDistanceShops();
  };

  useEffect(() => {
    location && getServiceShops();
    location && !queryCar && getDistanceShops();
    // eslint-disable-next-line
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

  // const specificServiceListFunc = (service) => {
  //   const filteredShops =
  //     shops &&
  //     [...shops].sort(
  //       (a, b) =>
  //         b.reviews.filter((r) => r.service.join("") === service).length -
  //         a.reviews.filter((r) => r.service.join("") === service).length
  //     );

  //   setSpecificService(filteredShops);
  //   console.log(filteredShops);
  //   setFilter("specificService");
  // };

  // const specificServiceFilter =
  //   specificService && specificService.map((i) => shopListTemplate(i));

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("This browser doesn't support this feature :(");
    } else {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (p) => {
          setLocation([p.coords.latitude, p.coords.longitude]);
          setLoading(false);
        },
        () => {
          setError("Can't get location :(");
          setLoading(false);
        }
      );
    }
  };

  const getFormattedAddress = async () => {
    const response = await fetch(
      `/api/v1/shops/location/?location_string=${location}`
    ).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    console.log(json);
    setExactLocation(json);
  };

  useEffect(() => {
    Array.isArray(location) && getFormattedAddress();
    // eslint-disable-next-line
  }, [location]);

  return (
    <>
      <div className="flex flex-col w-full items-center bg-base-100 relative">
        <h1 className="font-bold text-lg mt-5 text-base-content">
          In order to find shops near you, <br />
          enter your Zip code or City, or get current location.
        </h1>
        <div className="flex flex-col items-center">
          <form onSubmit={handleShopSubmit}>
            <div className="flex items-end">
              <input
                className={`mt-3 p-1 shadow-sm rounded-l-md`}
                type="text"
                value={Array.isArray(location) ? exactLocation : location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter ZIP or City..."
              />
              <div
                className="tooltip tooltip-bottom"
                data-tip="gets precise location"
              >
                <button
                  type="button"
                  className="p-2 bg-accent-focus hover:bg-accent text-white rounded-r-md shadow-md hover:shadow-lg transition-all"
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
            </div>
            <div className="mt-3">
              <button
                type="submit"
                className={`px-1 text-xl rounded text-accent border-accent border-2 ${
                  location && "hover:bg-accent hover:text-accent-content"
                } transition-all disabled:border-stone-600 disabled:text-stone-600 
                `}
                disabled={!location}
              >
                Find My Fix!
              </button>
            </div>
          </form>
          <div
            className={error ? "fixed inset-0 bg-black/20 backdrop-blur" : ""}
          ></div>
          <div
            className={
              error
                ? "bg-base-300 absolute rounded-lg shadow-2xl p-4 z-50"
                : "hidden"
            }
          >
            <p className="text-2xl text-base-content p-3">{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              className=" m-3 p-2 border-2 border-base-content rounded-md hover:bg-base-content hover:text-base-300 transition-all text-base-content"
            >
              Close
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
                        {({ open }) => (
                          <>
                            {queryCar ? queryCar.model : "Car"}{" "}
                            <BsCaretDownFill
                              className={`transition-all inline-block ${
                                open ? "rotate-180" : ``
                              }`}
                            />
                          </>
                        )}
                      </Listbox.Button>
                    )}
                    <Listbox.Options className="absolute top-20 sm:top-20 z-10 bg-gray-600/30 backdrop-blur-sm border-white/30 rounded shadow-sm w-fit p-1">
                      {garage.map((car) => (
                        <Listbox.Option
                          key={car.id}
                          value={car}
                          className={`p-1 cursor-pointer ${queryCar && queryCar.id === car.id ? 'bg-accent' : ''}`}
                        >
                         {car.year} {car.make} {car.model}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Listbox>
                </>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-center mt-3">
          <div className="flex">
            <Popover className="relative">
              <Popover.Panel className="absolute z-30 top-16 inset-x-0 bg-gray-600/30 backdrop-blur-sm border-white/30 rounded shadow-sm min-w-max p-1">
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
                      by distance
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
                      by reviews
                    </button>
                  </li>
                  {isAuth && queryCar && (
                    <li>
                      <button
                        type="button"
                        className={`hover:underline mt-2 p-1 rounded ${
                          filter === "services"
                            ? `font-medium bg-accent text-accent-content`
                            : ``
                        }`}
                        onClick={() => {
                          setFilter("service");
                        }}
                      >
                        by service
                      </button>
                    </li>
                  )}
                </ul>
              </Popover.Panel>
              <div></div>
              <div className={location && "tooltip"} data-tip="Filters">
                <Popover.Button
                  className={` ${
                    location ? "visible" : "invisible"
                  } px-2 text-xl m-2 border-2 border-stone-500 rounded min-w-[180px]`}
                >
                  {({ open }) => (
                    <>
                      By{" "}
                      {filter === "specificService"
                        ? " specific service"
                        : filter}{" "}
                      <BsCaretDownFill
                        className={`inline-block transition-all ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </>
                  )}
                </Popover.Button>
              </div>
            </Popover>
            {/* {isAuth && (
              <Popover className="relative">
                <Popover.Panel className="absolute z-30 sm:top-20 top-28 inset-x-0 bg-gray-600/30 backdrop-blur-sm border-white/30 rounded shadow-sm min-w-max p-1">
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
                <div></div>
                {isAuth && location && (
                  <div className="tooltip" data-tip="Sorts by service reviews">
                    <Popover.Button className="px-2 text-xl m-2 border-2 border-stone-500 rounded">
                      {({ open }) => (
                        <>
                          Specify a service
                          <BsCaretDownFill
                            className={`inline-block transition-all ${
                              open ? "rotate-180" : ""
                            }`}
                          />
                        </>
                      )}
                    </Popover.Button>
                  </div>
                )}
              </Popover>
            )} */}
          </div>
        </div>
        <p className={`${!isAuth && location ? "visible" : "invisible"}`}>
          <Link to="/register" className="link">
            Sign up
          </Link>{" "}
          to access more features
        </p>
          <div className={`text-5xl mt-10 animate-spin ${contentLoading ? '' : 'hidden'}`}><ImSpinner8/></div>
        <ul className="mt-10 md:grid md:grid-cols-2 lg:grid-cols-3">
          {filter === "distance" && shopList}
          {filter === "reviews" && reviewFilteredShops}
          {filter === "service" && serviceFilteredShops}
          {/* {filter === "specificService" && specificServiceFilter} */}
        </ul>
      </div>
    </>
  );
};

export default ShopList;
