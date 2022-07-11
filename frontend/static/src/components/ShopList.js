import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Cookies from "js-cookie";

function handleError(err) {
  console.warn(err);
}

// this is here to show all shops in the database, will probably not get used in prod.
// need to implement some sort of checkbox/selection menu or search w/ filtering so users
// can pull up relevant shops based off of the services needed on their car.
// could also look into just having a search page for users both auth and unauth where they
// can bring up any or all shops and filter that way.... 🤷🏼
// need to come to this component and have a search button/or something to search for shops when user is unauth
// they can filter these results by location, reviews based on a service

const ShopList = () => {
  const [shops, setShops] = useState(undefined);
  const [open, setOpen] = useState(false)
  const [isAuth, setIsAuth, navigate, location, setLocation] = useOutletContext();
  const [loading, setLoading] = useState(false)
  // const [filter, setFilter] = useState('all');

  // const getShops = async () => {
  //   const response = await fetch(`/api/v1/shops/`).catch(handleError);
  //   if (!response.ok) {
  //     throw new Error("Network response not ok");
  //   }
  //   const json = await response.json();
  //   setShops(json);
  // };

  const getDistanceShops = async () => {
    const response = await fetch(`/api/v1/shops/?location_string=${location.join(',')}`).catch(handleError);
    if(!response.ok) {
    throw new Error('Network response not ok');
    }
    const json = await response.json();
    console.log(json)
    setShops(json)
  }

  const shopList = shops && shops.map((i) => (
    <li
      key={i.id}
      className="mx-auto my-3 p-2 rounded shadow-md w-2/3 bg-stone-400"
    >
      <Link to={`/shops/${i.id}`} className="hover:text-red-900">
        <h2 className="text-lg font-semibold hover:scale-105 transition-all">
          {i.name}
        </h2>
      </Link>
      <div>
        <p>{i.distance && i.distance.toFixed() + ' miles'}</p>
      </div>
      <ul className="text-sm font-light flex flex-wrap">
        {i.services.map((i) => (
          <li key={i} className="bg-stone-300 shadow-sm m-1 px-1 rounded">
            {i}
          </li>
        ))}
      </ul>
    </li>
  ));


  const getShopsByReviews = async() => {
    const response = await fetch(`/api/v1/shops/sorted_reviews/`).catch(handleError);
    if(!response.ok) {
    throw new Error('Network response not ok');
    }
    const json = await response.json(); 
    console.log(json)
    setShops(json);
  }

  const getLocation = () => {
    setLoading(true)
    navigator.geolocation.getCurrentPosition((p) => {
      console.log(p.coords.latitude, p.coords.longitude);
      setLocation([p.coords.latitude, p.coords.longitude]);
      setLoading(false)
    });
  };


  return (
    <>
      <div className="flex flex-col w-full  items-center bg-stone-200 relative">
        <h1 className="font-bold text-xl mt-5">Enter your location to find shops</h1>
{!location && <button
          type="button"
          className="p-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md shadow-md hover:shadow-lg transition-all"
          onClick={getLocation}
        >
          Get My Location
        </button>}
        {location && <button type="button" className="px-1 rounded text-emerald-700 border-emerald-700 border-2 hover:bg-emerald-700 hover:text-white transition-all mt-3" onClick={getDistanceShops}>Find My Fix!</button>}
{location && <button
          type="button"
          className="px-1 m-3 rounded border-2 border-stone-600 hover:bg-stone-500 hover:text-white transition-all"
          onClick={() => setOpen(!open)}
        >
          Filter
        </button>}
        <div className={`bg-stone-400/50 border-2 border-black rounded absolute top-28 ${open ? `` : `hidden`}`}>
          <ul>
            <li>
              <button type="button" className="underline m-1" onClick={getDistanceShops}>
                by Distance
              </button>
            </li>
            <li>
              <button type="button" className="underline m-1" onClick={getShopsByReviews}>
                by Reviews
              </button>
            </li>
          </ul>
        </div>
        <ul className="mt-10 md:grid md:grid-cols-2 lg:grid-cols-3">{shopList}</ul>
      </div>
    </>
  );
};

export default ShopList;
