import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

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
  const [shops, setShops] = useState([]);
  // const [isAuth, setIsAuth, navigate, location, setLocation] = useOutletContext();
  // const [filter, setFilter] = useState('all');

  const getShops = async () => {
    const response = await fetch(`/api/v1/shops/`).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    setShops(json);
  };

  // const getDistanceShops = async () => {
  //   const response = await fetch(`/api/v1/shops/?P<${encodeURI(location.join(','))}>/`).catch(handleError);
  //   if(!response.ok) {
  //   throw new Error('Network response not ok');
  //   }
  //   const json = await response.json(); 
  //   console.log(json)
  // }

  useEffect(() => {
    getShops();
  }, []);

  // const filterShopsByDistance = () => {
  //   getDistanceShops();
    
  // }

  const shopList = shops.map((i) => (
    <li
      key={i.id}
      className="mx-auto my-3 p-2 rounded shadow-md w-2/3 bg-stone-400"
    >
      <Link to={`/shops/${i.id}`} className="hover:text-red-900">
      <h2 className="text-lg font-semibold hover:scale-105 transition-all">{i.name}</h2>
      </Link>
      <ul className="text-sm font-light flex flex-wrap">
        {i.services.map((i) => (
          <li key={i} className="bg-stone-300 shadow-sm m-1 px-1 rounded">
            {i}
          </li>
        ))}
      </ul>
    </li>
  ));
  return (
    <>
      <div className="flex flex-col w-full  items-center bg-stone-200">
        <h1 className="font-bold text-3xl">Find My Fix</h1>
        <button type="button" className="p-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md shadow-md hover:shadow-lg transition-all">Search</button>
        <ul className="md:w-1/2">{shopList}</ul>
      </div>
    </>
  );
};

export default ShopList;
