import { useEffect, useState } from "react";

function handleError(err) {
  console.warn(err);
}

const ShopList = () => {
  const [shops, setShops] = useState([]);

  const getShops = async () => {
    const response = await fetch(`/api/v1/shops/`).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    setShops(json);
  };

  useEffect(() => {
    getShops();
  }, []);

  const shopList = shops.map((i) => (
    <li key={i.name} className='mx-auto my-3 w-2/3 bg-stone-400'>
      <h2>{i.name}</h2>
      <p>{i.phone}</p>
      <p>{i.address}</p>
      <ul>
        {i.services.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </li>
  ));
  return (
    <>
      <div className="flex w-full justify-center">
        <ul className="w-full bg-stone-200">{shopList}</ul>
      </div>
    </>
  );
};

export default ShopList;
